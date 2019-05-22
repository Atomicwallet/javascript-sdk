"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var client = _interopRequireWildcard(require("./client"));

var crypto = _interopRequireWildcard(require("./crypto"));

var utils = _interopRequireWildcard(require("./utils"));

var _client2 = _interopRequireDefault(require("./rpc/client"));

// import * as encoder from "./encoder"
// import * as decoder from './decoder'
// import Ledger from "./ledger"
var BncClient = client.BncClient; // const amino = { ...encoder, ...decoder }

module.exports = BncClient;
module.exports.crypto = crypto; // module.exports.amino = amino

module.exports.utils = utils; // module.exports.ledger = Ledger

module.exports.rpc = _client2.default;