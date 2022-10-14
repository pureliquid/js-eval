(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // ../dist/frontend/tmp/prune.js
  var require_prune = __commonJS({
    "../dist/frontend/tmp/prune.js"() {
      (function() {
        var DEFAULT_MAX_DEPTH = 6;
        var DEFAULT_ARRAY_MAX_LENGTH = 50;
        var seen;
        var iterator;
        var forEachEnumerableOwnProperty = function(obj, callback) {
          for (var k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k))
              callback(k);
          }
        };
        var forEachEnumerableProperty = function(obj, callback) {
          for (var k in obj)
            callback(k);
        };
        var forEachProperty = function(obj, callback, excluded) {
          if (obj == null)
            return;
          excluded = excluded || {};
          Object.getOwnPropertyNames(obj).forEach(function(k) {
            if (!excluded[k]) {
              callback(k);
              excluded[k] = true;
            }
          });
          forEachProperty(Object.getPrototypeOf(obj), callback, excluded);
        };
        Date.prototype.toPrunedJSON = Date.prototype.toJSON;
        String.prototype.toPrunedJSON = String.prototype.toJSON;
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
          "\b": "\\b",
          "	": "\\t",
          "\n": "\\n",
          "\f": "\\f",
          "\r": "\\r",
          '"': '\\"',
          "\\": "\\\\"
        };
        function quote(string) {
          escapable.lastIndex = 0;
          return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' : '"' + string + '"';
        }
        function str(key, holder, depthDecr, arrayMaxLength) {
          var i, k, v, length, partial, value = holder[key];
          if (value && typeof value === "object" && typeof value.toPrunedJSON === "function") {
            value = value.toPrunedJSON(key);
          }
          switch (typeof value) {
            case "string":
              return quote(value);
            case "number":
              return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
              return String(value);
            case "object":
              if (!value) {
                return "null";
              }
              if (depthDecr <= 0 || seen.indexOf(value) !== -1) {
                return '"-pruned-"';
              }
              seen.push(value);
              partial = [];
              if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = Math.min(value.length, arrayMaxLength);
                for (i = 0; i < length; i += 1) {
                  partial[i] = str(i, value, depthDecr - 1, arrayMaxLength) || "null";
                }
                return "[" + partial.join(",") + "]";
              }
              iterator(value, function(k2) {
                try {
                  v = str(k2, value, depthDecr - 1, arrayMaxLength);
                  if (v)
                    partial.push(quote(k2) + ":" + v);
                } catch (e2) {
                }
              });
              return "{" + partial.join(",") + "}";
          }
        }
        JSON.prune = function(value, depthDecr, arrayMaxLength) {
          if (typeof depthDecr == "object") {
            var options = depthDecr;
            depthDecr = options.depthDecr;
            arrayMaxLength = options.arrayMaxLength;
            iterator = options.iterator || forEachEnumerableOwnProperty;
            if (options.allProperties)
              iterator = forEachProperty;
            else if (options.inheritedProperties)
              iterator = forEachEnumerableProperty;
          } else {
            iterator = forEachEnumerableOwnProperty;
          }
          seen = [];
          depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
          arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
          return str("", { "": value }, depthDecr, arrayMaxLength);
        };
        JSON.prune.log = function() {
          console.log.apply(console, Array.prototype.slice.call(arguments).map(function(v) {
            return JSON.parse(JSON.prune(v));
          }));
        };
        JSON.prune.forEachProperty = forEachProperty;
      })();
    }
  });

  // ../dist/frontend/tmp/index.js
  var require_tmp = __commonJS({
    "../dist/frontend/tmp/index.js"(exports, module) {
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e2) {
              reject(e2);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e2) {
              reject(e2);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e2) {
              op = [6, e2];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      exports.__esModule = true;
      require_prune();
      var RemoteEvalFrontend = function() {
        function RemoteEvalFrontend(url) {
          if (url === void 0) {
            url = "ws://192.168.8.143:8080";
          }
          this.url = url;
        }
        RemoteEvalFrontend.prototype.bootstrap = function() {
          this.createSocketConnection();
        };
        RemoteEvalFrontend.prototype.createSocketConnection = function() {
          var _this = this;
          var connection = new WebSocket(this.url);
          connection.onopen = function() {
            alert("connected!");
          };
          connection.addEventListener("error", function() {
            alert("error.. can not connect to remoteeval!");
          });
          connection.addEventListener("open", function() {
            connection.send(JSON.stringify({ response: "connected ".concat(window.location.href) }));
          });
          connection.onmessage = function(e) {
            return __awaiter(_this, void 0, void 0, function() {
              var _a, _b, _c, _d, _e, _f, err_1;
              var _g;
              return __generator(this, function(_h) {
                switch (_h.label) {
                  case 0:
                    _h.trys.push([0, 2, , 3]);
                    _b = (_a = connection).send;
                    _d = (_c = JSON).stringify;
                    _g = {};
                    _f = (_e = JSON).prune;
                    return [4, eval(e.data)];
                  case 1:
                    _b.apply(_a, [_d.apply(_c, [(_g.response = _f.apply(_e, [_h.sent()]), _g)])]);
                    return [3, 3];
                  case 2:
                    err_1 = _h.sent();
                    console.log(err_1);
                    connection.send(JSON.stringify({
                      response: JSON.prune(err_1.data)
                    }));
                    return [3, 3];
                  case 3:
                    return [2];
                }
              });
            });
          };
          connection.addEventListener("message", connection.onmessage);
        };
        return RemoteEvalFrontend;
      }();
      var ext = new RemoteEvalFrontend();
      console.log("Running..");
      ext.bootstrap.bind(ext)();
      completion(true);
    }
  });
  require_tmp();
})();
