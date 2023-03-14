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

export const validAddressCoderData: [string, string][] = [
    ["00000000219ab540356cbb839cbe05303d7705fa", "00000000000000000000000000000000219ab540356cbb839cbe05303d7705fa"],
    ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cC2", "000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
]

export const invalidAddressCoderData: [string][] = [
    ["blem"],
    ["--123"],
    ["2"],
    ["-1"],
    ["0x01"],
    ["0x00"],
]
