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
import { InvalidBooleanError } from "web3-errors";
import { AbiParameter } from "web3-types";
import { toBool } from "web3-utils";
import { AbiCoderError, AbiCoderErrors } from "../../errors";
import { CoderResultStatic } from "../types";
import { encodeNumber } from "./number";

export function encodeBoolean(param: AbiParameter, input: boolean | string | number): CoderResultStatic {
    let value;
    try {
        value = toBool(input);
    } catch (e) {
        if (e instanceof InvalidBooleanError) {
            throw new AbiCoderError("provided input is not valid boolean value", AbiCoderErrors.INVALID_ARGUMENT, {
                type: param.type,
                value: input,
                name: param.name
            })
        }
    }

    return encodeNumber({ type: "uint8", name: "" }, Number(value))
}