import json, sys

def main():
    try:
        a = float(sys.argv[1])
        b = float(sys.argv[2])
        result = a + b
        print(json.dumps({"a": a, "b": b, "sum": result, "language": "python"}))
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)

if __name__ == "__main__":
    main()
