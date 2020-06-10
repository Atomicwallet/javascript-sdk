"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _big = _interopRequireDefault(require("big.js"));

var _types = require("../decoder/types");

var decoder = _interopRequireWildcard(require("../decoder"));

var crypto = _interopRequireWildcard(require("../crypto"));

var _ = _interopRequireDefault(require("."));

var _validateHelper = require("../utils/validateHelper");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var BASENUMBER = Math.pow(10, 8);

var divide = function divide(num) {
  return +new _big["default"](num).div(BASENUMBER).toString();
};

var convertObjectArrayNum = function convertObjectArrayNum(objArr, keys) {
  objArr.forEach(function (item) {
    keys.forEach(function (key) {
      item[key] = divide(item[key]);
    });
  });
};
/**
 * The Binance Chain Node rpc client
 */


var Client = /*#__PURE__*/function (_BaseRpc) {
  (0, _inherits2["default"])(Client, _BaseRpc);

  var _super = _createSuper(Client);

  /**
   * @param {String} uriString dataseed address
   * @param {String} netWork Binance Chain network
   */
  function Client() {
    var _this;

    var uriString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "localhost:27146";
    var netWork = arguments.length > 1 ? arguments[1] : undefined;
    (0, _classCallCheck2["default"])(this, Client);
    _this = _super.call(this, uriString);
    _this.netWork = netWork || "mainnet";
    return _this;
  }
  /**
   * The RPC broadcast delegate broadcasts a transaction via RPC. This is intended for optional use as BncClient's broadcast delegate.
   * @param {Transaction} signedTx the signed transaction
   * @return {Promise}
   */


  (0, _createClass2["default"])(Client, [{
    key: "broadcastDelegate",
    value: function () {
      var _broadcastDelegate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(signedTx) {
        var encoded, res;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // amino encode the signed TX
                encoded = signedTx.serialize(); // broadcast it via RPC; we have to use a promise here because that's
                // what the BncClient expects as the return value of this function.

                _context.next = 3;
                return this.broadcastTxSync({
                  tx: Buffer.from(encoded, "hex")
                });

              case 3:
                res = _context.sent;

                if (!("".concat(res.code) === "0")) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", res);

              case 8:
                throw new Error("broadcastDelegate: non-zero status code ".concat(res.code));

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function broadcastDelegate(_x) {
        return _broadcastDelegate.apply(this, arguments);
      }

      return broadcastDelegate;
    }()
  }, {
    key: "getBech32Prefix",
    value: function getBech32Prefix() {
      if (this.netWork === "mainnet") {
        return "bnb";
      }

      if (this.netWork === "testnet") {
        return "tbnb";
      }

      return "";
    }
    /**
     * @param {String} symbol - required
     * @returns {Object} token detail info
     */

  }, {
    key: "getTokenInfo",
    value: function () {
      var _getTokenInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(symbol) {
        var path, res, bytes, result, _decoder$unMarshalBin, tokenInfo, bech32Prefix;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                (0, _validateHelper.validateSymbol)(symbol);
                path = "/tokens/info/" + symbol;
                _context2.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context2.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = new _types.Token();
                _decoder$unMarshalBin = decoder.unMarshalBinaryLengthPrefixed(bytes, result), tokenInfo = _decoder$unMarshalBin.val;
                bech32Prefix = this.getBech32Prefix();
                tokenInfo.owner = crypto.encodeAddress(tokenInfo.owner, bech32Prefix);
                return _context2.abrupt("return", tokenInfo);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTokenInfo(_x2) {
        return _getTokenInfo.apply(this, arguments);
      }

      return getTokenInfo;
    }()
    /**
     * get tokens by offset and limit
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array} token list
     */

  }, {
    key: "listAllTokens",
    value: function () {
      var _listAllTokens = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(offset, limit) {
        var path, res, bytes, result, _decoder$unMarshalBin2, tokenList, bech32Prefix;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                (0, _validateHelper.validateOffsetLimit)(offset, limit);
                path = "tokens/list/".concat(offset, "/").concat(limit);
                _context3.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context3.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = [new _types.TokenOfList()];
                _decoder$unMarshalBin2 = decoder.unMarshalBinaryLengthPrefixed(bytes, result), tokenList = _decoder$unMarshalBin2.val;
                bech32Prefix = this.getBech32Prefix();
                tokenList.forEach(function (item) {
                  item.owner = crypto.encodeAddress(item.owner, bech32Prefix);
                });
                return _context3.abrupt("return", tokenList);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function listAllTokens(_x3, _x4) {
        return _listAllTokens.apply(this, arguments);
      }

      return listAllTokens;
    }()
    /**
     * @param {String} address
     * @returns {Object} Account info
     */

  }, {
    key: "getAccount",
    value: function () {
      var _getAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(address) {
        var res, result, bytes, _decoder$unMarshalBin3, accountInfo, bech32Prefix;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.abciQuery({
                  // path: "/store/acc/key",
                  path: "/account/".concat(address) // data: addrHex

                });

              case 2:
                res = _context4.sent;
                result = new _types.AppAccount();
                bytes = Buffer.from(res.response.value, "base64");
                _decoder$unMarshalBin3 = decoder.unMarshalBinaryBare(bytes, result), accountInfo = _decoder$unMarshalBin3.val;
                bech32Prefix = this.getBech32Prefix();
                accountInfo.base.address = crypto.encodeAddress(accountInfo.base.address, bech32Prefix);
                return _context4.abrupt("return", accountInfo);

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getAccount(_x5) {
        return _getAccount.apply(this, arguments);
      }

      return getAccount;
    }()
    /**
     * @param {Array} balances
     */

  }, {
    key: "getBalances",
    value: function () {
      var _getBalances = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(address) {
        var account, coins, balances;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getAccount(address);

              case 2:
                account = _context5.sent;
                coins = [];
                balances = [];

                if (account) {
                  coins = account.base && account.base.coins || [];
                  convertObjectArrayNum(coins, ["amount"]);
                  convertObjectArrayNum(account.locked, ["amount"]);
                  convertObjectArrayNum(account.frozen, ["amount"]);
                }

                coins.forEach(function (item) {
                  var locked = account.locked.find(function (lockedItem) {
                    return item.denom === lockedItem.denom;
                  }) || {};
                  var frozen = account.frozen.find(function (frozenItem) {
                    return item.denom === frozenItem.denom;
                  }) || {};
                  var bal = new _types.TokenBalance();
                  bal.symbol = item.denom;
                  bal.free = item.amount;
                  bal.locked = locked.amount || 0;
                  bal.frozen = frozen.amount || 0;
                  balances.push(bal);
                });
                return _context5.abrupt("return", balances);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getBalances(_x6) {
        return _getBalances.apply(this, arguments);
      }

      return getBalances;
    }()
    /**
     * get balance by symbol and address
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */

  }, {
    key: "getBalance",
    value: function () {
      var _getBalance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(address, symbol) {
        var balances, bal;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                (0, _validateHelper.validateSymbol)(symbol);
                _context6.next = 3;
                return this.getBalances(address);

              case 3:
                balances = _context6.sent;
                bal = balances.find(function (item) {
                  return item.symbol.toUpperCase() === symbol.toUpperCase();
                });
                return _context6.abrupt("return", bal);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getBalance(_x7, _x8) {
        return _getBalance.apply(this, arguments);
      }

      return getBalance;
    }()
    /**
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */

  }, {
    key: "getOpenOrders",
    value: function () {
      var _getOpenOrders = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(address, symbol) {
        var path, res, bytes, result, _decoder$unMarshalBin4, openOrders;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                path = "/dex/openorders/".concat(symbol, "/").concat(address);
                _context7.next = 3;
                return this.abciQuery({
                  path: path
                });

              case 3:
                res = _context7.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = [new _types.OpenOrder()];
                _decoder$unMarshalBin4 = decoder.unMarshalBinaryLengthPrefixed(bytes, result), openOrders = _decoder$unMarshalBin4.val;
                convertObjectArrayNum(openOrders, ["price", "quantity", "cumQty"]);
                return _context7.abrupt("return", openOrders);

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getOpenOrders(_x9, _x10) {
        return _getOpenOrders.apply(this, arguments);
      }

      return getOpenOrders;
    }()
    /**
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array}
     */

  }, {
    key: "getTradingPairs",
    value: function () {
      var _getTradingPairs = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(offset, limit) {
        var path, res, bytes, result, _decoder$unMarshalBin5, tradingPairs;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                (0, _validateHelper.validateOffsetLimit)(offset, limit);
                path = "/dex/pairs/".concat(offset, "/").concat(limit);
                _context8.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context8.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = [new _types.TradingPair()];
                _decoder$unMarshalBin5 = decoder.unMarshalBinaryLengthPrefixed(bytes, result), tradingPairs = _decoder$unMarshalBin5.val;
                convertObjectArrayNum(tradingPairs, ["list_price", "tick_size", "lot_size"]);
                return _context8.abrupt("return", tradingPairs);

              case 10:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getTradingPairs(_x11, _x12) {
        return _getTradingPairs.apply(this, arguments);
      }

      return getTradingPairs;
    }()
    /**
     * @param {String} tradePair
     * @returns {Array}
     */

  }, {
    key: "getDepth",
    value: function () {
      var _getDepth = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(tradePair) {
        var path, res, bytes, result, _decoder$unMarshalBin6, depth;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                (0, _validateHelper.validateTradingPair)(tradePair);
                path = "dex/orderbook/".concat(tradePair);
                _context9.next = 4;
                return this.abciQuery({
                  path: path
                });

              case 4:
                res = _context9.sent;
                bytes = Buffer.from(res.response.value, "base64");
                result = new _types.OrderBook();
                _decoder$unMarshalBin6 = decoder.unMarshalBinaryLengthPrefixed(bytes, result), depth = _decoder$unMarshalBin6.val;
                convertObjectArrayNum(depth.levels, ["buyQty", "buyPrice", "sellQty", "sellPrice"]);
                return _context9.abrupt("return", depth);

              case 10:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getDepth(_x13) {
        return _getDepth.apply(this, arguments);
      }

      return getDepth;
    }()
  }]);
  return Client;
}(_["default"]);

var _default = Client;
exports["default"] = _default;