import { RpcResponseResult } from 'web3-providers-base/types';
import {setLengthLeft, toBuffer} from 'ethereumjs-util'

import { ValidTypes, ValidTypesEnum, HexString } from '../types';

export function formatInput(input: ValidTypes, byteLength?: number): HexString {
    let formattedInput;
    switch (typeof input) {
        case 'number':
            formattedInput = `0x${input.toString(16)}`;
            break;
        case 'string':
            if (/^[1-9]+/i.test(input)) {
                // Number string
                formattedInput = `0x${BigInt(input).toString(16)}`;
            } else if (/(?:0x)?[0-9A-Fa-f]+/i.test(input)) {
                // Hex string, possibly prefixed with 0x
                formattedInput =
                    input.substr(0, 2) === '0x' ? input : `0x${input}`;
            } else {
                throw Error(`Cannot convert arbitrary string: ${input}`);
            }
            break;
        case 'bigint':
            formattedInput = `0x${BigInt(input).toString(16)}`;
            break;
        default:
            throw Error(
                `Provided input: ${input} is not a valid type (number, HexString, NumberString, or BigInt)`
            );
    }
    if (byteLength && formattedInput.length < byteLength) {
        const bufferInput = toBuffer(formattedInput)
        const paddedBufferInput = setLengthLeft(bufferInput, 32)
        formattedInput = `0x${paddedBufferInput.toString('hex')}`
    }
    return formattedInput;
}

export function formatOutput(
    output: ValidTypes,
    desiredType: ValidTypesEnum
): ValidTypes {
    // Short circuit if output and desiredType are HexString
    if (
        desiredType === ValidTypesEnum.HexString &&
        typeof output === 'string' &&
        /^0x[0-9A-Fa-f]+/i.test(output)
    ) {
        return output;
    }

    // Doing this allows us to assume we're always converting
    // from HexString to desiredType
    let formattedOutput: ValidTypes = formatInput(output);

    switch (desiredType) {
        case ValidTypesEnum.Number:
            formattedOutput = parseInt(formattedOutput, 16);
            break;
        case ValidTypesEnum.HexString:
            // formattedOutput is already converted to HexString
            break;
        case ValidTypesEnum.NumberString:
            formattedOutput = BigInt(formattedOutput).toString();
            break;
        case ValidTypesEnum.BigInt:
            formattedOutput = BigInt(formattedOutput);
            break;
        default:
            throw Error(
                `Error formatting output, provided desiredType: ${desiredType} is not supported`
            );
    }
    return formattedOutput;
}

export function formatRpcResultArray(
    rpcResponseResult: RpcResponseResult,
    formattableProperties: string[],
    desiredType: ValidTypesEnum
): RpcResponseResult {
    let formattedResponseResult = rpcResponseResult;
    for (const formattableProperty of formattableProperties) {
        if (Array.isArray(rpcResponseResult)) {
            // rpcResponseResult is an array of results
            // e.g. an array of filter changes or logs
            for (const result of rpcResponseResult) {
                result[formattableProperty] = formatOutput(
                    result[formattableProperty],
                    desiredType
                );
            }
        } else {
            formattedResponseResult[formattableProperty] = formatOutput(
                rpcResponseResult[formattableProperty],
                desiredType
            );
        }
    }
    return formattedResponseResult;
}
