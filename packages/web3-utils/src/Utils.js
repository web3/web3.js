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
// TODO: SIGNATURE TYPE OBJECT
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
