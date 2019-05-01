"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BncClient = exports.checkNumber = exports.LedgerSigningDelegate = exports.DefaultBroadcastDelegate = exports.DefaultSigningDelegate = void 0;

var crypto = _interopRequireWildcard(require("../crypto"));

var _tx = _interopRequireDefault(require("../tx"));

var _request = _interopRequireDefault(require("../utils/request"));

var _big = _interopRequireDefault(require("big.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var MAX_INT64 = Math.pow(2, 63);
var api = {
  broadcast: "/api/v1/broadcast",
  nodeInfo: "/api/v1/node-info",
  getAccount: "/api/v1/account",
  getMarkets: "/api/v1/markets"
};
var NETWORK_PREFIX_MAPPING = {
  "testnet": "tbnb",
  "mainnet": "bnb"
  /**
   * The default signing delegate which uses the local private key.
   * @param  {Transaction} tx      the transaction
   * @param  {Object}      signMsg the canonical sign bytes for the msg
   * @return {Transaction}
   */

};

var DefaultSigningDelegate =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(tx, signMsg) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
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

var DefaultBroadcastDelegate =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(signedTx) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(tx, signMsg) {
        var signBytes, pubKeyResp, sigResp, pubKey;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
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
    }()
  );
};
/**
 * validate the input number.
 * @param {Number} value
 */


exports.LedgerSigningDelegate = LedgerSigningDelegate;

var checkNumber = function checkNumber(value) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "input number";

  if (value <= 0) {
    throw new Error("".concat(name, " should be a positive number"));
  }

  if (MAX_INT64 <= value) {
    throw new Error("".concat(name, " should be less than 2^63"));
  }
};
/**
 * The Binance Chain client.
 */


exports.checkNumber = checkNumber;

var BncClient =
/*#__PURE__*/
function () {
  /**
   * @param {string} server Binance Chain public url
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   */
  function BncClient(server) {
    var useAsyncBroadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, BncClient);

    if (!server) {
      throw new Error("Binance chain server should not be null");
    }

    this._httpClient = new _request.default(server);
    this._signingDelegate = DefaultSigningDelegate;
    this._broadcastDelegate = DefaultBroadcastDelegate;
    this._useAsyncBroadcast = useAsyncBroadcast;
  }
  /**
   * Initialize the client with the chain's ID. Asynchronous.
   * @return {Promise}
   */


  _createClass(BncClient, [{
    key: "initChain",
    value: function () {
      var _initChain = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var data;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
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
     * @return {Promise}
     */

  }, {
    key: "setPrivateKey",
    value: function () {
      var _setPrivateKey = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(privateKey) {
        var address, promise, data;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(privateKey !== this.privateKey)) {
                  _context5.next = 13;
                  break;
                }

                address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);

                if (address) {
                  _context5.next = 4;
                  break;
                }

                throw new Error("address is falsy: ${address}. invalid private key?");

              case 4:
                if (!(address === this.address)) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt("return", this);

              case 6:
                // safety
                this.privateKey = privateKey;
                this.address = address; // _setPkPromise used in _sendTransaction for non-await calls

                promise = this._setPkPromise = this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));
                _context5.next = 11;
                return promise;

              case 11:
                data = _context5.sent;
                this.account_number = data.result.account_number;

              case 13:
                return _context5.abrupt("return", this);

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function setPrivateKey(_x6) {
        return _setPrivateKey.apply(this, arguments);
      }

      return setPrivateKey;
    }()
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
      var _transfer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(fromAddress, toAddress, amount, asset) {
        var memo,
            sequence,
            accCode,
            toAccCode,
            coin,
            msg,
            signMsg,
            signedTx,
            _args6 = arguments;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                memo = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : "";
                sequence = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : null;
                accCode = crypto.decodeAddress(fromAddress);
                toAccCode = crypto.decodeAddress(toAddress);
                amount = parseInt(amount * Math.pow(10, 8));
                checkNumber(amount, "amount");
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
                _context6.next = 11;
                return this._prepareTransaction(msg, signMsg, fromAddress, sequence, memo);

              case 11:
                signedTx = _context6.sent;
                return _context6.abrupt("return", this._broadcastDelegate(signedTx));

              case 13:
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
      var _cancelOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(fromAddress, symbol, refid) {
        var sequence,
            accCode,
            msg,
            signMsg,
            signedTx,
            _args7 = arguments;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                sequence = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : null;
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
                _context7.next = 6;
                return this._prepareTransaction(msg, signMsg, fromAddress, sequence, "");

              case 6:
                signedTx = _context7.sent;
                return _context7.abrupt("return", this._broadcastDelegate(signedTx));

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function cancelOrder(_x11, _x12, _x13) {
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
      var _placeOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
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
            _args8 = arguments;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                address = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : this.address;
                symbol = _args8.length > 1 ? _args8[1] : undefined;
                side = _args8.length > 2 ? _args8[2] : undefined;
                price = _args8.length > 3 ? _args8[3] : undefined;
                quantity = _args8.length > 4 ? _args8[4] : undefined;
                sequence = _args8.length > 5 && _args8[5] !== undefined ? _args8[5] : null;
                timeinforce = _args8.length > 6 && _args8[6] !== undefined ? _args8[6] : 1;

                if (address) {
                  _context8.next = 9;
                  break;
                }

                throw new Error("address should not be falsy");

              case 9:
                if (symbol) {
                  _context8.next = 11;
                  break;
                }

                throw new Error("symbol should not be falsy");

              case 11:
                if (!(side !== 1 && side !== 2)) {
                  _context8.next = 13;
                  break;
                }

                throw new Error("side can only be 1 or 2");

              case 13:
                if (!(timeinforce !== 1 && timeinforce !== 3)) {
                  _context8.next = 15;
                  break;
                }

                throw new Error("timeinforce can only be 1 or 3");

              case 15:
                accCode = crypto.decodeAddress(address);

                if (!(sequence !== 0 && !sequence)) {
                  _context8.next = 21;
                  break;
                }

                _context8.next = 19;
                return this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));

              case 19:
                data = _context8.sent;
                sequence = data.result && data.result.sequence;

              case 21:
                bigPrice = new _big.default(price);
                bigQuantity = new _big.default(quantity);
                placeOrderMsg = {
                  sender: accCode,
                  id: "".concat(accCode.toString("hex"), "-").concat(sequence + 1).toUpperCase(),
                  symbol: symbol,
                  ordertype: 2,
                  side: side,
                  price: parseFloat(bigPrice.mul(Math.pow(10, 8)).toString(), 10),
                  quantity: parseFloat(bigQuantity.mul(Math.pow(10, 8)).toString(), 10),
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
                checkNumber(placeOrderMsg.price, "price");
                checkNumber(placeOrderMsg.quantity, "quantity");
                _context8.next = 29;
                return this._prepareTransaction(placeOrderMsg, signMsg, address, sequence, "");

              case 29:
                signedTx = _context8.sent;
                return _context8.abrupt("return", this._broadcastDelegate(signedTx));

              case 31:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function placeOrder() {
        return _placeOrder.apply(this, arguments);
      }

      return placeOrder;
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
      var _prepareTransaction2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(msg, stdSignMsg, address) {
        var sequence,
            memo,
            data,
            options,
            tx,
            _args9 = arguments;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                sequence = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : null;
                memo = _args9.length > 4 && _args9[4] !== undefined ? _args9[4] : "";

                if (!((!this.account_number || !sequence) && address)) {
                  _context9.next = 10;
                  break;
                }

                _context9.next = 5;
                return this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));

              case 5:
                data = _context9.sent;
                sequence = data.result.sequence;
                this.account_number = data.result.account_number; // if user has not used `await` in its call to setPrivateKey (old API), we should wait for the promise here

                _context9.next = 13;
                break;

              case 10:
                if (!this._setPkPromise) {
                  _context9.next = 13;
                  break;
                }

                _context9.next = 13;
                return this._setPkPromise;

              case 13:
                options = {
                  account_number: parseInt(this.account_number),
                  chain_id: this.chainId,
                  memo: memo,
                  msg: msg,
                  sequence: parseInt(sequence),
                  type: msg.msgType
                };
                tx = new _tx.default(options);
                return _context9.abrupt("return", this._signingDelegate.call(this, tx, stdSignMsg));

              case 16:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function _prepareTransaction(_x14, _x15, _x16) {
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
      var _sendTransaction2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(signedTx, sync) {
        var signedBz;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                signedBz = signedTx.serialize();
                return _context10.abrupt("return", this.sendRawTransaction(signedBz, sync));

              case 2:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function sendTransaction(_x17, _x18) {
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
      var _sendRawTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(signedBz) {
        var sync,
            opts,
            _args11 = arguments;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                sync = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : !this._useAsyncBroadcast;
                opts = {
                  data: signedBz,
                  headers: {
                    "content-type": "text/plain"
                  }
                };
                return _context11.abrupt("return", this._httpClient.request("post", "".concat(api.broadcast, "?sync=").concat(sync), null, opts));

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function sendRawTransaction(_x19) {
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
      var _sendTransaction3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(msg, stdSignMsg, address) {
        var sequence,
            memo,
            sync,
            signedTx,
            _args12 = arguments;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                sequence = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : null;
                memo = _args12.length > 4 && _args12[4] !== undefined ? _args12[4] : "";
                sync = _args12.length > 5 && _args12[5] !== undefined ? _args12[5] : !this._useAsyncBroadcast;
                _context12.next = 5;
                return this._prepareTransaction(msg, stdSignMsg, address, sequence, memo);

              case 5:
                signedTx = _context12.sent;
                return _context12.abrupt("return", this.sendTransaction(signedTx, sync));

              case 7:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function _sendTransaction(_x20, _x21, _x22) {
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
      var _getAccount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13() {
        var address,
            data,
            _args13 = arguments;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                address = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : this.address;

                if (address) {
                  _context13.next = 3;
                  break;
                }

                throw new Error("address should not be falsy");

              case 3:
                _context13.prev = 3;
                _context13.next = 6;
                return this._httpClient.request("get", "".concat(api.getAccount, "/").concat(address));

              case 6:
                data = _context13.sent;
                return _context13.abrupt("return", data);

              case 10:
                _context13.prev = 10;
                _context13.t0 = _context13["catch"](3);
                return _context13.abrupt("return", null);

              case 13:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[3, 10]]);
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
      var _getBalance = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee14() {
        var address,
            data,
            _args14 = arguments;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                address = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : this.address;
                _context14.prev = 1;
                _context14.next = 4;
                return this.getAccount(address);

              case 4:
                data = _context14.sent;
                return _context14.abrupt("return", data.result.balances);

              case 8:
                _context14.prev = 8;
                _context14.t0 = _context14["catch"](1);
                return _context14.abrupt("return", []);

              case 11:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[1, 8]]);
      }));

      function getBalance() {
        return _getBalance.apply(this, arguments);
      }

      return getBalance;
    }()
    /**
     * get markets
     * @param {Number} offset from beggining, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Promise} resolves with http response
     */

  }, {
    key: "getMarkets",
    value: function () {
      var _getMarkets = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee15() {
        var limit,
            offset,
            data,
            _args15 = arguments;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                limit = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : 1000;
                offset = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : 0;
                _context15.prev = 2;
                _context15.next = 5;
                return this._httpClient.request("get", "".concat(api.getMarkets, "?limit=").concat(limit, "&offset=").concat(offset));

              case 5:
                data = _context15.sent;
                return _context15.abrupt("return", data);

              case 9:
                _context15.prev = 9;
                _context15.t0 = _context15["catch"](2);
                console.warn("getMarkets error", _context15.t0);
                return _context15.abrupt("return", []);

              case 13:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[2, 9]]);
      }));

      function getMarkets() {
        return _getMarkets.apply(this, arguments);
      }

      return getMarkets;
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
     * @param {string} keystore password.
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
    key: "recoverAccountFromMneomnic",
    value: function recoverAccountFromMneomnic(mneomnic) {
      var privateKey = crypto.getPrivateKeyFromMnemonic(mneomnic);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
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
     * @return {Boolean}
     */

  }, {
    key: "checkAddress",
    value: function checkAddress(address) {
      return crypto.checkAddress(address);
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