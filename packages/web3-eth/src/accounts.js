/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file accounts.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var helpers = require('web3-core-helpers');
var utils = require('web3-utils');
var rlp = require('rlp');
var elliptic = require('elliptic');
var secp256k1 = new (elliptic.ec)('secp256k1'); // eslint-disable-line

var extraUtils = {
    stripZeros: function(buffer) {
        for (var i = 0; i < buffer.length; i++) {
            if (buffer[i] !== 0) {
                break;
            }
        }
        return i > 0 ? buffer.slice(i) : buffer;
    },
    numberToBuffer: function(number) {
        var hex = utils.numberToHex(number).slice(2);
        var paddedHex = hex.length % 2 ? '0' + hex : hex;
        var bytes = utils.hexToBytes('0x' + paddedHex);
        var buffer = new Buffer(bytes);
        return extraUtils.stripZeros(buffer);
    },
    hexToBuffer: function(hex) {
        return hex ? extraUtils.stripZeros(new Buffer(utils.hexToBytes(extraUtils.hexString(hex)))) : new Buffer([]);
    },
    addressToBuffer: function(address) {
        return new Buffer(utils.hexToBytes(extraUtils.hexString(address, 20)));
    },
    hexString: function(string, bytes) {
        if (typeof string !== 'string' || bytes && !new RegExp('^(0x)?[0-9a-fA-F]{'+(bytes*2)+'}$').test(string)) {
            throw new Error('Type mismatch: expected ' + bytes + 'byte string, got ' + string);
        }
        return /^0x/.test(string) ? string : '0x' + string; 
    },
    publicToAddress: function(publicKey) {
        var hash = utils.keccak256(new Buffer(publicKey.slice(2), 'hex'));
        return utils.toChecksumAddress(hash.slice(-40));
    },
};

/**
 * Creates a new account from a safe source of entropy,
 * plus some user-provided entropy.
 *
 * @param {String} entropy - User-provided entropy
 * @returns {Account}
 */
function create(entropy) {
    var innerHex = utils.keccak256(utils.randomHex(32) + (entropy || utils.randomHex(32)));
    var middleHex = utils.randomHex(32) + innerHex + utils.randomHex(32);
    var outerHex = utils.keccak256(middleHex);
    return fromPrivate(outerHex);
}

/**
 * Creates a new account from a private key.
 *
 * @param {String} privateKey - Hex-encoded ("0x0123..."), 32-byte private key
 * @returns {Account}
 */
function fromPrivate(privateKey) {
    var buffer = new Buffer(extraUtils.hexString(privateKey, 32).slice(2), 'hex');
    var ecKey = secp256k1.keyFromPrivate(buffer);
    var publicKey = extraUtils.hexString(ecKey.getPublic(false, 'hex').slice(2), 64);
    return {
        address: extraUtils.publicToAddress(publicKey),
        publicKey: publicKey,
        privateKey: privateKey
    }
}

// HexString, PrivateKey, Number -> Signature
function sign(data, privateKey, chainId) {
    var buffer = new Buffer(data.slice(2), 'hex');
    var hash = new Buffer(utils.keccak256(buffer).slice(2), 'hex');
    var signature = secp256k1
        .keyFromPrivate(new Buffer(privateKey.slice(2), 'hex'))
        .sign(hash, { canonical: true });
    return '0x' + rlp.encode([
        new Buffer([(chainId || 1) * 2 + 35 + signature.recoveryParam]),
        extraUtils.numberToBuffer(signature.r),
        extraUtils.numberToBuffer(signature.s)]).toString('hex');
}

// HexString, Signature -> Address
function recover(data, signature) {
    var buffer = new Buffer(data.slice(2), 'hex');
    var hash = new Buffer(utils.keccak256(buffer).slice(2), "hex");
    var vals = rlp.decode(new Buffer(signature.slice(2), 'hex'));
    var v = utils.toBN(utils.bytesToHex(vals[0])).toNumber();
    var r = utils.toBN(utils.bytesToHex(vals[1]));
    var s = utils.toBN(utils.bytesToHex(vals[2]));
    var ecPublicKey = secp256k1.recoverPubKey(hash, {r: r, s: s}, 1 - (v % 2));
    var publicKey = extraUtils.hexString(ecPublicKey.encode('hex', false).slice(2), 64);
    return extraUtils.publicToAddress(publicKey);
}

// Transaction, PrivateKey -> RawTransaction
function signTransaction(tx, privateKey) {
    var signingData = [
        extraUtils.numberToBuffer(tx.nonce),
        extraUtils.numberToBuffer(tx.gasPrice),
        extraUtils.numberToBuffer(tx.gasLimit || tx.gas || 0),
        extraUtils.addressToBuffer(tx.to),
        extraUtils.numberToBuffer(tx.value),
        extraUtils.hexToBuffer(tx.data),
        extraUtils.numberToBuffer(tx.chainId || 1),
        extraUtils.numberToBuffer(0),
        extraUtils.numberToBuffer(0)];
    var signingDataHex = '0x' + rlp.encode(signingData).toString('hex');
    var signature = sign(signingDataHex, privateKey, tx.chainId);
    var signatureValues = rlp.decode(new Buffer(signature.slice(2), 'hex'));
    var rawTx = [].concat.call(signingData.slice(0,6), signatureValues);
    return '0x' + rlp.encode(rawTx).toString('hex');
}

// RawTransaction -> Address
function recoverTransaction(rawTx) {
    var values = rlp.decode(new Buffer(extraUtils.hexString(rawTx).slice(2), 'hex'));
    var signature = '0x' + rlp.encode(values.slice(6,9)).toString('hex');
    var signingData = values.slice(0, 6).concat(values[6][0] < 35 ? [] : [
        extraUtils.numberToBuffer(Math.floor((values[6][0] - 35) / 2)),
        extraUtils.numberToBuffer(0),
        extraUtils.numberToBuffer(0)]);
    var signingDataHex = '0x' + rlp.encode(signingData).toString('hex');
    return recover(signingDataHex, signature);
}

module.exports = {
    create: create,
    fromPrivate: fromPrivate,
    sign: sign,
    recover: recover,
    signTransaction: signTransaction,
    recoverTransaction: recoverTransaction,
    secp256k1: secp256k1,
    encrypt: null,
    decrypt: null,
    wallet: null
};
