/* ==========================================================
   JS Essentials & Integration — Self-Paced Module (IPT1)
   Shared behaviour: navigation, progress, code runners,
   syntax highlighting, quizzes.
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Module map (edit here to add/rename lessons) ---------- */
  const MODULE = {
    title: "JavaScript Essentials & Integration",
    short: "JS Essentials Module",
    course: "IPT1 · Integrative Programming and Technologies",
    author: "Prof. Rowell John B. Artiaga, DIT",
    school: "College of Engineering and Computational Sciences · Partido State University"
  };

  const LESSONS = [
    { id: "home", file: "index.html", num: "★", title: "Start Here", group: "Start" },
    { id: "l1", file: "lesson-1.html", num: "1", title: "Meet JavaScript", desc: "Where JS runs, values, variables, types and operators.", time: "45 min", group: "Part A · JavaScript Essentials" },
    { id: "l2", file: "lesson-2.html", num: "2", title: "Decisions, Loops & Functions", desc: "if/else, loops, and writing reusable functions.", time: "50 min", group: "Part A · JavaScript Essentials" },
    { id: "l3", file: "lesson-3.html", num: "3", title: "Arrays, Objects & JSON", desc: "Organising data, map/filter, and JSON — the language of integration.", time: "50 min", group: "Part A · JavaScript Essentials" },
    { id: "l4", file: "lesson-4.html", num: "4", title: "JavaScript in the Browser", desc: "The DOM, events, and making a web page respond.", time: "50 min", group: "Part B · The Front End" },
    { id: "l5", file: "lesson-5.html", num: "5", title: "Asynchronous JS & fetch()", desc: "Promises, async/await, and calling a real API.", time: "60 min", group: "Part B · The Front End" },
    { id: "l6", file: "lesson-6.html", num: "6", title: "JavaScript on the Server", desc: "Node.js, npm and building a REST API with Express.", time: "60 min", group: "Part C · Integration" },
    { id: "l7", file: "lesson-7.html", num: "7", title: "Connecting Front End & Back End", desc: "The full loop: page → fetch → Express → JSON → page. CORS too.", time: "60 min", group: "Part C · Integration" },
    { id: "l8", file: "lesson-8.html", num: "8", title: "JavaScript Across Integration", desc: "WebSockets, databases, mobile, serverless, WebAssembly, CI/CD.", time: "60 min", group: "Part C · Integration" },
    { id: "cap", file: "capstone.html", num: "✓", title: "Portfolio Output & Report", desc: "Your module output and progress report.", time: "—", group: "Finish" },
    { id: "glo", file: "glossary.html", num: "A–Z", title: "Glossary", group: "Finish" }
  ];
  const COUNTED = LESSONS.filter(function (l) { return /^l\d$/.test(l.id); });

  /* ---------- Storage (safe) ---------- */
  const KEY = "ipt1-js-module-v1";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage off */ } }
  let state = load();
  state.done = state.done || {};
  state.quiz = state.quiz || {};

  /* ---------- Theme ---------- */
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); }
  let theme = state.theme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(theme);

  /* ---------- Helpers ---------- */
  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function doneCount() { return COUNTED.filter(function (l) { return state.done[l.id]; }).length; }

  /* ---------- Value formatter (like Node's console) ---------- */
  function inspect(v, depth, seen) {
    depth = depth || 0; seen = seen || [];
    const t = typeof v;
    if (v === null) return "null";
    if (t === "undefined") return "undefined";
    if (t === "string") return depth ? "'" + v + "'" : v;
    if (t === "number" || t === "boolean" || t === "bigint") return String(v);
    if (t === "symbol") return v.toString();
    if (t === "function") return "[Function: " + (v.name || "anonymous") + "]";
    if (v instanceof Error) return v.name + ": " + v.message;
    if (typeof Promise !== "undefined" && v instanceof Promise) return "Promise { <pending> }";
    if (seen.indexOf(v) !== -1) return "[Circular]";
    if (depth > 4) return Array.isArray(v) ? "[Array]" : "[Object]";
    seen = seen.concat([v]);
    if (Array.isArray(v)) {
      const items = v.map(function (x) { return inspect(x, depth + 1, seen); });
      const one = "[ " + items.join(", ") + " ]";
      if (!items.length) return "[]";
      if (one.length <= 72 && one.indexOf("\n") === -1) return one;
      const pad = "  ".repeat(depth + 1);
      return "[\n" + pad + items.join(",\n" + pad) + "\n" + "  ".repeat(depth) + "]";
    }
    if (typeof Node !== "undefined" && v instanceof Node) return "<" + (v.nodeName || "node").toLowerCase() + ">";
    const keys = Object.keys(v);
    if (!keys.length) return "{}";
    const parts = keys.map(function (k) {
      const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : "'" + k + "'";
      return key + ": " + inspect(v[k], depth + 1, seen);
    });
    const one = "{ " + parts.join(", ") + " }";
    if (one.length <= 72 && one.indexOf("\n") === -1) return one;
    const pad = "  ".repeat(depth + 1);
    return "{\n" + pad + parts.join(",\n" + pad) + "\n" + "  ".repeat(depth) + "}";
  }

  function tableText(data) {
    if (!data || typeof data !== "object") return inspect(data);
    const rows = Array.isArray(data) ? data : Object.keys(data).map(function (k) { return data[k]; });
    const idx = Array.isArray(data) ? rows.map(function (_, i) { return String(i); }) : Object.keys(data);
    const cols = [];
    rows.forEach(function (r) {
      if (r && typeof r === "object") Object.keys(r).forEach(function (k) { if (cols.indexOf(k) === -1) cols.push(k); });
    });
    const header = ["(index)"].concat(cols.length ? cols : ["Values"]);
    const body = rows.map(function (r, i) {
      const cells = cols.length
        ? cols.map(function (c) { return r && r[c] !== undefined ? inspect(r[c], 1) : ""; })
        : [inspect(r, 1)];
      return [idx[i]].concat(cells);
    });
    const widths = header.map(function (h, c) {
      return Math.max.apply(null, [h.length].concat(body.map(function (b) { return String(b[c]).length; })));
    });
    function line(cells) { return "│ " + cells.map(function (x, c) { return String(x).padEnd(widths[c]); }).join(" │ ") + " │"; }
    const sep = function (l, m, r) { return l + widths.map(function (w) { return "─".repeat(w + 2); }).join(m) + r; };
    return [sep("┌", "┬", "┐"), line(header), sep("├", "┼", "┤")].concat(body.map(line), [sep("└", "┴", "┘")]).join("\n");
  }

  /* ---------- Syntax highlighting (VS Code Dark+ style tokens) ---------- */
  const KW_STORAGE = "const|let|var|function|class|extends|new|this|typeof|instanceof|async|of|in|void|delete|static|get|set";
  const KW_CONTROL = "return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|import|from|export|default|await|yield";
  const KW_CONST = "true|false|null|undefined|NaN|Infinity";
  const JS_RE = new RegExp(
    "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" +                                                  // 1 comment
    "|(`(?:\\\\[\\s\\S]|[^`\\\\])*`|'(?:\\\\.|[^'\\\\\\n])*'|\"(?:\\\\.|[^\"\\\\\\n])*\")" +      // 2 string
    "|\\b(" + KW_CONTROL + ")\\b" +                                                            // 3 control keyword
    "|\\b(" + KW_STORAGE + ")\\b" +                                                            // 4 storage keyword
    "|\\b(" + KW_CONST + ")\\b" +                                                              // 5 constant
    "|\\b(\\d+(?:\\.\\d+)?)\\b" +                                                              // 6 number
    "|([A-Za-z_$][\\w$]*)(?=\\s*\\()" +                                                        // 7 function call/def
    "|\\.([A-Za-z_$][\\w$]*)(?![\\w$]|\\s*\\()" +                                                    // 8 .property
    "|\\b([A-Z][\\w$]*)\\b",                                                                   // 9 Class / global
    "g");
  const JS_CLS = [null, "com", "str", "ctl", "kw", "con", "num", "fn", "prop", "type"];

  function tokJS(src, out) {
    let last = 0, m;
    const re = new RegExp(JS_RE.source, "g");   // local copy: tokJS can re-enter for ${ }
    while ((m = re.exec(src))) {
      if (m.index > last) out.push([null, src.slice(last, m.index)]);
      let cls = null;
      for (let g = 1; g < JS_CLS.length; g++) if (m[g] !== undefined) { cls = JS_CLS[g]; break; }
      // template literal: highlight ${ } placeholders inside
      if (cls === "str" && m[0][0] === "`" && m[0].indexOf("${") !== -1) {
        const s = m[0];
        let i = 0, buf = "";
        while (i < s.length) {
          if (s[i] === "$" && s[i + 1] === "{") {
            if (buf) out.push(["str", buf]); buf = "";
            let depth = 1, j = i + 2;
            while (j < s.length && depth) { if (s[j] === "{") depth++; else if (s[j] === "}") depth--; j++; }
            out.push(["punc", "${"]);
            tokJS(s.slice(i + 2, j - 1), out);
            out.push(["punc", "}"]);
            i = j;
          } else { buf += s[i++]; }
        }
        if (buf) out.push(["str", buf]);
      } else if (cls === "prop") {
        out.push([null, "."]); out.push(["prop", m[8]]);
      } else {
        out.push([cls, m[0]]);
      }
      last = re.lastIndex;
    }
    if (last < src.length) out.push([null, src.slice(last)]);
    return out;
  }

  function tokTags(s, out) {
    let last = 0, m;
    const re = /(<!--[\s\S]*?-->)|(<\/?)([a-zA-Z][\w-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?>)/g;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push([null, s.slice(last, m.index)]);
      if (m[1]) out.push(["com", m[1]]);
      else {
        out.push(["tagp", m[2]]); out.push(["tag", m[3]]);
        const ar = /(\s+)([\w:-]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+))?/g;
        let a;
        while ((a = ar.exec(m[4]))) {
          out.push([null, a[1]]); out.push(["attr", a[2]]);
          if (a[3]) { out.push([null, a[3]]); out.push(["str", a[4]]); }
        }
        out.push(["tagp", m[5]]);
      }
      last = re.lastIndex;
    }
    if (last < s.length) out.push([null, s.slice(last)]);
    return out;
  }
  function tokHTML(src) {
    const out = [];
    let last = 0, m;
    const re = /(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2>)/gi;
    while ((m = re.exec(src))) {
      tokTags(src.slice(last, m.index), out);
      tokTags(m[1], out);
      if (m[2].toLowerCase() === "script") tokJS(m[3], out);
      else tokCSS(m[3], out);
      tokTags(m[4], out);
      last = re.lastIndex;
    }
    tokTags(src.slice(last), out);
    return out;
  }
  function tokCSS(s, out) {
    let last = 0, m;
    const re = /(\/\*[\s\S]*?\*\/)|([\w-]+)(?=\s*:[^;{}]*[;}])|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|s)?\b)|([^{}\s][^{}]*?)(?=\s*\{)/g;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push([null, s.slice(last, m.index)]);
      out.push([m[1] ? "com" : m[2] ? "prop" : m[3] ? "num" : "fn", m[0]]);
      last = re.lastIndex;
    }
    if (last < s.length) out.push([null, s.slice(last)]);
    return out;
  }
  function tokPlain(src, lang) {
    const out = [];
    src.split(/(\n)/).forEach(function (part) {
      if (part === "\n") out.push([null, part]);
      else if (/^\s*#/.test(part)) out.push(["com", part]);
      else if (lang === "yaml") {
        const m = part.match(/^(\s*-?\s*)([\w.-]+)(:)(.*)$/);
        if (m) { out.push([null, m[1]]); out.push(["prop", m[2]]); out.push([null, m[3]]);
          const v = m[4].replace(/(\s+#.*)$/, ""); const c = m[4].slice(v.length);
          out.push(["str", v]); if (c) out.push(["com", c]); }
        else out.push([null, part]);
      } else if (lang === "bash") {
        const m = part.match(/^(\s*)(\S+)(.*?)(\s+#.*)?$/);
        if (m) { out.push([null, m[1]]); out.push(["fn", m[2]]); out.push([null, m[3]]); if (m[4]) out.push(["com", m[4]]); }
        else out.push([null, part]);
      } else out.push([null, part]);
    });
    return out;
  }
  function tokenize(src, lang) {
    if (lang === "html") return tokHTML(src);
    if (lang === "bash" || lang === "yaml" || lang === "text") return tokPlain(src, lang);
    return tokJS(src, []);
  }

  // Render tokens as one <span class="ide-line"> per line (so numbers align even when lines wrap)
  function renderLines(src, lang, activeLine) {
    const toks = tokenize(src, lang);
    const lines = [[]];
    toks.forEach(function (t) {
      const parts = t[1].split("\n");
      parts.forEach(function (p, i) {
        if (i > 0) lines.push([]);
        if (p) lines[lines.length - 1].push(t[0] ? '<span class="tk-' + t[0] + '">' + esc(p) + "</span>" : esc(p));
      });
    });
    return lines.map(function (l, i) {
      return '<span class="ide-line' + (i === activeLine ? " active" : "") + '">' + (l.join("") || "​") + "</span>";
    }).join("");
  }
  function highlight(src, lang) {   // kept for any inline use
    return renderLines(src, lang, -1);
  }
  function dedent(s) {
    s = s.replace(/^\n+/, "").replace(/\s+$/, "");
    const lines = s.split("\n");
    const ind = lines.filter(function (l) { return l.trim(); })
      .reduce(function (min, l) { return Math.min(min, l.match(/^ */)[0].length); }, 99);
    return lines.map(function (l) { return l.slice(ind); }).join("\n");
  }

  const LANG_NAME = { js: "JavaScript", html: "HTML", bash: "Shell", yaml: "YAML", text: "Plain Text", json: "JSON" };
  const DEFAULT_FILE = { js: "script.js", html: "index.html", yaml: "config.yml", json: "data.json" };
  function fileIcon(name, lang) {
    const ext = (name.match(/\.(\w+)$/) || [])[1] || lang;
    const map = { js: ["JS", "#f1e05a"], jsx: ["JSX", "#61dafb"], json: ["{}", "#cbcb41"], html: ["<>", "#e44d26"],
      yml: ["Y", "#cb171e"], yaml: ["Y", "#cb171e"], md: ["M", "#519aba"], env: ["$", "#e5c07b"] };
    const v = map[ext] || ["≡", "#9da5b4"];
    return '<span class="ide-ficon" style="color:' + v[1] + '">' + esc(v[0]) + "</span>";
  }
  function splitFileLabel(label) {
    const m = String(label).match(/^(.*?)\s*\((.*)\)\s*$/);
    return m ? { name: m[1], note: m[2] } : { name: label, note: "" };
  }
  function titleBar(fileLabel, lang, extraRight) {
    const f = splitFileLabel(fileLabel);
    const term = lang === "bash";
    return '<div class="ide-titlebar"><span class="ide-dots"><i></i><i></i><i></i></span>' +
      '<span class="ide-tab">' + (term ? '<span class="ide-ficon" style="color:#89d185">❯_</span>' : fileIcon(f.name, lang)) +
      esc(term && !fileLabel ? "Terminal" : f.name) + "</span>" +
      (f.note ? '<span class="ide-note">' + esc(f.note) + "</span>" : "") +
      '<span class="ide-spacer"></span>' + (extraRight || "") + "</div>";
  }

  /* ---------- Static code blocks: <textarea class="code" data-lang data-file> ---------- */
  function renderStaticCode(root) {
    root.querySelectorAll("textarea.code").forEach(function (ta) {
      const lang = ta.getAttribute("data-lang") || "js";
      const src = dedent(ta.value);
      const numbered = !(lang === "text" || lang === "bash") && ta.dataset.lines !== "off";
      const label = ta.dataset.file || (lang === "bash" ? "" : DEFAULT_FILE[lang] || "");
      const win = el("div", { class: "ide ide-static" + (lang === "bash" ? " ide-terminal" : "") });
      win.innerHTML = (label || lang === "bash" ? titleBar(label, lang, '<span class="ide-ro">read-only</span>') : "") +
        '<pre class="ide-pre' + (numbered ? " numbered" : "") + '"><code>' + renderLines(src, lang, -1) + "</code></pre>";
      ta.replaceWith(win);
    });
  }

  /* ---------- Runnable JS playgrounds ---------- */
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  let activeOutput = null;

  function makeTimers() {
    const ids = new Set();
    return {
      setTimeout: function (fn, ms) {
        const args = Array.prototype.slice.call(arguments, 2);
        const id = window.setTimeout(function () { ids.delete(id); fn.apply(null, args); }, ms);
        ids.add(id); return id;
      },
      setInterval: function (fn, ms) {
        const id = window.setInterval(fn, ms); ids.add("i" + id); return id;
      },
      clearTimeout: function (id) { window.clearTimeout(id); ids.delete(id); },
      clearInterval: function (id) { window.clearInterval(id); ids.delete("i" + id); },
      clearAll: function () {
        ids.forEach(function (id) {
          if (typeof id === "string") window.clearInterval(Number(id.slice(1))); else window.clearTimeout(id);
        });
        ids.clear();
      },
      pending: function () { return ids.size; }
    };
  }

  function setupPlay(box, index) {
    const ta = box.querySelector("textarea");
    if (!ta) return;
    const mode = box.dataset.mode || "js";
    const lang = mode === "html" ? "html" : "js";
    const original = dedent(ta.value) + (box.dataset.blank === "on" ? "\n" : "");
    const title = box.dataset.title || (mode === "html" ? "Try it · web page" : "Try it");
    const sub = box.dataset.sub || (mode === "html" ? "edit the HTML/JS, then Run" : "edit the code, then Run");
    const fileLabel = box.dataset.file || DEFAULT_FILE[lang];

    box.innerHTML = "";
    box.appendChild(el("div", { class: "play-caption" },
      "<b>" + esc(title) + "</b><span>" + esc(sub) + "</span>"));

    const win = el("div", { class: "ide" });
    win.innerHTML = titleBar(fileLabel, lang, "");
    const tb = win.querySelector(".ide-titlebar");
    const run = el("button", { class: "play-btn run", type: "button", title: "Run (Ctrl+Enter)" }, "▶ Run");
    const reset = el("button", { class: "play-btn reset", type: "button", title: "Restore the original code" }, "↺ Reset");
    tb.appendChild(reset); tb.appendChild(run);

    const wrap = el("div", { class: "ide-editor" });
    const hl = el("pre", { class: "ide-pre numbered", "aria-hidden": "true" });
    const hlCode = el("code");
    hl.appendChild(hlCode);
    const editor = el("textarea", {
      class: "ide-input", spellcheck: "false", autocapitalize: "off",
      autocomplete: "off", autocorrect: "off", wrap: "soft", "aria-label": "Code editor: " + title
    });
    editor.value = original;
    wrap.appendChild(hl); wrap.appendChild(editor);
    win.appendChild(wrap);

    let frame = null;
    if (mode === "html") {
      win.appendChild(el("div", { class: "ide-panel-head" },
        '<span class="on">Preview</span><span class="ide-addr">' +
        (box.dataset.server === "on" ? "http://localhost:5500" : "browser") + "</span>"));
      frame = el("iframe", { sandbox: "allow-scripts allow-modals allow-forms", title: "Result of " + title });
      win.appendChild(frame);
    }
    win.appendChild(el("div", { class: "ide-panel-head" },
      '<span class="on">Console</span><span class="ide-kbd">Ctrl + Enter to run</span>'));
    const out = el("pre", { class: "play-output", "aria-live": "polite" });
    win.appendChild(out);

    const status = el("div", { class: "ide-status" });
    status.innerHTML = '<span class="st-state">● Ready</span><span class="ide-spacer"></span>' +
      '<span class="st-pos">Ln 1, Col 1</span><span class="st-hide">Spaces: 2</span><span class="st-hide">UTF-8</span><span>' +
      LANG_NAME[lang] + "</span>";
    win.appendChild(status);
    box.appendChild(win);
    const stState = status.querySelector(".st-state");
    const stPos = status.querySelector(".st-pos");

    // Re-draw the highlighted copy under the transparent textarea
    let lastSrc = null, lastLine = -2;
    function fit() {
      const v = editor.value;
      const before = v.slice(0, editor.selectionStart);
      const line = (before.match(/\n/g) || []).length;
      const col = before.length - before.lastIndexOf("\n");
      const focused = document.activeElement === editor;
      const active = focused ? line : -1;
      if (v !== lastSrc || active !== lastLine) {
        hlCode.innerHTML = renderLines(v, lang, active);
        lastSrc = v; lastLine = active;
      }
      stPos.textContent = "Ln " + (line + 1) + ", Col " + col;
    }
    fit();
    ["input", "keyup", "click", "focus", "blur", "select"].forEach(function (ev) { editor.addEventListener(ev, fit); });

    function insert(text) {
      editor.focus();
      let ok = false;
      try { ok = document.execCommand && document.execCommand("insertText", false, text); } catch (e) { ok = false; }
      if (!ok) {
        editor.setRangeText(text, editor.selectionStart, editor.selectionEnd, "end");
        fit();
      }
    }
    editor.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault(); run.click();
      } else if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault(); insert("  ");
      } else if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        // auto-indent: keep this line's indentation, add a level after { [ (
        const s = editor.selectionStart;
        const lineStart = editor.value.lastIndexOf("\n", s - 1) + 1;
        const cur = editor.value.slice(lineStart, s);
        let indent = cur.match(/^\s*/)[0];
        if (/[{[(]\s*$/.test(cur)) indent += "  ";
        e.preventDefault(); insert("\n" + indent);
      }
    });
    run.addEventListener("click", function () {
      stState.textContent = "✓ Ran at " + new Date().toLocaleTimeString();
      status.classList.remove("dirty");
    });
    editor.addEventListener("input", function () {
      stState.textContent = editor.value === original ? "● Ready" : "● Edited";
      status.classList.toggle("dirty", editor.value !== original);
    });

    function print(args, kind) {
      const text = Array.prototype.map.call(args, function (a) { return inspect(a); }).join(" ");
      const line = el("span", kind ? { class: kind } : null);
      line.textContent = text + "\n";
      out.appendChild(line);
      out.scrollTop = out.scrollHeight;
    }

    const timers = makeTimers();
    const id = "play" + index;

    if (mode === "js") {
      run.addEventListener("click", function () {
        timers.clearAll();
        out.innerHTML = "";
        activeOutput = print;
        if (window.MiniNode) {
          window.MiniNode.reset();
          window.MiniNode.setLogger(function () { print(arguments, "muted"); });
        }
        const fakeConsole = {
          log: function () { print(arguments); },
          info: function () { print(arguments, "info"); },
          warn: function () { print(arguments, "info"); },
          error: function () { print(arguments, "err"); },
          table: function (d) { print([tableText(d)]); },
          clear: function () { out.innerHTML = ""; }
        };
        const N = window.MiniNode || {};
        const simFetch = N.makeFetch ? N.makeFetch({ cors: box.dataset.cors === "on" }) : window.fetch;
        let fn;
        try {
          fn = new AsyncFunction(
            "console", "fetch", "require", "process",
            "setTimeout", "setInterval", "clearTimeout", "clearInterval",
            '"use strict";\n' + editor.value
          );
        } catch (e) {
          print(["SyntaxError: " + e.message + "  — check for a missing bracket, quote or comma."], "err");
          return;
        }
        Promise.resolve()
          .then(function () {
            return fn(fakeConsole, simFetch, N.require, N.process,
              timers.setTimeout, timers.setInterval, timers.clearTimeout, timers.clearInterval);
          })
          .then(function () {
            window.setTimeout(function () {
              if (!out.textContent && !timers.pending()) print(["(finished — nothing was printed)"], "muted");
            }, 60);
          })
          .catch(function (e) {
            print([(e && e.name ? e.name : "Error") + ": " + (e && e.message ? e.message : e)], "err");
          });
      });
    } else {
      // HTML mode: render inside a sandboxed iframe and forward its console here
      const base = new URL(".", document.baseURI).href;
      run.addEventListener("click", function () {
        out.innerHTML = "";
        const useServer = box.dataset.server === "on";
        const bridge =
          "<script>(function(){var ID=" + JSON.stringify(id) + ";" +
          "var inspect=" + inspect.toString() + ";" +
          "function send(k,a){parent.postMessage({__play:ID,kind:k,text:Array.prototype.map.call(a,function(x){return inspect(x)}).join(' ')},'*');}" +
          "console.log=function(){send('',arguments)};console.info=function(){send('info',arguments)};" +
          "console.warn=function(){send('info',arguments)};console.error=function(){send('err',arguments)};" +
          "window.addEventListener('error',function(e){send('err',[(e.error&&e.error.name||'Error')+': '+e.message])});" +
          "window.addEventListener('unhandledrejection',function(e){var r=e.reason;send('err',['Uncaught (in promise) '+(r&&r.name?r.name+': '+r.message:r)])});" +
          "})();<\/script>";
        const sim = useServer
          ? '<script src="' + base + 'assets/sim.js"><\/script>' +
            "<script>MiniNode.setLogger(function(){console.error.apply(console,arguments)});" +
            "window.fetch=MiniNode.makeFetch({cors:true,pageOrigin:'http://localhost:5500'});" +
            "window.require=MiniNode.require;window.process=MiniNode.process;<\/script>"
          : "";
        frame.srcdoc =
          '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
          "<style>body{font-family:system-ui,sans-serif;padding:14px;margin:0;line-height:1.5;color:#1d2330}" +
          "button{font:inherit;padding:.4rem .8rem;border-radius:6px;border:1px solid #889;cursor:pointer}" +
          "input{font:inherit;padding:.35rem .5rem;border-radius:6px;border:1px solid #aab}</style>" +
          bridge + sim + "</head><body>" + editor.value + "</body></html>";
      });
      window.addEventListener("message", function (e) {
        if (e.data && e.data.__play === id) {
          const line = el("span", e.data.kind ? { class: e.data.kind } : null);
          line.textContent = e.data.text + "\n";
          out.appendChild(line);
          out.scrollTop = out.scrollHeight;
        }
      });
      if (box.dataset.autorun !== "off") setTimeout(function () { run.click(); }, 50);
    }

    reset.addEventListener("click", function () {
      timers.clearAll();
      editor.value = original; fit();
      stState.textContent = "● Ready"; status.classList.remove("dirty");
      out.innerHTML = "";
      if (frame) frame.srcdoc = "";
    });
  }

  window.addEventListener("unhandledrejection", function (e) {
    if (activeOutput) {
      const r = e.reason;
      activeOutput(["Uncaught (in promise) " + (r && r.name ? r.name + ": " + r.message : r)], "err");
      e.preventDefault();
    }
  });

  /* ---------- Quizzes ---------- */
  function setupQuiz(box) {
    const qid = box.dataset.id;
    const qs = Array.prototype.slice.call(box.querySelectorAll(".q"));
    const saved = state.quiz[qid] || { answers: {} };
    saved.answers = saved.answers || {};

    const title = el("h3", { class: "quiz-title" }, esc(box.dataset.title || "Check Yourself"));
    const sub = el("p", { class: "quiz-sub" },
      qs.length + " questions · Pick one answer for each. You will see the explanation right away. Your score is saved on this device.");
    box.insertBefore(sub, box.firstChild);
    box.insertBefore(title, box.firstChild);

    const scoreBox = el("div", { class: "quiz-score" });
    box.appendChild(scoreBox);

    qs.forEach(function (q, qi) {
      const correct = Number(q.dataset.answer);
      const stem = q.querySelector("p:not(.why)");
      const opts = Array.prototype.slice.call(q.querySelectorAll("li"));
      const why = q.querySelector(".why");
      const stemHTML = stem ? stem.innerHTML : "";
      const optsHTML = opts.map(function (o) { return o.innerHTML; });
      const whyHTML = why ? why.innerHTML : "";

      q.innerHTML = "";
      q.appendChild(el("p", { class: "q-stem" }, '<span class="qn">' + (qi + 1) + ".</span>" + stemHTML));
      const wrap = el("div", { class: "q-opts" });
      const letters = "ABCDEF";
      const buttons = optsHTML.map(function (h, oi) {
        const b = el("button", { class: "q-opt", type: "button" }, "<b>" + letters[oi] + ".</b> " + h);
        b.addEventListener("click", function () { answer(oi, true); });
        wrap.appendChild(b);
        return b;
      });
      q.appendChild(wrap);
      const whyBox = el("div", { class: "q-why" });
      q.appendChild(whyBox);

      function answer(oi, persist) {
        if (q.classList.contains("answered")) return;
        q.classList.add("answered");
        buttons.forEach(function (b) { b.disabled = true; });
        buttons[correct].classList.add("correct");
        const ok = oi === correct;
        if (!ok) buttons[oi].classList.add("wrong");
        whyBox.innerHTML = (ok ? '<b class="ok">Correct.</b> ' : '<b class="no">Not quite.</b> The answer is ' +
          letters[correct] + ". ") + whyHTML;
        if (persist) {
          saved.answers[qi] = oi;
          updateScore(true);
        }
      }
      q._answer = answer;
      if (saved.answers[qi] !== undefined) answer(saved.answers[qi], false);
    });

    function updateScore(persist) {
      const answered = Object.keys(saved.answers).length;
      let score = 0;
      qs.forEach(function (q, qi) {
        if (saved.answers[qi] !== undefined && saved.answers[qi] === Number(q.dataset.answer)) score++;
      });
      if (persist) {
        saved.score = score; saved.total = qs.length;
        state.quiz[qid] = saved; save(state);
      }
      if (answered === qs.length) {
        const pct = Math.round(score / qs.length * 100);
        const msg = pct >= 80 ? "Great work — you are ready for the next lesson."
          : pct >= 60 ? "Good. Re-read the parts you missed, then move on."
          : "Go back over this lesson once more, then retry.";
        scoreBox.innerHTML = "<span>Score: " + score + " / " + qs.length + " (" + pct + "%) — " + msg + "</span>";
        const retry = el("button", { class: "btn small secondary", type: "button" }, "Retry quiz");
        retry.addEventListener("click", function () {
          delete state.quiz[qid]; save(state);
          location.hash = "#" + (box.id || "");
          location.reload();
        });
        scoreBox.appendChild(retry);
        scoreBox.classList.add("show");
      }
    }
    updateScore(false);
  }

  /* ---------- Layout: top bar, sidebar, pager, complete button ---------- */
  function buildLayout() {
    const pageId = document.body.dataset.page || "home";
    const content = document.getElementById("content");
    if (!content) return;

    const top = el("header", { class: "topbar" });
    top.innerHTML =
      '<button class="icon-btn" id="menuBtn" type="button" aria-label="Open lessons menu">☰</button>' +
      '<a class="brand" href="index.html"><span class="logo-js">JS</span><span>' + esc(MODULE.short) + "</span></a>" +
      '<span class="spacer"></span>' +
      '<span class="top-progress" id="topProgress"></span>' +
      '<button class="icon-btn" id="themeBtn" type="button" aria-label="Toggle dark mode"></button>';

    const side = el("nav", { class: "sidebar", "aria-label": "Lessons" });
    let html = "", group = null;
    LESSONS.forEach(function (l) {
      if (l.group !== group) {
        if (group !== null) html += "</ul>";
        html += "<h4>" + esc(l.group) + '</h4><ul class="nav-list">';
        group = l.group;
      }
      const cls = [l.id === pageId ? "active" : "", state.done[l.id] ? "done" : ""].join(" ").trim();
      html += '<li><a href="' + l.file + '" class="' + cls + '" data-id="' + l.id + '"><span class="nav-num">' +
        (state.done[l.id] ? "✓" : esc(l.num)) + "</span><span>" + esc(l.title) +
        (l.time && l.time !== "—" ? '<span class="nav-meta">' + esc(l.time) + "</span>" : "") + "</span></a></li>";
    });
    html += "</ul>";
    side.innerHTML = html;

    const layout = el("div", { class: "layout" });
    const main = el("main", { class: "content", id: "main" });
    const inner = el("div", { class: "inner" });
    while (content.firstChild) inner.appendChild(content.firstChild);
    main.appendChild(inner);
    layout.appendChild(side); layout.appendChild(main);
    content.replaceWith(layout);
    document.body.insertBefore(top, layout);

    // lesson completion + pager
    const idx = LESSONS.findIndex(function (l) { return l.id === pageId; });
    const me = LESSONS[idx];
    if (me && /^l\d$/.test(me.id)) {
      const bar = el("div", { class: "complete-bar" });
      const p = el("p");
      const btn = el("button", { class: "btn", type: "button" });
      function paint() {
        const d = !!state.done[me.id];
        p.textContent = d ? "You marked this lesson as complete. Nice." :
          "Finished reading, tried the code, and answered Check Yourself? Mark this lesson complete.";
        btn.textContent = d ? "✓ Completed (undo)" : "Mark lesson complete";
        btn.className = d ? "btn good" : "btn";
      }
      btn.addEventListener("click", function () {
        if (state.done[me.id]) delete state.done[me.id]; else state.done[me.id] = new Date().toISOString();
        save(state); paint(); refreshNav();
      });
      paint();
      bar.appendChild(p); bar.appendChild(btn);
      inner.appendChild(bar);
    }
    if (idx >= 0) {
      const pager = el("div", { class: "pager" });
      const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
      if (prev) pager.appendChild(el("a", { href: prev.file, class: "prev" }, "<small>← Previous</small>" + esc(prev.title)));
      else pager.appendChild(el("span"));
      if (next) pager.appendChild(el("a", { href: next.file, class: "next" }, "<small>Next →</small>" + esc(next.title)));
      inner.appendChild(pager);
    }
    inner.appendChild(el("footer", { class: "footer" },
      esc(MODULE.course) + " · " + esc(MODULE.author) + "<br>" + esc(MODULE.school) +
      "<br>Self-paced module · progress is saved only in this browser on this device."));

    document.getElementById("menuBtn").addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    main.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    const themeBtn = document.getElementById("themeBtn");
    function paintTheme() { themeBtn.textContent = theme === "dark" ? "Light" : "Dark"; }
    paintTheme();
    themeBtn.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      applyTheme(theme); state.theme = theme; save(state); paintTheme();
    });
    refreshNav();
  }

  function refreshNav() {
    document.querySelectorAll(".nav-list a").forEach(function (a) {
      const id = a.dataset.id;
      const l = LESSONS.find(function (x) { return x.id === id; });
      a.classList.toggle("done", !!state.done[id]);
      a.querySelector(".nav-num").textContent = state.done[id] ? "✓" : l.num;
    });
    const tp = document.getElementById("topProgress");
    if (tp) tp.textContent = doneCount() + " of " + COUNTED.length + " lessons done";
    renderHome();
  }

  /* ---------- Home page widgets ---------- */
  function renderHome() {
    const grid = document.getElementById("lessonGrid");
    if (grid) {
      grid.innerHTML = "";
      COUNTED.forEach(function (l) {
        const q = state.quiz[l.id];
        const d = !!state.done[l.id];
        const a = el("a", { href: l.file, class: "lesson-card" + (d ? " done" : "") },
          '<span class="status">' + (d ? "✓ Done" : q ? "In progress" : "Not started") + "</span>" +
          '<span class="num">Lesson ' + l.num + "</span>" +
          '<span class="t">' + esc(l.title) + "</span>" +
          '<span class="d">' + esc(l.desc) + "</span>" +
          '<span class="m">' + esc(l.time) + (q ? " · Quiz " + q.score + "/" + q.total : "") + "</span>");
        grid.appendChild(a);
      });
    }
    const fill = document.getElementById("progressFill");
    if (fill) {
      const n = doneCount();
      fill.style.width = Math.round(n / COUNTED.length * 100) + "%";
      document.getElementById("progressLabel").textContent =
        n === 0 ? "You have not started yet. Begin with Lesson 1." :
        n === COUNTED.length ? "All lessons complete! Go to the Portfolio Output page." :
        n + " of " + COUNTED.length + " lessons complete.";
      const cont = document.getElementById("continueBtn");
      if (cont) {
        const nextL = COUNTED.find(function (l) { return !state.done[l.id]; });
        cont.href = nextL ? nextL.file : "capstone.html";
        cont.textContent = n === 0 ? "Start Lesson 1 →" : nextL ? "Continue: Lesson " + nextL.num + " →" : "Go to Portfolio Output →";
      }
    }
    renderReport();
  }

  /* ---------- Progress report (capstone page) ---------- */
  function renderReport() {
    const box = document.getElementById("reportTable");
    if (!box) return;
    let rows = "", total = 0, max = 0;
    COUNTED.forEach(function (l) {
      const q = state.quiz[l.id];
      if (q) { total += q.score; max += q.total; }
      rows += "<tr><td>Lesson " + l.num + ": " + esc(l.title) + "</td><td>" +
        (state.done[l.id] ? "✓ " + new Date(state.done[l.id]).toLocaleDateString() : "—") + "</td><td>" +
        (q ? q.score + " / " + q.total : "—") + "</td></tr>";
    });
    box.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Lesson</th><th>Completed</th><th>Check Yourself</th></tr></thead><tbody>' +
      rows + "</tbody><tfoot><tr><th>Total</th><th>" + doneCount() + " / " + COUNTED.length + "</th><th>" +
      total + " / " + (max || "—") + "</th></tr></tfoot></table></div>";
    const stamp = document.getElementById("reportStamp");
    if (stamp) stamp.textContent = "Generated " + new Date().toLocaleString();
  }

  function setupReportForm() {
    const name = document.getElementById("stuName");
    const sec = document.getElementById("stuSection");
    if (!name || !sec) return;
    name.value = state.name || ""; sec.value = state.section || "";
    name.addEventListener("input", function () { state.name = name.value; save(state); });
    sec.addEventListener("change", function () { state.section = sec.value; save(state); });
    const resetBtn = document.getElementById("resetProgress");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      if (window.confirm("Erase all progress and quiz scores on this device?")) {
        state = { done: {}, quiz: {}, theme: theme }; save(state); location.reload();
      }
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildLayout();
    renderStaticCode(document);
    document.querySelectorAll(".play").forEach(setupPlay);
    document.querySelectorAll(".quiz").forEach(setupQuiz);
    setupReportForm();
    renderHome();
    if (location.hash) {
      const t = document.querySelector(location.hash);
      if (t) setTimeout(function () { t.scrollIntoView(); }, 50);
    }
  });

  window.JSModule = { LESSONS: LESSONS, inspect: inspect };
})();
