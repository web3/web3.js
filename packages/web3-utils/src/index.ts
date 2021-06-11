import { RpcResponseResult } from 'web3-providers-base/types';
import { setLengthLeft, toBuffer } from 'ethereumjs-util';

import { ValidTypes, ValidTypesEnum, HexString } from '../types';

function determineValidType(input: ValidTypes): ValidTypesEnum {
    switch (typeof input) {
        case 'number':
            return ValidTypesEnum.Number;
        case 'string':
            if (/^[1-9]+$/i.test(input)) {
                // Input is number string
                return ValidTypesEnum.NumberString;
            } else if (/^(?:0x)?[0-9A-Fa-f]+$/i.test(input)) {
                // Input is a hex string, possibly prefixed with 0x
                return ValidTypesEnum.HexString;
            } else {
                if (input.substr(0, 1) === '-')
                    throw Error(`Cannot convert number less than 0: ${input}`);
                if (input.includes('.'))
                    throw Error(`Cannot convert float: ${input}`);
                throw Error(`Cannot convert arbitrary string: ${input}`);
            }
        case 'bigint':
            return ValidTypesEnum.BigInt;
        default:
            throw Error(
                `Provided input: ${input} is not a valid type (${Object.keys(
                    ValidTypesEnum
                ).map((validType) => `${validType} `)})`
            );
    }
}

function padHex(hexString: HexString, byteLength: number): HexString {
    const bufferInput = toBuffer(hexString);
    const paddedBufferInput = setLengthLeft(bufferInput, byteLength);
    return `0x${paddedBufferInput.toString('hex')}`;
}

export function toHex(input: ValidTypes, byteLength?: number): HexString {
    let hexInput: HexString;
    let parsedHexString: HexString;
    switch (determineValidType(input)) {
        case ValidTypesEnum.Number:
            if (input < 0)
                throw Error(`Cannot convert number less than 0: ${input}`);
            if ((input as number) % 1 !== 0)
                throw Error(`Cannot convert float: ${input}`);
            hexInput = `0x${input.toString(16)}`;
            break;
        case ValidTypesEnum.NumberString:
            parsedHexString = BigInt(input as string).toString(16);
            if (parsedHexString.substr(0, 1) === '-')
                throw Error(`Cannot convert number less than 0: ${input}`);

            hexInput = `0x${parsedHexString}`;
            break;
        case ValidTypesEnum.HexString:
            // @ts-ignore
            hexInput = input.substr(0, 2) === '0x' ? input : `0x${input}`;
            break;
        case ValidTypesEnum.BigInt:
            parsedHexString = input.toString(16);
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
