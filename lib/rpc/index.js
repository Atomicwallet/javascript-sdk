/**
 * https://github.com/nomic-io/js-tendermint/blob/master/src/rpc.js
 */
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var is = require("is_js");

var EventEmitter = require("events");

var axios = require("axios");

var url = require("url");

var camel = require("camelcase");

var websocket = require("websocket-stream");

var ndjson = require("ndjson");

var pumpify = require("pumpify").obj;

var methods = require("./methods.js");

function convertHttpArgs(url, args) {
  args = args || {};
  var search = [];

  for (var k in args) {
    if (is.string(args[k])) {
      search.push("".concat(k, "=\"").concat(args[k], "\""));
    } else if (Buffer.isBuffer(args[k])) {
      search.push("".concat(k, "=0x").concat(args[k].toString("hex")));
    } else {
      search.push("".concat(k, "=").concat(args[k]));
    }
  }

  return "".concat(url, "?").concat(search.join("&"));
}

function convertWsArgs(args) {
  args = args || {};

  for (var k in args) {
    var v = args[k];

    if (typeof v === "number") {
      args[k] = String(v);
    } else if (Buffer.isBuffer(v)) {
      args[k] = "0x" + v.toString("hex");
    } else if (v instanceof Uint8Array) {
      args[k] = "0x" + Buffer.from(v).toString("hex");
    }
  }

  return args;
}

var wsProtocols = ["ws:", "wss:"];
var httpProtocols = ["http:", "https:"];
var allProtocols = wsProtocols.concat(httpProtocols);

var BaseRpc = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(BaseRpc, _EventEmitter);

  var _super = _createSuper(BaseRpc);

  function BaseRpc() {
    var _this;

    var uriString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "localhost:27146";
    (0, _classCallCheck2["default"])(this, BaseRpc);
    _this = _super.call(this); // parse full-node URI

    var _url$parse = url.parse(uriString),
        protocol = _url$parse.protocol,
        hostname = _url$parse.hostname,
        port = _url$parse.port; // default to http


    if (!allProtocols.includes(protocol)) {
      var uri = url.parse("http://".concat(uriString));
      protocol = uri.protocol;
      hostname = uri.hostname;
      port = uri.port;
    }

    _this.uri = !port ? "".concat(protocol, "//").concat(hostname, "/") : "".concat(protocol, "//").concat(hostname, ":").concat(port, "/");

    if (wsProtocols.includes(protocol)) {
      _this.websocket = true;
      _this.uri = "".concat(_this.uri, "websocket");
      _this.call = _this.callWs;

      _this.connectWs();
    } else if (httpProtocols.includes(protocol)) {
      _this.call = _this.callHttp;
    }

    return _this;
  }

  (0, _createClass2["default"])(BaseRpc, [{
    key: "connectWs",
    value: function connectWs() {
      var _this2 = this;

      this.ws = pumpify(ndjson.stringify(), websocket(this.uri));
      this.ws.on("error", function (err) {
        return _this2.emit("error", err);
      });
      this.ws.on("close", function () {
        if (_this2.closed) return;

        _this2.emit("error", Error("websocket disconnected"));
      });
      this.ws.on("data", function (data) {
        data = JSON.parse(data);
        if (!data.id) return;

        _this2.emit(data.id, data.error, data.result);
      });
    }
  }, {
    key: "callHttp",
    value: function callHttp(method, args) {
      var url = this.uri + method;
      url = convertHttpArgs(url, args);
      return axios({
        url: url
      }).then(function (_ref) {
        var data = _ref.data;

        if (data.error) {
          var err = Error(data.error.message);
          Object.assign(err, data.error);
          throw err;
        }

        return data.result;
      }, function (err) {
        throw Error(err);
      });
    }
  }, {
    key: "callWs",
    value: function callWs(method, args, listener) {
      var _this3 = this;

      var self = this;
      return new Promise(function (resolve, reject) {
        var id = Math.random().toString(36);
        var params = convertWsArgs(args);

        if (method === "subscribe") {
          if (typeof listener !== "function") {
            throw Error("Must provide listener function");
          } // events get passed to listener


          _this3.on(id + "#event", function (err, res) {
            if (err) return self.emit("error", err);
            listener(res.data.value);
          }); // promise resolves on successful subscription or error


          _this3.on(id, function (err) {
            if (err) return reject(err);
            resolve();
          });
        } else {
          // response goes to promise
          _this3.once(id, function (err, res) {
            if (err) return reject(err);
            resolve(res);
          });
        }

        _this3.ws.write({
          jsonrpc: "2.0",
          id: id,
          method: method,
          params: params
        });
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.closed = true;
      if (!this.ws) return;
      this.ws.destroy();
    }
  }]);
  return BaseRpc;
}(EventEmitter); // add methods to Client class based on methods defined in './methods.js'


var _iterator = _createForOfIteratorHelper(methods),
    _step;

try {
  var _loop = function _loop() {
    var name = _step.value;

    BaseRpc.prototype[camel(name)] = function (args, listener) {
      return this.call(name, args, listener).then(function (res) {
        return res;
      });
    };
  };

  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    _loop();
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}

module.exports = BaseRpc;