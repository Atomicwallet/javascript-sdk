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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _tx = require("../tx/");

var crypto = _interopRequireWildcard(require("../crypto/"));

var _validateHelper = require("../utils/validateHelper");

var _buffer = require("buffer");

/**
 * @module Swap
 */
var Swap = /*#__PURE__*/function () {
  /**
   * @param {Object} bncClient
   */
  function Swap(bncClient) {
    (0, _classCallCheck2["default"])(this, Swap);

    if (!Swap.instance) {
      this._bncClient = bncClient;
      Swap.instance = this;
    }

    return Swap.instance;
  }
  /**
   * HTLT(Hash timer locked transfer, create an atomic swap)
   * @param {String} from
   * @param {String} recipient
   * @param {String} recipientOtherChain
   * @param {String} senderOtherChain
   * @param {String} randomNumberHash
   * @param {Number} timestamp
   * @param {Array} amount
   * @param {String} expectedIncome
   * @param {Number} heightSpan
   * @param {boolean} crossChain
   * @returns {Promise}  resolves with response (success or fail)
   */


  (0, _createClass2["default"])(Swap, [{
    key: "HTLT",
    value: function () {
      var _HTLT = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(from, recipient, recipientOtherChain, senderOtherChain, randomNumberHash, timestamp, amount, expectedIncome, heightSpan, crossChain) {
        var htltMsg, signHTLTMsg, signedTx;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _validateHelper.checkCoins)(amount);
                htltMsg = {
                  from: crypto.decodeAddress(from),
                  to: crypto.decodeAddress(recipient),
                  recipient_other_chain: recipientOtherChain,
                  sender_other_chain: senderOtherChain,
                  random_number_hash: _buffer.Buffer.from(randomNumberHash, 'hex'),
                  timestamp: timestamp,
                  amount: amount,
                  expected_income: expectedIncome,
                  height_span: heightSpan,
                  cross_chain: crossChain,
                  msgType: _tx.TxTypes.HTLTMsg
                };
                signHTLTMsg = {
                  from: from,
                  to: recipient,
                  recipient_other_chain: recipientOtherChain,
                  sender_other_chain: senderOtherChain,
                  random_number_hash: randomNumberHash,
                  timestamp: timestamp,
                  amount: amount,
                  expected_income: expectedIncome,
                  height_span: heightSpan,
                  cross_chain: crossChain
                };
                _context.next = 5;
                return this._bncClient._prepareTransaction(htltMsg, signHTLTMsg, from);

              case 5:
                signedTx = _context.sent;
                return _context.abrupt("return", this._bncClient._broadcastDelegate(signedTx));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function HTLT(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
        return _HTLT.apply(this, arguments);
      }

      return HTLT;
    }()
    /**
     * depositHTLT(deposit assets to an existing swap)
     * @param {String} from
     * @param {String} swapID
     * @param {Array} amount
     * @returns {Promise}  resolves with response (success or fail)
     */

  }, {
    key: "depositHTLT",
    value: function () {
      var _depositHTLT = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(from, swapID, amount) {
        var depositHTLTMsg, signDepositHTLTMsg, signedTx;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                (0, _validateHelper.checkCoins)(amount);
                depositHTLTMsg = {
                  from: crypto.decodeAddress(from),
                  amount: amount,
                  swap_id: _buffer.Buffer.from(swapID, 'hex'),
                  msgType: _tx.TxTypes.DepositHTLTMsg
                };
                signDepositHTLTMsg = {
                  from: from,
                  amount: amount,
                  swap_id: swapID
                };
                _context2.next = 5;
                return this._bncClient._prepareTransaction(depositHTLTMsg, signDepositHTLTMsg, from);

              case 5:
                signedTx = _context2.sent;
                return _context2.abrupt("return", this._bncClient._broadcastDelegate(signedTx));

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function depositHTLT(_x11, _x12, _x13) {
        return _depositHTLT.apply(this, arguments);
      }

      return depositHTLT;
    }()
    /**
     * claimHTLT(claim assets from an swap)
     * @param {String} from
     * @param {String} swapID
     * @param {String} randomNumber
     * @returns {Promise}  resolves with response (success or fail)
     */

  }, {
    key: "claimHTLT",
    value: function () {
      var _claimHTLT = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(from, swapID, randomNumber) {
        var claimHTLTMsg, signClaimHTLTMsg, signedTx;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                claimHTLTMsg = {
                  from: crypto.decodeAddress(from),
                  swap_id: _buffer.Buffer.from(swapID, 'hex'),
                  random_number: _buffer.Buffer.from(randomNumber, 'hex'),
                  msgType: _tx.TxTypes.ClaimHTLTMsg
                };
                signClaimHTLTMsg = {
                  from: from,
                  swap_id: swapID,
                  random_number: randomNumber
                };
                _context3.next = 4;
                return this._bncClient._prepareTransaction(claimHTLTMsg, signClaimHTLTMsg, from);

              case 4:
                signedTx = _context3.sent;
                return _context3.abrupt("return", this._bncClient._broadcastDelegate(signedTx));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function claimHTLT(_x14, _x15, _x16) {
        return _claimHTLT.apply(this, arguments);
      }

      return claimHTLT;
    }()
    /**
     * refundHTLT(refund assets from an swap)
     * @param {String} from
     * @param {String} swapID
     * @returns {Promise}  resolves with response (success or fail)
     */

  }, {
    key: "refundHTLT",
    value: function () {
      var _refundHTLT = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(from, swapID) {
        var refundHTLTMsg, signRefundHTLTMsg, signedTx;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                refundHTLTMsg = {
                  from: crypto.decodeAddress(from),
                  swap_id: _buffer.Buffer.from(swapID, 'hex'),
                  msgType: _tx.TxTypes.RefundHTLTMsg
                };
                signRefundHTLTMsg = {
                  from: from,
                  swap_id: swapID
                };
                _context4.next = 4;
                return this._bncClient._prepareTransaction(refundHTLTMsg, signRefundHTLTMsg, from);

              case 4:
                signedTx = _context4.sent;
                return _context4.abrupt("return", this._bncClient._broadcastDelegate(signedTx));

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function refundHTLT(_x17, _x18) {
        return _refundHTLT.apply(this, arguments);
      }

      return refundHTLT;
    }()
  }]);
  return Swap;
}();

(0, _defineProperty2["default"])(Swap, "instance", void 0);
var _default = Swap;
exports["default"] = _default;