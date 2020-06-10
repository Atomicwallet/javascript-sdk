"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BncClient = exports.LedgerSigningDelegate = exports.DefaultBroadcastDelegate = exports.DefaultSigningDelegate = exports.api = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var crypto = _interopRequireWildcard(require("../crypto"));

var _tx = _interopRequireDefault(require("../tx"));

var _request = _interopRequireDefault(require("../utils/request"));

var _validateHelper = require("../utils/validateHelper");

var _token = _interopRequireDefault(require("../token/"));

var _swap = _interopRequireDefault(require("../swap/"));

var _gov = _interopRequireDefault(require("../gov/"));

var _big = _interopRequireDefault(require("big.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var BASENUMBER = Math.pow(10, 8);
var api = {
  broadcast: "/api/v1/broadcast",
  nodeInfo: "/api/v1/node-info",
  getAccount: "/api/v1/account",
  getMarkets: "/api/v1/markets",
  getSwaps: "/api/v1/atomic-swaps",
  getOpenOrders: "/api/v1/orders/open",
  getDepth: "/api/v1/depth",
  getTransactions: "/api/v1/transactions",
  getTx: "/api/v1/tx"
};
exports.api = api;
var NETWORK_PREFIX_MAPPING = {
  "testnet": "tbnb",
  "mainnet": "bnb"
};
/**
 * The default signing delegate which uses the local private key.
 * @param  {Transaction} tx      the transaction
 * @param  {Object}      signMsg the canonical sign bytes for the msg
 * @return {Transaction}
 */

var DefaultSigningDelegate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(tx, signMsg) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", tx.sign(this.privateKey, signMsg));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function DefaultSigningDelegate(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * The default broadcast delegate which immediately broadcasts a transaction.
 * @param {Transaction} signedTx the signed transaction
 */


exports.DefaultSigningDelegate = DefaultSigningDelegate;

var DefaultBroadcastDelegate = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(signedTx) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", this.sendTransaction(signedTx));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function DefaultBroadcastDelegate(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * The Ledger signing delegate.
 * @param  {LedgerApp}  ledgerApp
 * @param  {preSignCb}  function
 * @param  {postSignCb} function
 * @param  {errCb} function
 * @return {function}
 */


exports.DefaultBroadcastDelegate = DefaultBroadcastDelegate;

var LedgerSigningDelegate = function LedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb, hdPath) {
  return /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(tx, signMsg) {
      var signBytes, pubKeyResp, sigResp, pubKey;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              signBytes = tx.getSignBytes(signMsg);
              preSignCb && preSignCb(signBytes);
              _context3.prev = 2;
              _context3.next = 5;
              return ledgerApp.getPublicKey(hdPath);

            case 5:
              pubKeyResp = _context3.sent;
              _context3.next = 8;
              return ledgerApp.sign(signBytes, hdPath);

            case 8:
              sigResp = _context3.sent;
              postSignCb && postSignCb(pubKeyResp, sigResp);
              _context3.next = 16;
              break;

            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3["catch"](2);
              console.warn("LedgerSigningDelegate error", _context3.t0);
              errCb && errCb(_context3.t0);

            case 16:
              if (!(sigResp && sigResp.signature)) {
                _context3.next = 19;
                break;
              }

              pubKey = crypto.getPublicKey(pubKeyResp.pk.toString("hex"));
              return _context3.abrupt("return", tx.addSignature(pubKey, sigResp.signature));

            case 19:
              return _context3.abrupt("return", tx);

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 12]]);
    }));

    return function (_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();
};
/**
 * validate the input number.
 * @param {Array} outputs
 */


exports.LedgerSigningDelegate = LedgerSigningDelegate;

var checkOutputs = function checkOutputs(outputs) {
  outputs.forEach(function (transfer) {
    var coins = transfer.coins || [];
    coins.forEach(function (coin) {
      (0, _validateHelper.checkNumber)(coin.amount);

      if (!coin.denom) {
        throw new Error("invalid denmon");
      }
    });
  });
};
/**
 * sum corresponding input coin
 * @param {Array} inputs
 * @param {Array} coins
 */


var calInputCoins = function calInputCoins(inputs, coins) {
  coins.forEach(function (coin) {
    var existCoin = inputs[0].coins.find(function (c) {
      return c.denom === coin.denom;
    });

    if (existCoin) {
      var existAmount = new _big["default"](existCoin.amount);
      existCoin.amount = Number(existAmount.plus(coin.amount).toString());
    } else {
      inputs[0].coins.push(_objectSpread({}, coin));
    }
  });
};
/**
 * The Binance Chain client.
 */


var BncClient = /*#__PURE__*/function () {
  /**
   * @param {String} server Binance Chain public url
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   * @param {Number} source where does this transaction come from (default 0)
   */
  function BncClient(server) {
    var useAsyncBroadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    (0, _classCallCheck2["default"])(this, BncClient);

    if (!server) {
      throw new Error("Binance chain server should not be null");
    }

    this._httpClient = new _request["default"](server);
    this._signingDelegate = DefaultSigningDelegate;
    this._broadcastDelegate = DefaultBroadcastDelegate;
    this._useAsyncBroadcast = useAsyncBroadcast;
    this._source = source;
    this.tokens = new _token["default"](this);
    this.swap = new _swap["default"](this);
    this.gov = new _gov["default"](this);
  }
  /**
   * Initialize the client with the chain's ID. Asynchronous.
   * @return {Promise}
   */


  (0, _createClass2["default"])(BncClient, [{
    key: "initChain",
    value: function () {
      var _initChain = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var data;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.chainId) {
                  _context4.next = 5;
                  break;
                }

                _context4.next = 3;
                return this._httpClient.request("get", api.nodeInfo);

              case 3:
                data = _context4.sent;
                this.chainId = data.result.node_info && data.result.node_info.network;

              case 5:
                return _context4.abrupt("return", this);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function initChain() {
        return _initChain.apply(this, arguments);
      }

      return initChain;
    }()
    /**
     * Sets the client network (testnet or mainnet).
     * @param {String} network Indicate testnet or mainnet
     */

  }, {
    key: "chooseNetwork",
    value: function chooseNetwork(network) {
      this.addressPrefix = NETWORK_PREFIX_MAPPING[network] || "tbnb";
      this.network = NETWORK_PREFIX_MAPPING[network] ? network : "testnet";
    }
    /**
     * Sets the client's private key for calls made by this client. Asynchronous.
     * @param {string} privateKey the private key hexstring
     * @param {boolean} localOnly set this to true if you will supply an account_number yourself via `setAccountNumber`. Warning: You must do that if you set this to true!
     * @return {Promise}
     */

  }, {
    key: "setPrivateKey",
    value: function () {
      var _setPrivateKey = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(privateKey) {
        var localOnly,
            address,
            promise,
            data,
            _args5 = arguments;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                localOnly = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : false;

                if (!(privateKey !== this.privateKey)) {
                  _context5.next = 21;
                  break;
                }

                address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);

                if (address) {
                  _context5.next = 5;
                  break;
                }

                throw new Error("address is falsy: ".concat(address, ". invalid private key?"));

              case 5:
                if (!(address === this.address)) {
                  _context5.next = 7;
                  break;
                }

                return _context5.abrupt("return", this);

              case 7:
                // safety
                this.privateKey = privateKey;
                this.address = address;

                if (localOnly) {
                  _context5.next = 21;
                  break;
                }

                _context5.prev = 10;
                promise = this._setPkPromise = this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));
                _context5.next = 14;
                return promise;

              case 14:
                data = _context5.sent;
                this.account_number = data.result.account_number;
                _context5.next = 21;
                break;

              case 18:
                _context5.prev = 18;
                _context5.t0 = _context5["catch"](10);
                throw new Error("unable to query the address on the blockchain. try sending it some funds first: ".concat(address));

              case 21:
                return _context5.abrupt("return", this);

              case 22:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[10, 18]]);
      }));

      function setPrivateKey(_x6) {
        return _setPrivateKey.apply(this, arguments);
      }

      return setPrivateKey;
    }()
    /**
     * Sets the client's account number.
     * @param {boolean} accountNumber
     */

  }, {
    key: "setAccountNumber",
    value: function setAccountNumber(accountNumber) {
      this.account_number = accountNumber;
    }
    /**
     * Use async broadcast mode. Broadcasts faster with less guarantees (default off)
     * @param {Boolean} useAsyncBroadcast
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useAsyncBroadcast",
    value: function useAsyncBroadcast() {
      var _useAsyncBroadcast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this._useAsyncBroadcast = _useAsyncBroadcast;
      return this;
    }
    /**
     * Sets the signing delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "setSigningDelegate",
    value: function setSigningDelegate(delegate) {
      if (typeof delegate !== "function") throw new Error("signing delegate must be a function");
      this._signingDelegate = delegate;
      return this;
    }
    /**
     * Sets the broadcast delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "setBroadcastDelegate",
    value: function setBroadcastDelegate(delegate) {
      if (typeof delegate !== "function") throw new Error("broadcast delegate must be a function");
      this._broadcastDelegate = delegate;
      return this;
    }
    /**
     * Applies the default signing delegate.
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useDefaultSigningDelegate",
    value: function useDefaultSigningDelegate() {
      this._signingDelegate = DefaultSigningDelegate;
      return this;
    }
    /**
     * Applies the default broadcast delegate.
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useDefaultBroadcastDelegate",
    value: function useDefaultBroadcastDelegate() {
      this._broadcastDelegate = DefaultBroadcastDelegate;
      return this;
    }
    /**
     * Applies the Ledger signing delegate.
     * @param {function} ledgerApp
     * @param {function} preSignCb
     * @param {function} postSignCb
     * @param {function} errCb
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useLedgerSigningDelegate",
    value: function useLedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb, hdPath) {
      this._signingDelegate = LedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb, hdPath);
      return this;
    }
    /**
     * Transfer tokens from one address to another.
     * @param {String} fromAddress
     * @param {String} toAddress
     * @param {Number} amount
     * @param {String} asset
     * @param {String} memo optional memo
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "transfer",
    value: function () {
      var _transfer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(fromAddress, toAddress, amount, asset) {
        var memo,
            sequence,
            accCode,
            toAccCode,
            coin,
            msg,
            signMsg,
            signedTx,
            _args6 = arguments;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                memo = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : "";
                sequence = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : null;
                accCode = crypto.decodeAddress(fromAddress);
                toAccCode = crypto.decodeAddress(toAddress);
                amount = new _big["default"](amount);
                amount = Number(amount.mul(BASENUMBER).toString());
                (0, _validateHelper.checkNumber)(amount, "amount");
                coin = {
                  denom: asset,
                  amount: amount
                };
                msg = {
                  inputs: [{
                    address: accCode,
                    coins: [coin]
                  }],
                  outputs: [{
                    address: toAccCode,
                    coins: [coin]
                  }],
                  msgType: "MsgSend"
                };
                signMsg = {
                  inputs: [{
                    address: fromAddress,
                    coins: [{
                      amount: amount,
                      denom: asset
                    }]
                  }],
                  outputs: [{
                    address: toAddress,
                    coins: [{
                      amount: amount,
                      denom: asset
                    }]
                  }]
                };
                _context6.next = 12;
                return this._prepareTransaction(msg, signMsg, fromAddress, sequence, memo);

              case 12:
                signedTx = _context6.sent;
                return _context6.abrupt("return", this._broadcastDelegate(signedTx));

              case 14:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function transfer(_x7, _x8, _x9, _x10) {
        return _transfer.apply(this, arguments);
      }

      return transfer;
    }()
    /**
     * Create and sign a multi send tx
     * @param {String} fromAddress
     * @param {Array} outputs
     * @example
     * const outputs = [
     * {
     *   "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
     *   "coins": [{
     *     "denom": "BNB",
     *     "amount": 10
     *   },{
      *     "denom": "BTC",
      *     "amount": 10
      *   }]
     * },
     * {
     *   "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
     *   "coins": [{
     *     "denom": "BTC",
     *     "amount": 10
     *   },{
      *     "denom": "BNB",
      *     "amount": 10
      *   }]
     * }]
     * @param {String} memo optional memo
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "multiSend",
    value: function () {
      var _multiSend = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(fromAddress, outputs) {
        var memo,
            sequence,
            fromAddrCode,
            inputs,
            transfers,
            msg,
            signInputs,
            signOutputs,
            signMsg,
            signedTx,
            _args7 = arguments;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                memo = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "";
                sequence = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : null;

                if (fromAddress) {
                  _context7.next = 4;
                  break;
                }

                throw new Error("fromAddress should not be falsy");

              case 4:
                if (Array.isArray(outputs)) {
                  _context7.next = 6;
                  break;
                }

                throw new Error("outputs should be array");

              case 6:
                checkOutputs(outputs); //sort denom by alphbet and init amount

                outputs.forEach(function (item) {
                  item.coins = item.coins.sort(function (a, b) {
                    return a.denom.localeCompare(b.denom);
                  });
                  item.coins.forEach(function (coin) {
                    var amount = new _big["default"](coin.amount);
                    coin.amount = Number(amount.mul(BASENUMBER).toString());
                  });
                });
                fromAddrCode = crypto.decodeAddress(fromAddress);
                inputs = [{
                  address: fromAddrCode,
                  coins: []
                }];
                transfers = [];
                outputs.forEach(function (item) {
                  var toAddcCode = crypto.decodeAddress(item.to);
                  calInputCoins(inputs, item.coins);
                  transfers.push({
                    address: toAddcCode,
                    coins: item.coins
                  });
                });
                msg = {
                  inputs: inputs,
                  outputs: transfers,
                  msgType: "MsgSend"
                };
                signInputs = [{
                  address: fromAddress,
                  coins: []
                }];
                signOutputs = [];
                outputs.forEach(function (item, index) {
                  signOutputs.push({
                    address: item.to,
                    coins: []
                  });
                  item.coins.forEach(function (c) {
                    signOutputs[index].coins.push(c);
                  });
                  calInputCoins(signInputs, item.coins);
                });
                signMsg = {
                  inputs: signInputs,
                  outputs: signOutputs
                };
                _context7.next = 19;
                return this._prepareTransaction(msg, signMsg, fromAddress, sequence, memo);

              case 19:
                signedTx = _context7.sent;
                return _context7.abrupt("return", this._broadcastDelegate(signedTx));

              case 21:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function multiSend(_x11, _x12) {
        return _multiSend.apply(this, arguments);
      }

      return multiSend;
    }()
    /**
     * Cancel an order.
     * @param {String} fromAddress
     * @param {String} symbol the market pair
     * @param {String} refid the order ID of the order to cancel
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "cancelOrder",
    value: function () {
      var _cancelOrder = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(fromAddress, symbol, refid) {
        var sequence,
            accCode,
            msg,
            signMsg,
            signedTx,
            _args8 = arguments;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                sequence = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : null;
                accCode = crypto.decodeAddress(fromAddress);
                msg = {
                  sender: accCode,
                  symbol: symbol,
                  refid: refid,
                  msgType: "CancelOrderMsg"
                };
                signMsg = {
                  refid: refid,
                  sender: fromAddress,
                  symbol: symbol
                };
                _context8.next = 6;
                return this._prepareTransaction(msg, signMsg, fromAddress, sequence, "");

              case 6:
                signedTx = _context8.sent;
                return _context8.abrupt("return", this._broadcastDelegate(signedTx));

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function cancelOrder(_x13, _x14, _x15) {
        return _cancelOrder.apply(this, arguments);
      }

      return cancelOrder;
    }()
    /**
     * Place an order.
     * @param {String} address
     * @param {String} symbol the market pair
     * @param {Number} side (1-Buy, 2-Sell)
     * @param {Number} price
     * @param {Number} quantity
     * @param {Number} sequence optional sequence
     * @param {Number} timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "placeOrder",
    value: function () {
      var _placeOrder = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        var address,
            symbol,
            side,
            price,
            quantity,
            sequence,
            timeinforce,
            accCode,
            data,
            bigPrice,
            bigQuantity,
            placeOrderMsg,
            signMsg,
            signedTx,
            _args9 = arguments;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                address = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : this.address;
                symbol = _args9.length > 1 ? _args9[1] : undefined;
                side = _args9.length > 2 ? _args9[2] : undefined;
                price = _args9.length > 3 ? _args9[3] : undefined;
                quantity = _args9.length > 4 ? _args9[4] : undefined;
                sequence = _args9.length > 5 && _args9[5] !== undefined ? _args9[5] : null;
                timeinforce = _args9.length > 6 && _args9[6] !== undefined ? _args9[6] : 1;

                if (address) {
                  _context9.next = 9;
                  break;
                }

                throw new Error("address should not be falsy");

              case 9:
                if (symbol) {
                  _context9.next = 11;
                  break;
                }

                throw new Error("symbol should not be falsy");

              case 11:
                if (!(side !== 1 && side !== 2)) {
                  _context9.next = 13;
                  break;
                }

                throw new Error("side can only be 1 or 2");

              case 13:
                if (!(timeinforce !== 1 && timeinforce !== 3)) {
                  _context9.next = 15;
                  break;
                }

                throw new Error("timeinforce can only be 1 or 3");

              case 15:
                accCode = crypto.decodeAddress(address);

                if (!(sequence !== 0 && !sequence)) {
                  _context9.next = 21;
                  break;
                }

                _context9.next = 19;
                return this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));

              case 19:
                data = _context9.sent;
                sequence = data.result && data.result.sequence;

              case 21:
                bigPrice = new _big["default"](price);
                bigQuantity = new _big["default"](quantity);
                placeOrderMsg = {
                  sender: accCode,
                  id: "".concat(accCode.toString("hex"), "-").concat(sequence + 1).toUpperCase(),
                  symbol: symbol,
                  ordertype: 2,
                  side: side,
                  price: parseFloat(bigPrice.mul(BASENUMBER).toString(), 10),
                  quantity: parseFloat(bigQuantity.mul(BASENUMBER).toString(), 10),
                  timeinforce: timeinforce,
                  msgType: "NewOrderMsg"
                };
                signMsg = {
                  id: placeOrderMsg.id,
                  ordertype: placeOrderMsg.ordertype,
                  price: placeOrderMsg.price,
                  quantity: placeOrderMsg.quantity,
                  sender: address,
                  side: placeOrderMsg.side,
                  symbol: placeOrderMsg.symbol,
                  timeinforce: timeinforce
                };
                (0, _validateHelper.checkNumber)(placeOrderMsg.price, "price");
                (0, _validateHelper.checkNumber)(placeOrderMsg.quantity, "quantity");
                _context9.next = 29;
                return this._prepareTransaction(placeOrderMsg, signMsg, address, sequence, "");

              case 29:
                signedTx = _context9.sent;
                return _context9.abrupt("return", this._broadcastDelegate(signedTx));

              case 31:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function placeOrder() {
        return _placeOrder.apply(this, arguments);
      }

      return placeOrder;
    }()
    /**
     * @param {String} address
     * @param {Number} proposalId
     * @param {String} baseAsset
     * @param {String} quoteAsset
     * @param {Number} initPrice
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "list",
    value: function () {
      var _list = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(address, proposalId, baseAsset, quoteAsset, initPrice) {
        var sequence,
            accCode,
            init_price,
            listMsg,
            signMsg,
            signedTx,
            _args10 = arguments;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                sequence = _args10.length > 5 && _args10[5] !== undefined ? _args10[5] : null;
                accCode = crypto.decodeAddress(address);

                if (address) {
                  _context10.next = 4;
                  break;
                }

                throw new Error("address should not be falsy");

              case 4:
                if (!(proposalId <= 0)) {
                  _context10.next = 6;
                  break;
                }

                throw new Error("proposal id should larger than 0");

              case 6:
                if (!(initPrice <= 0)) {
                  _context10.next = 8;
                  break;
                }

                throw new Error("price should larger than 0");

              case 8:
                if (baseAsset) {
                  _context10.next = 10;
                  break;
                }

                throw new Error("baseAsset should not be falsy");

              case 10:
                if (quoteAsset) {
                  _context10.next = 12;
                  break;
                }

                throw new Error("quoteAsset should not be falsy");

              case 12:
                init_price = Number(new _big["default"](initPrice).mul(BASENUMBER).toString());
                listMsg = {
                  from: accCode,
                  proposal_id: proposalId,
                  base_asset_symbol: baseAsset,
                  quote_asset_symbol: quoteAsset,
                  init_price: init_price,
                  msgType: "ListMsg"
                };
                signMsg = {
                  base_asset_symbol: baseAsset,
                  from: address,
                  init_price: init_price,
                  proposal_id: proposalId,
                  quote_asset_symbol: quoteAsset
                };
                _context10.next = 17;
                return this._prepareTransaction(listMsg, signMsg, address, sequence, "");

              case 17:
                signedTx = _context10.sent;
                return _context10.abrupt("return", this._broadcastDelegate(signedTx));

              case 19:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function list(_x16, _x17, _x18, _x19, _x20) {
        return _list.apply(this, arguments);
      }

      return list;
    }()
    /**
     * Set account flags
     * @param {String} address
     * @param {Number} flags new value of account flags
     * @param {Number} sequence optional sequence
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "setAccountFlags",
    value: function () {
      var _setAccountFlags = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(address, flags) {
        var sequence,
            accCode,
            msg,
            signMsg,
            signedTx,
            _args11 = arguments;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                sequence = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : null;
                accCode = crypto.decodeAddress(address);
                msg = {
                  from: accCode,
                  flags: flags,
                  msgType: "SetAccountFlagsMsg"
                };
                signMsg = {
                  flags: flags,
                  from: address
                };
                _context11.next = 6;
                return this._prepareTransaction(msg, signMsg, address, sequence, "");

              case 6:
                signedTx = _context11.sent;
                return _context11.abrupt("return", this._broadcastDelegate(signedTx));

              case 8:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function setAccountFlags(_x21, _x22) {
        return _setAccountFlags.apply(this, arguments);
      }

      return setAccountFlags;
    }()
    /**
     * Prepare a serialized raw transaction for sending to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @return {Transaction} signed transaction
     */

  }, {
    key: "_prepareTransaction",
    value: function () {
      var _prepareTransaction2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(msg, stdSignMsg, address) {
        var sequence,
            memo,
            data,
            options,
            tx,
            _args12 = arguments;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                sequence = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : null;
                memo = _args12.length > 4 && _args12[4] !== undefined ? _args12[4] : "";

                if (!((!this.account_number || sequence !== 0 && !sequence) && address)) {
                  _context12.next = 10;
                  break;
                }

                _context12.next = 5;
                return this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));

              case 5:
                data = _context12.sent;
                sequence = data.result.sequence;
                this.account_number = data.result.account_number; // if user has not used `await` in its call to setPrivateKey (old API), we should wait for the promise here

                _context12.next = 13;
                break;

              case 10:
                if (!this._setPkPromise) {
                  _context12.next = 13;
                  break;
                }

                _context12.next = 13;
                return this._setPkPromise;

              case 13:
                options = {
                  account_number: parseInt(this.account_number),
                  chain_id: this.chainId,
                  memo: memo,
                  msg: msg,
                  sequence: parseInt(sequence),
                  source: this._source,
                  type: msg.msgType
                };
                tx = new _tx["default"](options);
                return _context12.abrupt("return", this._signingDelegate.call(this, tx, stdSignMsg));

              case 16:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function _prepareTransaction(_x23, _x24, _x25) {
        return _prepareTransaction2.apply(this, arguments);
      }

      return _prepareTransaction;
    }()
    /**
     * Broadcast a transaction to the blockchain.
     * @param {signedTx} tx signed Transaction object
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "sendTransaction",
    value: function () {
      var _sendTransaction2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(signedTx, sync) {
        var signedBz;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                signedBz = signedTx.serialize();
                return _context13.abrupt("return", this.sendRawTransaction(signedBz, sync));

              case 2:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function sendTransaction(_x26, _x27) {
        return _sendTransaction2.apply(this, arguments);
      }

      return sendTransaction;
    }()
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {String} signedBz signed and serialized raw transaction
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "sendRawTransaction",
    value: function () {
      var _sendRawTransaction = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(signedBz) {
        var sync,
            opts,
            _args14 = arguments;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                sync = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : !this._useAsyncBroadcast;
                opts = {
                  data: signedBz,
                  headers: {
                    "content-type": "text/plain"
                  }
                };
                return _context14.abrupt("return", this._httpClient.request("post", "".concat(api.broadcast, "?sync=").concat(sync), null, opts));

              case 3:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function sendRawTransaction(_x28) {
        return _sendRawTransaction.apply(this, arguments);
      }

      return sendRawTransaction;
    }()
    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Promise} resolves with response (success or fail)
     */

  }, {
    key: "_sendTransaction",
    value: function () {
      var _sendTransaction3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(msg, stdSignMsg, address) {
        var sequence,
            memo,
            sync,
            signedTx,
            _args15 = arguments;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                sequence = _args15.length > 3 && _args15[3] !== undefined ? _args15[3] : null;
                memo = _args15.length > 4 && _args15[4] !== undefined ? _args15[4] : "";
                sync = _args15.length > 5 && _args15[5] !== undefined ? _args15[5] : !this._useAsyncBroadcast;
                _context15.next = 5;
                return this._prepareTransaction(msg, stdSignMsg, address, sequence, memo);

              case 5:
                signedTx = _context15.sent;
                return _context15.abrupt("return", this.sendTransaction(signedTx, sync));

              case 7:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function _sendTransaction(_x29, _x30, _x31) {
        return _sendTransaction3.apply(this, arguments);
      }

      return _sendTransaction;
    }()
    /**
     * get account
     * @param {String} address
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getAccount",
    value: function () {
      var _getAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
        var address,
            data,
            _args16 = arguments;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                address = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : this.address;

                if (address) {
                  _context16.next = 3;
                  break;
                }

                throw new Error("address should not be falsy");

              case 3:
                _context16.prev = 3;
                _context16.next = 6;
                return this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));

              case 6:
                data = _context16.sent;
                return _context16.abrupt("return", data);

              case 10:
                _context16.prev = 10;
                _context16.t0 = _context16["catch"](3);
                return _context16.abrupt("return", null);

              case 13:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this, [[3, 10]]);
      }));

      function getAccount() {
        return _getAccount.apply(this, arguments);
      }

      return getAccount;
    }()
    /**
     * get balances
     * @param {String} address optional address
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getBalance",
    value: function () {
      var _getBalance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
        var address,
            data,
            _args17 = arguments;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                address = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : this.address;
                _context17.prev = 1;
                _context17.next = 4;
                return this.getAccount(address);

              case 4:
                data = _context17.sent;
                return _context17.abrupt("return", data.result.balances);

              case 8:
                _context17.prev = 8;
                _context17.t0 = _context17["catch"](1);
                return _context17.abrupt("return", []);

              case 11:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this, [[1, 8]]);
      }));

      function getBalance() {
        return _getBalance.apply(this, arguments);
      }

      return getBalance;
    }()
    /**
     * get markets
     * @param {Number} limit max 1000 is default
     * @param {Number} offset from beggining, default 0
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getMarkets",
    value: function () {
      var _getMarkets = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
        var limit,
            offset,
            data,
            _args18 = arguments;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                limit = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : 1000;
                offset = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : 0;
                _context18.prev = 2;
                _context18.next = 5;
                return this._httpClient.request("get", "".concat(api.getMarkets, "?limit=").concat(limit, "&offset=").concat(offset));

              case 5:
                data = _context18.sent;
                return _context18.abrupt("return", data);

              case 9:
                _context18.prev = 9;
                _context18.t0 = _context18["catch"](2);
                console.warn("getMarkets error", _context18.t0);
                return _context18.abrupt("return", []);

              case 13:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this, [[2, 9]]);
      }));

      function getMarkets() {
        return _getMarkets.apply(this, arguments);
      }

      return getMarkets;
    }()
    /**
     * get transactions for an account
     * @param {String} address optional address
     * @param {Number} offset from beggining, default 0
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getTransactions",
    value: function () {
      var _getTransactions = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
        var address,
            offset,
            data,
            _args19 = arguments;
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                address = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : this.address;
                offset = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : 0;
                _context19.prev = 2;
                _context19.next = 5;
                return this._httpClient.request("get", "".concat(api.getTransactions, "?address=").concat(address, "&offset=").concat(offset));

              case 5:
                data = _context19.sent;
                return _context19.abrupt("return", data);

              case 9:
                _context19.prev = 9;
                _context19.t0 = _context19["catch"](2);
                console.warn("getTransactions error", _context19.t0);
                return _context19.abrupt("return", []);

              case 13:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[2, 9]]);
      }));

      function getTransactions() {
        return _getTransactions.apply(this, arguments);
      }

      return getTransactions;
    }()
    /**
     * get transaction
     * @param {String} hash the transaction hash
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getTx",
    value: function () {
      var _getTx = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(hash) {
        var data;
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.prev = 0;
                _context20.next = 3;
                return this._httpClient.request("get", "".concat(api.getTx, "/").concat(hash));

              case 3:
                data = _context20.sent;
                return _context20.abrupt("return", data);

              case 7:
                _context20.prev = 7;
                _context20.t0 = _context20["catch"](0);
                console.warn("getTx error", _context20.t0);
                return _context20.abrupt("return", []);

              case 11:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this, [[0, 7]]);
      }));

      function getTx(_x32) {
        return _getTx.apply(this, arguments);
      }

      return getTx;
    }()
    /**
     * get depth for a given market
     * @param {String} symbol the market pair
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getDepth",
    value: function () {
      var _getDepth = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
        var symbol,
            data,
            _args21 = arguments;
        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                symbol = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : "BNB_BUSD-BD1";
                _context21.prev = 1;
                _context21.next = 4;
                return this._httpClient.request("get", "".concat(api.getDepth, "?symbol=").concat(symbol));

              case 4:
                data = _context21.sent;
                return _context21.abrupt("return", data);

              case 8:
                _context21.prev = 8;
                _context21.t0 = _context21["catch"](1);
                console.warn("getDepth error", _context21.t0);
                return _context21.abrupt("return", []);

              case 12:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this, [[1, 8]]);
      }));

      function getDepth() {
        return _getDepth.apply(this, arguments);
      }

      return getDepth;
    }()
    /**
     * get open orders for an address
     * @param {String} address binance address
     * @param {String} symbol binance BEP2 symbol
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getOpenOrders",
    value: function () {
      var _getOpenOrders = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
        var address,
            data,
            _args22 = arguments;
        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                address = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : this.address;
                _context22.prev = 1;
                _context22.next = 4;
                return this._httpClient.request("get", "".concat(api.getOpenOrders, "?address=").concat(address));

              case 4:
                data = _context22.sent;
                return _context22.abrupt("return", data);

              case 8:
                _context22.prev = 8;
                _context22.t0 = _context22["catch"](1);
                console.warn("getOpenOrders error", _context22.t0);
                return _context22.abrupt("return", []);

              case 12:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this, [[1, 8]]);
      }));

      function getOpenOrders() {
        return _getOpenOrders.apply(this, arguments);
      }

      return getOpenOrders;
    }()
    /**
     * get atomic swap
     * @param {String} swapID: ID of an existing swap
     * @return {Promise} AtomicSwap
     */

  }, {
    key: "getSwapByID",
    value: function () {
      var _getSwapByID = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(swapID) {
        var data;
        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.prev = 0;
                _context23.next = 3;
                return this._httpClient.request("get", "".concat(api.getSwaps, "/").concat(swapID));

              case 3:
                data = _context23.sent;
                return _context23.abrupt("return", data);

              case 7:
                _context23.prev = 7;
                _context23.t0 = _context23["catch"](0);
                console.warn("query swap by swapID error", _context23.t0);
                return _context23.abrupt("return", []);

              case 11:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this, [[0, 7]]);
      }));

      function getSwapByID(_x33) {
        return _getSwapByID.apply(this, arguments);
      }

      return getSwapByID;
    }()
    /**
     * query atomic swap list by creator address
     * @param {String} creator: swap creator address
     * @param {Number} offset from beginning, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Promise} Array of AtomicSwap
     */

  }, {
    key: "getSwapByCreator",
    value: function () {
      var _getSwapByCreator = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(creator) {
        var limit,
            offset,
            data,
            _args24 = arguments;
        return _regenerator["default"].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                limit = _args24.length > 1 && _args24[1] !== undefined ? _args24[1] : 100;
                offset = _args24.length > 2 && _args24[2] !== undefined ? _args24[2] : 0;
                _context24.prev = 2;
                _context24.next = 5;
                return this._httpClient.request("get", "".concat(api.getSwaps, "?fromAddress=").concat(creator, "&limit=").concat(limit, "&offset=").concat(offset));

              case 5:
                data = _context24.sent;
                return _context24.abrupt("return", data);

              case 9:
                _context24.prev = 9;
                _context24.t0 = _context24["catch"](2);
                console.warn("query swap list by swap creator error", _context24.t0);
                return _context24.abrupt("return", []);

              case 13:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this, [[2, 9]]);
      }));

      function getSwapByCreator(_x34) {
        return _getSwapByCreator.apply(this, arguments);
      }

      return getSwapByCreator;
    }()
    /**
     * query atomic swap list by recipient address
     * @param {String} recipient: the recipient address of the swap
     * @param {Number} offset from beginning, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Promise} Array of AtomicSwap
     */

  }, {
    key: "getSwapByRecipient",
    value: function () {
      var _getSwapByRecipient = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(recipient) {
        var limit,
            offset,
            data,
            _args25 = arguments;
        return _regenerator["default"].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                limit = _args25.length > 1 && _args25[1] !== undefined ? _args25[1] : 100;
                offset = _args25.length > 2 && _args25[2] !== undefined ? _args25[2] : 0;
                _context25.prev = 2;
                _context25.next = 5;
                return this._httpClient.request("get", "".concat(api.getSwaps, "?toAddress=").concat(recipient, "&limit=").concat(limit, "&offset=").concat(offset));

              case 5:
                data = _context25.sent;
                return _context25.abrupt("return", data);

              case 9:
                _context25.prev = 9;
                _context25.t0 = _context25["catch"](2);
                console.warn("query swap list by swap recipient error", _context25.t0);
                return _context25.abrupt("return", []);

              case 13:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this, [[2, 9]]);
      }));

      function getSwapByRecipient(_x35) {
        return _getSwapByRecipient.apply(this, arguments);
      }

      return getSwapByRecipient;
    }()
    /**
     * Creates a private key and returns it and its address.
     * @return {object} the private key and address in an object.
     * {
     *  address,
     *  privateKey
     * }
     */

  }, {
    key: "createAccount",
    value: function createAccount() {
      var privateKey = crypto.generatePrivateKey();
      return {
        privateKey: privateKey,
        address: crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)
      };
    }
    /**
     * Creates an account keystore object, and returns the private key and address.
     * @param {String} password
     *  {
     *  privateKey,
     *  address,
     *  keystore
     * }
     */

  }, {
    key: "createAccountWithKeystore",
    value: function createAccountWithKeystore(password) {
      if (!password) {
        throw new Error("password should not be falsy");
      }

      var privateKey = crypto.generatePrivateKey();
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      var keystore = crypto.generateKeyStore(privateKey, password);
      return {
        privateKey: privateKey,
        address: address,
        keystore: keystore
      };
    }
    /**
     * Creates an account from mnemonic seed phrase.
     * @return {object}
     * {
     *  privateKey,
     *  address,
     *  mnemonic
     * }
     */

  }, {
    key: "createAccountWithMneomnic",
    value: function createAccountWithMneomnic() {
      var mnemonic = crypto.generateMnemonic();
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address,
        mnemonic: mnemonic
      };
    }
    /**
     * Recovers an account from a keystore object.
     * @param {object} keystore object.
     * @param {string} password password.
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromKeystore",
    value: function recoverAccountFromKeystore(keystore, password) {
      var privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    }
    /**
     * Recovers an account from a mnemonic seed phrase.
     * @param {string} mneomnic
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromMnemonic",
    value: function recoverAccountFromMnemonic(mnemonic) {
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    } // support an old method name containing a typo

  }, {
    key: "recoverAccountFromMneomnic",
    value: function recoverAccountFromMneomnic(mnemonic) {
      return this.recoverAccountFromMnemonic(mnemonic);
    }
    /**
     * Recovers an account using private key.
     * @param {String} privateKey
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromPrivateKey",
    value: function recoverAccountFromPrivateKey(privateKey) {
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    }
    /**
     * Validates an address.
     * @param {String} address
     * @param {String} prefix
     * @return {Boolean}
     */

  }, {
    key: "checkAddress",
    value: function checkAddress(address) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.addressPrefix;
      return crypto.checkAddress(address, prefix);
    }
    /**
     * Returns the address for the current account if setPrivateKey has been called on this client.
     * @return {String}
     */

  }, {
    key: "getClientKeyAddress",
    value: function getClientKeyAddress() {
      if (!this.privateKey) throw new Error("no private key is set on this client");
      var address = crypto.getAddressFromPrivateKey(this.privateKey, this.addressPrefix);
      this.address = address;
      return address;
    }
  }]);
  return BncClient;
}();

exports.BncClient = BncClient;