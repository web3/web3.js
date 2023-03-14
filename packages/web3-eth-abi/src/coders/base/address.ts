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
import { AbiParameter, Address } from "web3-types";
import { hexToBytes, isAddress } from "web3-utils";
import { AbiCoderError, AbiCoderErrors } from "../../errors";
import { CoderResultStatic } from "../types";
import { alloc, WORD_SIZE } from "../utils";

export function encodeAddress(param: AbiParameter, input: Address): CoderResultStatic {
    let address = input.toLowerCase()
    if(!address.startsWith("0x")) {
        address = `0x${address}`
    }
    if(!isAddress(address)) {
        throw new AbiCoderError("provided input is not valid address", AbiCoderErrors.INVALID_ARGUMENT, {
            value: input,
            name: param.name,
            type: param.type
        })
    }
    // for better performance, we could convert hex to destination bytes directly
    
    const addressBytes = hexToBytes(address)
    // expand address to WORD_SIZE
    const encoded = alloc(WORD_SIZE);
    encoded.set(addressBytes, WORD_SIZE - addressBytes.length)
    return {
        dynamic: false,
        encoded
    }
}