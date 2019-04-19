"use strict";

var BN = require("bn.js");

var VarInt = function VarInt(signed) {
  function decode() {
    throw Error("not implemented");
  }

  function encode(n) {
    var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Buffer.alloc(encodingLength(n));
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (n < 0) {
      throw Error("varint value is out of bounds");
    } // n = safeParseInt(n)


    n = n.toString();
    var bn = new BN(n, 10); // amino signed varint is multiplied by 2

    if (signed) {
      bn = bn.muln(2);
    }

    var i = 0;

    while (bn.gten(0x80)) {
      buffer[offset + i] = bn.andln(0xff) | 0x80;
      bn = bn.shrn(7);
      i++;
    }

    buffer[offset + i] = bn.andln(0xff);
    encode.bytes = i + 1;
    return buffer;
  }

  function encodingLength(n) {
    if (signed) n *= 2;

    if (n < 0) {
      throw Error("varint value is out of bounds");
    }

    var bits = Math.log2(n + 1);
    return Math.ceil(bits / 7) || 1;
  }

  return {
    encode: encode,
    decode: decode,
    encodingLength: encodingLength
  };
};

module.exports = VarInt(true);
module.exports.UVarInt = VarInt(false);
module.exports.VarInt = module.exports;