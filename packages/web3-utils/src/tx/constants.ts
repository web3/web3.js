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

export const MAX_CALLDATA_SIZE = 16777216; // 2 ** 24
export const MAX_ACCESS_LIST_SIZE = 16777216; // 2 ** 24
export const MAX_VERSIONED_HASHES_LIST_SIZE = 16777216; // 2 ** 24
export const LIMIT_BLOBS_PER_TX = 16777216; // 2 ** 24
export const MAX_TX_WRAP_KZG_COMMITMENTS = 16777216; // 2 ** 24
export const FIELD_ELEMENTS_PER_BLOB = 4096; // This is also in the Common 4844 parameters but needed here since types can't access Common params
export const BYTES_PER_FIELD_ELEMENT = 32;
