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

import { AbiParameter, Numbers } from "web3-types";

export const validNumberCoderData: [AbiParameter, Numbers, string][] = [
    [{type: "uint8", name: ""}, 1, "0000000000000000000000000000000000000000000000000000000000000001"],
    [{type: "uint8", name: ""}, "8", "0000000000000000000000000000000000000000000000000000000000000008"],
    [{type: "int8", name: ""}, -1, "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"],
    [{type: "int8", name: ""}, -122, "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86"],
    [{type: "int8", name: ""}, -128, "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80"],
    [{type: "int8", name: ""}, "-122", "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86"],
    [{type: "int", name: ""}, -122, "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86"],
    [{type: "int", name: ""}, BigInt(122), "000000000000000000000000000000000000000000000000000000000000007a"],
    [{type: "int32", name: ""}, BigInt(-122), "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86"],
    [{type: "int32", name: ""}, "-0xa2", "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5e"]
]

export const invalidNumberCoderData: [AbiParameter, Numbers][] = [
    [{type: "uint8", name: ""}, "blem"],
    [{type: "uint8", name: ""}, "--123"],
    [{type: "uint8", name: ""}, "256"],
    [{type: "int8", name: ""}, "128"],
    [{type: "int8", name: ""}, "-129"],
]
