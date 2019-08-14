// /*
//     This file is part of web3.js.
//
//     web3.js is free software: you can redistribute it and/or modify
//     it under the terms of the GNU Lesser General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     web3.js is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU Lesser General Public License for more details.
//
//     You should have received a copy of the GNU Lesser General Public License
//     along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
// */
// /**
//  * @file Utils.js
//  * @author Fabian Vogelsteller <fabian@ethereum.org>
//  * @author Prince Sinha <sinhaprince013@gmail.com>
//  * @date 2017
//  */
//
// import Hash from 'eth-lib/lib/hash';
//
// /**
//  * Hashes values to a keccak256 hash using keccak 256
//  *
//  * To hash a HEX string the hex must have 0x in front.
//  *
//  * @method keccak256
//  * @return {String} the keccak256 string
//  */
// const KECCAK256_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
//
// export const keccak256 = (value) => {
//     if (isHexStrict(value) && /^0x/i.test(value.toString())) {
//         value = hexToBytes(value);
//     }
//
//     const returnValue = Hash.keccak256(value); // jshint ignore:line
//
//     if (returnValue === KECCAK256_NULL_S) {
//         return null;
//     } else {
//         return returnValue;
//     }
// };
// // expose the under the hood keccak256
// keccak256._Hash = Hash;
//
// /**
//  * Gets the r,s,v values from a signature
//  *
//  * @method getSignatureParameters
//  *
//  * @param {String} signature - ECDSA
//  *
//  * @return {Object} with r,s,v values
//  */
// export const getSignatureParameters = (signature) => {
//     if (!isHexStrict(signature)) {
//         throw new Error(`Given value "${signature}" is not a valid hex string.`);
//     }
//
//     const r = signature.slice(0, 66);
//     const s = `0x${signature.slice(66, 130)}`;
//     let v = `0x${signature.slice(130, 132)}`;
//     v = hexToNumber(v);
//
//     if (![27, 28].includes(v)) v += 27;
//
//     return {
//         r,
//         s,
//         v
//     };
// };
