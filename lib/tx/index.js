"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.typePrefix = exports.txType = void 0;

var crypto = _interopRequireWildcard(require("../crypto/"));

var encoder = _interopRequireWildcard(require("../encoder/"));

var _varint = require("../encoder/varint");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var txType = {
  MsgSend: "MsgSend",
  NewOrderMsg: "NewOrderMsg",
  CancelOrderMsg: "CancelOrderMsg",
  StdTx: "StdTx",
  PubKeySecp256k1: "PubKeySecp256k1",
  SignatureSecp256k1: "SignatureSecp256k1"
};
exports.txType = txType;
var typePrefix = {
  MsgSend: "2A2C87FA",
  NewOrderMsg: "CE6DC043",
  CancelOrderMsg: "166E681B",
  StdTx: "F0625DEE",
  PubKeySecp256k1: "EB5AE987",
  SignatureSecp256k1: "7FC4A495"
  /**
   * Creates a new transaction object.
   * @example
   * var rawTx = {
   *   account_number: 1,
   *   chain_id: 'bnbchain-1000',
   *   memo: '',
   *   msg: {},
   *   type: 'NewOrderMsg',
   *   sequence: 29,
   * };
   * var tx = new Transaction(rawTx);
   * @property {Buffer} raw The raw vstruct encoded transaction
   * @param {Number} data.account_number account number
   * @param {String} data.chain_id bnbChain Id
   * @param {String} data.memo transaction memo
   * @param {String} type transaction type
   * @param {Object} data.msg object data of tx type
   * @param {Number} data.sequence transaction counts
   */

};
exports.typePrefix = typePrefix;

var Transaction =
/*#__PURE__*/
function () {
  function Transaction(data) {
    _classCallCheck(this, Transaction);

    if (!txType[data.type]) {
      throw new TypeError("does not support transaction type: ".concat(data.type));
    }

    if (!data.chain_id) {
      throw new Error("chain id should not be null");
    }

    data = data || {};
    this.type = data.type;
    this.sequence = data.sequence || 0;
    this.account_number = data.account_number || 0;
    this.chain_id = data.chain_id;
    this.msgs = data.msg ? [data.msg] : [];
    this.memo = data.memo;
  }
  /**
   * generate the sign bytes for a transaction, given a msg
   * @param {Object} concrete msg object
   * @return {Buffer}
   **/


  _createClass(Transaction, [{
    key: "getSignBytes",
    value: function getSignBytes(msg) {
      if (!msg) {
        throw new Error("msg should be an object");
      }

      var signMsg = {
        "account_number": this.account_number.toString(),
        "chain_id": this.chain_id,
        "data": null,
        "memo": this.memo,
        "msgs": [msg],
        "sequence": this.sequence.toString(),
        "source": "1"
      };
      return encoder.convertObjectToSignBytes(signMsg);
    }
    /**
     * attaches a signature to the transaction
     * @param {Elliptic.PublicKey} pubKey
     * @param {Buffer} signature
     * @return {Transaction}
     **/

  }, {
    key: "addSignature",
    value: function addSignature(pubKey, signature) {
      pubKey = this._serializePubKey(pubKey); // => Buffer

      this.signatures = [{
        pub_key: pubKey,
        signature: signature,
        account_number: this.account_number,
        sequence: this.sequence
      }];
      return this;
    }
    /**
     * sign transaction with a given private key and msg
     * @param {string} privateKey private key hex string
     * @param {Object} concrete msg object
     * @return {Transaction}
     **/

  }, {
    key: "sign",
    value: function sign(privateKey, msg) {
      var signBytes = this.getSignBytes(msg);
      var privKeyBuf = Buffer.from(privateKey, "hex");
      var signature = crypto.generateSignature(signBytes.toString("hex"), privKeyBuf);
      this.addSignature(crypto.generatePubKey(privKeyBuf), signature);
      return this;
    }
    /**
     * encode signed transaction to hex which is compatible with amino
     * @param {object} opts msg field
     */

  }, {
    key: "serialize",
    value: function serialize() {
      if (!this.signatures) {
        throw new Error("need signature");
      }

      var msg = this.msgs[0];
      var stdTx = {
        msg: [msg],
        signatures: this.signatures,
        memo: this.memo,
        source: 1,
        // web wallet value is 1
        data: "",
        msgType: txType.StdTx
      };
      var bytes = encoder.marshalBinary(stdTx);
      return bytes.toString("hex");
    }
    /**
     * serializes a public key in a 33-byte compressed format.
     * @param {Elliptic.PublicKey} unencodedPubKey
     * @return {Buffer}
     */

  }, {
    key: "_serializePubKey",
    value: function _serializePubKey(unencodedPubKey) {
      var format = 0x2;

      if (unencodedPubKey.y && unencodedPubKey.y.isOdd()) {
        format |= 0x1;
      }

      var pubBz = Buffer.concat([_varint.UVarInt.encode(format), unencodedPubKey.x.toArrayLike(Buffer, "be", 32)]); // prefixed with length

      pubBz = encoder.encodeBinaryByteArray(pubBz); // add the amino prefix

      pubBz = Buffer.concat([Buffer.from("EB5AE987", "hex"), pubBz]);
      return pubBz;
    }
  }]);

  return Transaction;
}();

Transaction.txType = txType;
Transaction.typePrefix = typePrefix;
var _default = Transaction;
exports.default = _default;