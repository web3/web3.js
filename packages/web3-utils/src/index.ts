import { RpcResponseResult } from 'web3-providers-base/types';
import { setLengthLeft, toBuffer } from 'ethereumjs-util';

import { ValidTypes, ValidTypesEnum, HexString } from '../types';

function padHex(hexString: HexString, byteLength: number): HexString {
    const bufferInput = toBuffer(hexString);
    const paddedBufferInput = setLengthLeft(bufferInput, byteLength);
    return `0x${paddedBufferInput.toString('hex')}`;
}

export function toHex(input: ValidTypes, byteLength?: number): HexString {
    let hexInput;
    switch (typeof input) {
        case 'number':
            if (input < 0)
                throw Error(`Cannot convert number less than 0: ${input}`);
            if (input % 1 !== 0) throw Error(`Cannot convert float: ${input}`);
            hexInput = `0x${input.toString(16)}`;
            break;
        case 'string':
            if (/^[1-9]+$/i.test(input)) {
                // Input is a number string

                const parsedHexString = BigInt(input).toString(16);
                if (parsedHexString.substr(0, 1) === '-')
                    throw Error(`Cannot convert number less than 0: ${input}`);

                hexInput = `0x${parsedHexString}`;
            } else if (/^(?:0x)?[0-9A-Fa-f]+$/i.test(input)) {
                // Input is a hex string, possibly prefixed with 0x
                hexInput = input.substr(0, 2) === '0x' ? input : `0x${input}`;
            } else {
                if (input.substr(0, 1) === '-')
                    throw Error(`Cannot convert number less than 0: ${input}`);
                if (input.includes('.'))
                    throw Error(`Cannot convert float: ${input}`);
                throw Error(`Cannot convert arbitrary string: ${input}`);
            }
            break;
        case 'bigint':
            const parsedHexString = BigInt(input).toString(16);
            if (parsedHexString.substr(0, 1) === '-')
                throw Error(`Cannot convert number less than 0: ${input}`);

            hexInput = `0x${parsedHexString}`;
            break;
        default:
            throw Error(
                `Provided input: ${input} is not a valid type (${Object.keys(
                    ValidTypesEnum
                ).map((validType) => `${validType} `)})`
            );
    }
    return byteLength && hexInput.length < byteLength
        ? padHex(hexInput, byteLength)
        : hexInput;
}

export function formatOutput(
    output: ValidTypes,
    desiredType: ValidTypesEnum
): ValidTypes {
    // Short circuit if output and desiredType are HexString
    if (
        desiredType === ValidTypesEnum.HexString &&
        typeof output === 'string' &&
        /^0x[0-9A-Fa-f]+$/i.test(output)
    ) {
        return output;
    }

    // Doing this allows us to assume we're always converting
    // from HexString to desiredType
    let formattedOutput: ValidTypes = toHex(output);

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
