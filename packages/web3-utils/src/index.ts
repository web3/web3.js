import { setLengthLeft, toBuffer } from 'ethereumjs-util';
import {
    ValidTypes,
    ValidTypesEnum,
    PrefixedHexString,
} from 'web3-core-types/lib/types';
import Web3CoreLogger from 'web3-core-logger';

import { Web3UtilsErrorsConfig, Web3UtilsErrorNames } from './errors';

const logger = new Web3CoreLogger(Web3UtilsErrorsConfig);

/**
 * Used to determine ValidTypesEnum value of {input}
 *
 * @param input Input to determine type of
 * @returns ValidTypesEnum value
 */
function determineValidType(input: ValidTypes): ValidTypesEnum {
    try {
        switch (typeof input) {
            case 'number':
                if (input < 0)
                    throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                        params: { input },
                        reason: 'Cannot convert number less than 0',
                    });
                if ((input as number) % 1 !== 0)
                    throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                        params: { input },
                        reason: 'Cannot convert decimals',
                    });
                return ValidTypesEnum.Number;
            case 'string':
                if (/^[0-9]+$/i.test(input)) {
                    return ValidTypesEnum.NumberString;
                } else if (/^0x[0-9A-Fa-f]+$/i.test(input)) {
                    return ValidTypesEnum.PrefixedHexString;
                } else {
                    if (input.substr(0, 1) === '-')
                        throw logger.makeError(
                            Web3UtilsErrorNames.invalidInput,
                            {
                                params: { input },
                                reason: 'Cannot convert number less than 0',
                            }
                        );
                    if (input.includes('.'))
                        throw logger.makeError(
                            Web3UtilsErrorNames.invalidInput,
                            {
                                params: { input },
                                reason: 'Cannot convert decimals',
                            }
                        );
                    throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                        params: { input },
                        reason: 'Cannot convert arbitrary string',
                    });
                }
            case 'bigint':
                if (input.toString(16).substr(0, 1) === '-')
                    throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                        params: { input },
                        reason: 'Cannot convert number less than 0',
                    });
                return ValidTypesEnum.BigInt;
            default:
                throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                    params: { input },
                    reason: `Provided input is not of valid types: ${Object.keys(
                        ValidTypesEnum
                    ).map((validType) => `${validType} `)})`,
                });
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Pads {hexString} to desired {byteLength}
 *
 * @param hexString Hex string to pad
 * @param byteLength Length to pad {hexString} to
 * @returns Padded hex string
 */
function padHex(
    hexString: PrefixedHexString,
    byteLength: number
): PrefixedHexString {
    try {
        const bufferInput = toBuffer(hexString);
        const paddedBufferInput = setLengthLeft(bufferInput, byteLength);
        return `0x${paddedBufferInput.toString('hex')}`;
    } catch (error) {
        throw error;
    }
}

/**
 * Convert value of ValidTypes to hex string
 *
 * @param input Input to convert to hex string
 * @param byteLength Desired byte length of return hex string, will be padded to comply
 * @returns Hex string
 */
export function toHex(
    input: ValidTypes,
    byteLength?: number
): PrefixedHexString {
    try {
        if (input === null)
            throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                params: { input },
                reason: 'Cannot convert null input',
            });

        let hexInput: PrefixedHexString;
        let parsedHexString: PrefixedHexString;
        switch (determineValidType(input)) {
            case ValidTypesEnum.Number:
                hexInput = `0x${input.toString(16)}`;
                break;
            case ValidTypesEnum.NumberString:
                parsedHexString = BigInt(input as string).toString(16);
                hexInput = `0x${parsedHexString}`;
                break;
            case ValidTypesEnum.PrefixedHexString:
                hexInput = input as string;
                break;
            case ValidTypesEnum.BigInt:
                parsedHexString = input.toString(16);
                hexInput = `0x${parsedHexString}`;
                break;
            default:
                throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                    params: { input },
                    reason: `Provided input is not of valid types: ${Object.keys(
                        ValidTypesEnum
                    ).map((validType) => `${validType} `)})`,
                });
        }
        return byteLength && hexInput.length < byteLength
            ? padHex(hexInput, byteLength)
            : hexInput;
    } catch (error) {
        throw error;
    }
}

/**
 * Formated {output} into {desiredType}
 *
 * @param output Data to format into {desiredType}
 * @param desiredType A ValidTypesEnum value
 * @returns Formatted {output}
 */
export function formatOutput(
    output: ValidTypes,
    desiredType: ValidTypesEnum
): ValidTypes {
    try {
        if (output === null || determineValidType(output) === desiredType)
            return output;

        // Doing this allows us to assume we're always converting
        // from PrefixedHexString to desiredType
        let formattedOutput: ValidTypes = toHex(output);

        switch (desiredType) {
            case ValidTypesEnum.Number:
                formattedOutput = parseInt(formattedOutput, 16);
                break;
            case ValidTypesEnum.PrefixedHexString:
                // formattedOutput has already been converted to PrefixedHexString
                break;
            case ValidTypesEnum.NumberString:
                formattedOutput = BigInt(formattedOutput).toString();
                break;
            case ValidTypesEnum.BigInt:
                formattedOutput = BigInt(formattedOutput);
                break;
            default:
                throw logger.makeError(Web3UtilsErrorNames.invalidInput, {
                    params: { desiredType },
                    reason: `Desired type is not of valid types: ${Object.keys(
                        ValidTypesEnum
                    ).map((validType) => `${validType} `)})`,
                });
        }
        return formattedOutput;
    } catch (error) {
        throw error;
    }
}

/**
 * Formated {outputObject} into {desiredType} (supports objects with nested objects)
 *
 * @param outputObject Data to format into {desiredType}
 * @param formattableProperties List of properties to format to {desiredType}, passing an object
 * within the array implies that the property is a nested object within {outputObject}
 * @param desiredType A ValidTypesEnum value
 * @returns Formatted {outputObject}
 */
export function formatOutputObject(
    outputObject: { [key: string]: any } | { [key: string]: any }[],
    formattableProperties: (string | { [key: string]: string[] })[],
    desiredType: ValidTypesEnum
): any {
    try {
        let formattedOutput;

        if (outputObject === null || Object.keys(outputObject).length === 0)
            return outputObject;

        if (Array.isArray(outputObject)) {
            formattedOutput = [...outputObject];
            outputObject.forEach(
                (output, index) =>
                    (formattedOutput[index] = formatOutputObject(
                        output,
                        formattableProperties,
                        desiredType
                    ))
            );
        } else {
            formattedOutput = { ...outputObject };
            for (const formattableProperty of formattableProperties) {
                if (
                    typeof formattableProperty === 'object' &&
                    formattableProperty !== null
                ) {
                    const outputObjectProperty =
                        Object.keys(formattableProperty)[0];
                    formattedOutput[outputObjectProperty] = formatOutputObject(
                        formattedOutput[outputObjectProperty],
                        formattableProperty[outputObjectProperty],
                        desiredType
                    );
                } else {
                    if (formattedOutput[formattableProperty] !== undefined) {
                        formattedOutput[formattableProperty] = formatOutput(
                            formattedOutput[formattableProperty],
                            desiredType
                        );
                    }
                }
            }
        }
        return formattedOutput;
    } catch (error) {
        throw error;
    }
}
