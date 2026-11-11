/* ==========================================================
   MiniNode — a tiny in-browser simulation of Node.js + Express
   so students can practise server code on a phone or a
   computer without installing anything.

   It imitates the parts of Express used in this module:
     express(), app.use, app.get/post/put/patch/delete,
     app.listen, express.json(), req.params/query/body,
     res.status/json/send/sendStatus/set, and a fetch() that
     routes http://localhost:<port> requests to the simulated
     server. Other URLs go to the real internet.

   It is a teaching tool, not real Node. On a real computer the
   same code runs with:  npm install express cors  &&  node server.js
   ========================================================== */
(function (global) {
  "use strict";

  const STATUS = {
    200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request",
    401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
    409: "Conflict", 422: "Unprocessable Entity", 500: "Internal Server Error"
  };

  // port -> app
  const servers = {};
  let lastPort = null;
  let logger = function () { (global.console || {}).log.apply(global.console, arguments); };

  function matchPath(pattern, path) {
    if (pattern === "*" || pattern === "/*") return {};
    const pp = pattern.replace(/\/+$/, "").split("/");
    const ap = path.replace(/\/+$/, "").split("/");
    if (pp.length !== ap.length) return null;
    const params = {};
    for (let i = 0; i < pp.length; i++) {
      if (pp[i].startsWith(":")) params[pp[i].slice(1)] = decodeURIComponent(ap[i]);
      else if (pp[i] !== ap[i]) return null;
    }
    return params;
  }

  function prefixMatch(prefix, path) {
    if (!prefix || prefix === "/") return true;
    return path === prefix || path.startsWith(prefix.replace(/\/+$/, "") + "/");
  }

  function express() {
    const stack = []; // {kind:'mw'|'route', method, path, handlers}

    function addRoute(method) {
      return function (path) {
        const handlers = Array.prototype.slice.call(arguments, 1);
        stack.push({ kind: "route", method: method, path: path, handlers: handlers });
        return app;
      };
    }

    const app = {
      use: function (a, b) {
        if (typeof a === "function") stack.push({ kind: "mw", path: "/", handlers: [a] });
        else stack.push({ kind: "mw", path: a, handlers: [b] });
        return app;
      },
      get: addRoute("GET"),
      post: addRoute("POST"),
      put: addRoute("PUT"),
      patch: addRoute("PATCH"),
      delete: addRoute("DELETE"),
      listen: function (port, cb) {
        port = Number(port) || 3000;
        servers[port] = app;
        lastPort = port;
        app._port = port;
        setTimeout(function () { if (typeof cb === "function") cb(); }, 0);
        return { close: function () { delete servers[port]; } };
      },
      _handle: function (req) {
        return new Promise(function (resolve) {
          let finished = false;
          const res = {
            statusCode: 200,
            headers: {},
            headersSent: false,
            status: function (code) { res.statusCode = code; return res; },
            set: function (k, v) { res.headers[String(k).toLowerCase()] = String(v); return res; },
            header: function (k, v) { return res.set(k, v); },
            json: function (obj) {
              res.set("content-type", "application/json");
              return finish(JSON.stringify(obj === undefined ? null : obj));
            },
            send: function (body) {
              if (body !== null && typeof body === "object") return res.json(body);
              if (!res.headers["content-type"]) res.set("content-type", "text/html");
              return finish(body === undefined ? "" : String(body));
            },
            sendStatus: function (code) {
              res.statusCode = code;
              res.set("content-type", "text/plain");
              return finish(STATUS[code] || String(code));
            },
            end: function (body) { return finish(body === undefined ? "" : String(body)); }
          };
          function finish(body) {
            if (finished) {
              logger("[server] Error: Cannot set headers after they are sent to the client (you called res.send/json twice).");
              return res;
            }
            finished = true;
            res.headersSent = true;
            resolve({ status: res.statusCode, headers: res.headers, body: body });
            return res;
          }

          let i = 0;
          function next(err) {
            if (finished) return;
            if (err) return fail(err);
            while (i < stack.length) {
              const layer = stack[i++];
              if (layer.kind === "mw") {
                if (!prefixMatch(layer.path, req.path)) continue;
                return run(layer.handlers, {});
              } else {
                if (layer.method !== req.method) continue;
                const params = matchPath(layer.path, req.path);
                if (!params) continue;
                return run(layer.handlers, params);
              }
            }
            // nothing matched — Express's default 404
            res.status(404).set("content-type", "text/html")
              .send("Cannot " + req.method + " " + req.path);
          }
          function run(handlers, params) {
            let h = 0;
            req.params = params;
            function step(err) {
              if (err) return fail(err);
              if (h >= handlers.length) return next();
              const fn = handlers[h++];
              try {
                const r = fn(req, res, step);
                if (r && typeof r.then === "function") r.catch(fail);
              } catch (e) { fail(e); }
            }
            step();
          }
          function fail(e) {
            logger("[server] " + (e && e.stack ? String(e.stack).split("\n")[0] : e));
            if (!finished) res.status(500).set("content-type", "text/html").send("Internal Server Error");
          }

          setTimeout(function () {
            if (!finished) {
              logger("[server] Warning: request " + req.method + " " + req.path +
                " never got a response. Did you forget res.send() or res.json()?");
              finished = true;
              resolve({ status: 0, headers: {}, body: "", timeout: true });
            }
          }, 4000);

          next();
        });
      }
    };
    return app;
  }

  express.json = function () {
    return function jsonParser(req, res, next) {
      const ct = (req.headers["content-type"] || "").toLowerCase();
      if (req.rawBody != null && ct.indexOf("application/json") !== -1) {
        try { req.body = JSON.parse(req.rawBody); }
        catch (e) {
          return res.status(400).send("Bad Request: body is not valid JSON");
        }
      }
      next();
    };
  };
  express.static = function () {
    // In the simulator the page itself plays the role of the static files.
    return function (req, res, next) { next(); };
  };
  express.urlencoded = function () { return function (req, res, next) { next(); }; };

  function cors(opts) {
    const origin = (opts && opts.origin) || "*";
    return function (req, res, next) {
      res.set("Access-Control-Allow-Origin", origin);
      next();
    };
  }

  function makeResponse(r, url) {
    const text = r.body == null ? "" : String(r.body);
    return {
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      statusText: STATUS[r.status] || "",
      url: url,
      headers: { get: function (k) { return r.headers[String(k).toLowerCase()] || null; } },
      text: function () { return Promise.resolve(text); },
      json: function () {
        return new Promise(function (resolve, reject) {
          try { resolve(JSON.parse(text)); }
          catch (e) {
            reject(new SyntaxError("Unexpected token '" + (text.trim()[0] || " ") +
              "', \"" + text.slice(0, 30) + "\" is not valid JSON"));
          }
        });
      }
    };
  }

  // Build a fetch() that routes localhost requests to simulated servers.
  // opts.cors = true  -> behave like a browser page at opts.pageOrigin
  function makeFetch(opts) {
    opts = opts || {};
    const realFetch = global.fetch ? global.fetch.bind(global) : null;
    const pageOrigin = opts.pageOrigin || "http://localhost:5500";

    return function fetch(input, init) {
      init = init || {};
      const raw = String(input);
      const isRelative = raw.startsWith("/");
      const defaultPort = lastPort || 3000;
      let url;
      try { url = new URL(raw, "http://localhost:" + defaultPort); }
      catch (e) { return Promise.reject(new TypeError("Invalid URL: " + raw)); }

      const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
      if (!local) {
        if (!realFetch) return Promise.reject(new TypeError("No network available"));
        return realFetch(raw, init);
      }

      const port = Number(url.port) || 80;
      const app = servers[port];
      const method = String(init.method || "GET").toUpperCase();

      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (!app) {
            reject(new TypeError("Failed to fetch — nothing is listening on " + url.origin +
              " (is the server running? did you call app.listen(" + port + ")?)"));
            return;
          }
          const headers = {};
          const h = init.headers || {};
          Object.keys(h).forEach(function (k) { headers[k.toLowerCase()] = h[k]; });
          const req = {
            method: method,
            url: url.pathname + url.search,
            path: url.pathname,
            query: Object.fromEntries(url.searchParams.entries()),
            headers: headers,
            rawBody: init.body == null ? null : String(init.body),
            body: undefined,
            params: {}
          };
          app._handle(req).then(function (r) {
            if (r.timeout) {
              reject(new TypeError("Failed to fetch — the server never responded"));
              return;
            }
            const crossOrigin = opts.cors && !isRelative && url.origin !== pageOrigin;
            if (crossOrigin && !r.headers["access-control-allow-origin"]) {
              logger("Access to fetch at '" + url.href + "' from origin '" + pageOrigin +
                "' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.");
              reject(new TypeError("Failed to fetch"));
              return;
            }
            resolve(makeResponse(r, url.href));
          });
        }, 200 + Math.random() * 150);
      });
    };
  }

  function requireShim(name) {
    if (name === "express") return express;
    if (name === "cors") return cors;
    throw new Error("Cannot find module '" + name + "' in this simulator. " +
      "On a real computer you would run: npm install " + name);
  }

  global.MiniNode = {
    express: express,
    cors: cors,
    require: requireShim,
    makeFetch: makeFetch,
    reset: function () { Object.keys(servers).forEach(function (k) { delete servers[k]; }); lastPort = null; },
    setLogger: function (fn) { logger = fn; },
    process: { env: { NODE_ENV: "development" }, version: "v22 (simulated)" }
  };
})(typeof window !== "undefined" ? window : globalThis);
