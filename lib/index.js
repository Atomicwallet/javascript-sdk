"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var client = _interopRequireWildcard(require("./client"));

var crypto = _interopRequireWildcard(require("./crypto"));

var encoder = _interopRequireWildcard(require("./encoder"));

var decoder = _interopRequireWildcard(require("./decoder"));

var utils = _interopRequireWildcard(require("./utils"));

var _client2 = _interopRequireDefault(require("./rpc/client"));

var _tx = _interopRequireDefault(require("./tx"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var BncClient = client.BncClient;

var amino = _objectSpread(_objectSpread({}, encoder), decoder);

module.exports = BncClient;
module.exports.Transaction = _tx["default"];
module.exports.crypto = crypto;
module.exports.amino = amino;
module.exports.utils = utils; // module.exports.ledger = Ledger

module.exports.rpc = _client2["default"];