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
import { AbiParameter, Bytes } from "web3-types";
import { bytesToBuffer } from "web3-utils";
import { isBytes } from "web3-validator";
import { AbiCoderError, AbiCoderErrors } from "../../errors";
import { CoderResultDynamic, CoderResultStatic } from "../types";
import { alloc, WORD_SIZE } from "../utils";
import { encodeNumber } from "./number";

export function encodeBytes(param: AbiParameter, input: Bytes): CoderResultDynamic|CoderResultStatic {
    if(!isBytes(input)) {
        throw new AbiCoderError("provided input is not valid bytes value", AbiCoderErrors.INVALID_ARGUMENT, {
            type: param.type,
            value: input,
            name: param.name
        })
    }
    const bytes = bytesToBuffer(input);
    const [, size] = param.type.split('bytes')
    // fixed size
    if(size) {
        if(Number(size) !== bytes.length) {
            throw new AbiCoderError("provided input size is different than type size", AbiCoderErrors.INVALID_ARGUMENT, {
                type: param.type,
                value: input,
                name: param.name
            })
        }
        const encoded = alloc(WORD_SIZE)
        encoded.set(bytes)
        return {
            dynamic: false,
            encoded
        }
    } 
    
    const partsLength = Math.ceil(bytes.length / WORD_SIZE)
    // one word for length of data + WORD for each part of actual data
    const encoded = alloc(WORD_SIZE + partsLength * WORD_SIZE)

    encoded.set(encodeNumber({type: "uint32", name: ""}, bytes.length).encoded)
    let offset = WORD_SIZE
    for(let i = 0; i < partsLength; i+=1) {
        encoded.set(bytes.subarray(i* WORD_SIZE, (i+1)*WORD_SIZE), offset)
        offset += WORD_SIZE
    }
    return {
        dynamic: true,
        size: bytes.length,
        encoded
    }
}