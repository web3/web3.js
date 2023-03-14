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
import { AbiParameter } from "web3-types";
import { AbiCoderError, AbiCoderErrors } from "../../errors";
import { CoderResultStatic, CoderResultDynamic } from "../types";

export function encodeTuple(param: AbiParameter, input: unknown): CoderResultStatic | CoderResultDynamic {
    const dynamic = false;
    if(!param.components || param.components?.length === 0) {
        throw new AbiCoderError("invalid abi schema, tuple missing components", AbiCoderErrors.INVALID_ABI, {
            param,
            input,
        })
    }
    if(!Array.isArray(input) || typeof input !== "object") {
        throw new AbiCoderError("param must be either Array or Object", AbiCoderErrors.INVALID_ARGUMENT, {
            param,
            input,
        })
    }
    for(let i = 0; i < param.components.length; i++) {
        const paramComponent = param.components[i]
        const index = Array.isArray(input) ? i : paramComponent.name
        const result = encodeParam(paramComponent, input[index])
    }
    
}