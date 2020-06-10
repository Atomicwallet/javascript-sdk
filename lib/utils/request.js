"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @alias utils.HttpRequest
 */
var HttpRequest = /*#__PURE__*/function () {
  function HttpRequest(baseURL) {
    (0, _classCallCheck2["default"])(this, HttpRequest);
    this.httpClient = _axios["default"].create({
      baseURL: baseURL
    });
  }

  (0, _createClass2["default"])(HttpRequest, [{
    key: "get",
    value: function get(path, params, opts) {
      return this.request("get", path, params, opts);
    }
  }, {
    key: "post",
    value: function post(path, body, opts) {
      return this.request("post", path, body, opts);
    }
  }, {
    key: "request",
    value: function request(method, path, params, opts) {
      var options = _objectSpread({
        method: method,
        url: path
      }, opts);

      if (params) {
        if (method === "get") {
          options.params = params;
        } else {
          options.data = params;
        }
      }

      return this.httpClient.request(options).then(function (response) {
        return {
          result: response.data,
          status: response.status
        };
      })["catch"](function (err) {
        var error = err;

        try {
          var msgObj = err.response && err.response.data;
          error = new Error(msgObj.message);
          error.code = msgObj.code;
        } catch (err) {
          throw error;
        }

        throw error;
      });
    }
  }]);
  return HttpRequest;
}();

var _default = HttpRequest;
exports["default"] = _default;