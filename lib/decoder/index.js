"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeFieldNumberAndTyp3 = exports.unMarshalBinaryBare = exports.unMarshalBinaryLengthPrefixed = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _protocolBuffersEncodings = require("protocol-buffers-encodings");

var _safeBuffer = require("safe-buffer");

var _is_js = _interopRequireDefault(require("is_js"));

var _encoderHelper = _interopRequireDefault(require("../utils/encoderHelper"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var decoder = function decoder(bytes, varType) {
  var val = varType.decode(bytes, 0);
  var offset = varType.encodingLength(val);
  return {
    val: val,
    offset: offset
  };
};
/**
 * js amino UnmarshalBinaryLengthPrefixed
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */


var unMarshalBinaryLengthPrefixed = function unMarshalBinaryLengthPrefixed(bytes, type) {
  if (bytes.length === 0) throw new TypeError("Cannot decode empty bytes"); // read byte-length prefix

  var _decoder = decoder(bytes, _protocolBuffersEncodings.varint),
      len = _decoder.offset;

  if (len < 0) throw new Error("Error reading msg byte-length prefix: got code ".concat(len));
  bytes = bytes.slice(len);
  return unMarshalBinaryBare(bytes, type);
};
/**
 * js amino UnmarshalBinaryBare
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */


exports.unMarshalBinaryLengthPrefixed = unMarshalBinaryLengthPrefixed;

var unMarshalBinaryBare = function unMarshalBinaryBare(bytes, type) {
  if (!_is_js["default"].object(type)) throw new TypeError("type should be object");
  if (!_safeBuffer.Buffer.isBuffer(bytes)) throw new TypeError("bytes must be buffer");

  if (_is_js["default"].array(type)) {
    if (!_is_js["default"].object(type[0])) throw new TypeError("type should be object");
    return decodeArrayBinary(bytes, type[0]);
  }

  return decodeBinary(bytes, type);
};

exports.unMarshalBinaryBare = unMarshalBinaryBare;

var decodeBinary = function decodeBinary(bytes, type, isLengthPrefixed) {
  if (_safeBuffer.Buffer.isBuffer(type)) {
    return decoder(bytes, _protocolBuffersEncodings.bytes);
  }

  if (_is_js["default"].array(type)) {
    return decodeArrayBinary(bytes, type);
  }

  if (_is_js["default"].number(type)) {
    return decoder(bytes, _protocolBuffersEncodings.varint);
  }

  if (_is_js["default"]["boolean"](type)) {
    return decoder(bytes, _protocolBuffersEncodings.bool);
  }

  if (_is_js["default"].string(type)) {
    return decoder(bytes, _protocolBuffersEncodings.string);
  }

  if (_is_js["default"].object(type)) {
    return decodeObjectBinary(bytes, type, isLengthPrefixed);
  }

  return;
};

var setDefaultValue = function setDefaultValue(type, key) {
  if (_is_js["default"].object(type[key])) type[key] = null;
  if (_is_js["default"].number(type[key])) type[key] = 0;
  if (_is_js["default"]["boolean"](type[key])) type[key] = false;
  if (_is_js["default"].string(type[key])) type[key] = "";
};

var decodeObjectBinary = function decodeObjectBinary(bytes, type, isLengthPrefixed) {
  var objectOffset = 0; // read byte-length prefix

  if (isLengthPrefixed) {
    var _decoder2 = decoder(bytes, _protocolBuffersEncodings.varint),
        len = _decoder2.offset;

    bytes = bytes.slice(len);
    objectOffset += len;
  } // If registered concrete, consume and verify prefix bytes.


  if (type.msgType) {
    bytes = bytes.slice(4);
    objectOffset += 4;
  }

  var lastFieldNum = 0;
  var keys = Object.keys(type);
  keys.forEach(function (key, index) {
    if (_is_js["default"].array(type[key])) {
      var _decodeArrayBinary = decodeArrayBinary(bytes, type[key][0]),
          offset = _decodeArrayBinary.offset,
          val = _decodeArrayBinary.val;

      objectOffset += offset;
      type[key] = val;
      bytes = bytes.slice(offset);
    } else {
      var _decodeFieldNumberAnd = decodeFieldNumberAndTyp3(bytes),
          fieldNum = _decodeFieldNumberAnd.fieldNum,
          typ = _decodeFieldNumberAnd.typ; //if this field is default value, continue


      if (index + 1 !== fieldNum || fieldNum < 0) {
        setDefaultValue(type, key);
        return;
      }

      if (fieldNum <= lastFieldNum) {
        throw new Error("encountered fieldNum: ".concat(fieldNum, ", but we have already seen fnum: ").concat(lastFieldNum));
      }

      lastFieldNum = fieldNum;

      if (index + 1 !== fieldNum) {
        throw new Error("field number is not expected");
      }

      var typeWanted = (0, _encoderHelper["default"])(type[key]);

      if (typ !== typeWanted) {
        throw new Error("field type is not expected");
      } //remove 1 byte of type


      bytes = bytes.slice(1);

      var _decodeBinary = decodeBinary(bytes, type[key], true),
          _val = _decodeBinary.val,
          _offset = _decodeBinary.offset;

      type[key] = _val; //remove decoded bytes

      bytes = bytes.slice(_offset);
      objectOffset += _offset + 1;
    }
  });
  return {
    val: type,
    offset: objectOffset
  };
};

var decodeArrayBinary = function decodeArrayBinary(bytes, type) {
  var arr = [];
  var arrayOffset = 0;

  var _decodeFieldNumberAnd2 = decodeFieldNumberAndTyp3(bytes),
      fieldNumber = _decodeFieldNumberAnd2.fieldNum;

  while (true) {
    var _decodeFieldNumberAnd3 = decodeFieldNumberAndTyp3(bytes),
        fieldNum = _decodeFieldNumberAnd3.fieldNum;

    if (fieldNum !== fieldNumber || fieldNum < 0) break; //remove 1 byte of encoded field number and type

    bytes = bytes.slice(1); //is default value, skip and continue read bytes

    if (bytes.length > 0 && bytes[0] === 0x00) continue;

    var _decodeBinary2 = decodeBinary(bytes, type, true),
        offset = _decodeBinary2.offset,
        val = _decodeBinary2.val;

    arr.push(_objectSpread({}, val));
    bytes = bytes.slice(offset); //add 1 byte of type

    arrayOffset += offset + 1;
    fieldNumber = fieldNum;
  } // console.log(arr)


  return {
    val: arr,
    offset: arrayOffset
  };
};

var decodeFieldNumberAndTyp3 = function decodeFieldNumberAndTyp3(bytes) {
  if (bytes.length < 2) {
    //default value
    return {
      fieldNum: -1
    };
  }

  var _decoder3 = decoder(bytes, _protocolBuffersEncodings.varint),
      val = _decoder3.val;

  var typ = val & 7;
  var fieldNum = val >> 3;

  if (fieldNum > 1 << 29 - 1) {
    throw new Error("invalid field num ".concat(fieldNum));
  }

  return {
    fieldNum: fieldNum,
    typ: typ
  };
};

exports.decodeFieldNumberAndTyp3 = decodeFieldNumberAndTyp3;