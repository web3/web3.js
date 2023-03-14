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

export const validBoolCoderData: [any, string][] = [
    [1, "0000000000000000000000000000000000000000000000000000000000000001"],
    [0, "0000000000000000000000000000000000000000000000000000000000000000"],
    [BigInt(1), "0000000000000000000000000000000000000000000000000000000000000001"],
    [BigInt(0), "0000000000000000000000000000000000000000000000000000000000000000"],
    ["0x1", "0000000000000000000000000000000000000000000000000000000000000001"],
    ["0x0", "0000000000000000000000000000000000000000000000000000000000000000"],
    [true, "0000000000000000000000000000000000000000000000000000000000000001"],
    [false, "0000000000000000000000000000000000000000000000000000000000000000"],
    ["false", "0000000000000000000000000000000000000000000000000000000000000000"],
    ["true", "0000000000000000000000000000000000000000000000000000000000000001"],
]

export const invalidBoolCoderData: [any][] = [
    ["blem"],
    ["--123"],
    ["2"],
    ["-1"],
    ["0x01"],
    ["0x00"],
]
