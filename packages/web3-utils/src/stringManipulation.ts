import { numberToHex, toHex, toNumber } from "./converters"
import { Numbers } from './types';
import { isHexStrict } from './validation';

/**
 * Adds a padding on the left of a string, Useful for adding paddings to HEX strings.
 * @param value 
 * @param characterAmount 
 * @param sign 
 * @returns 
 */

export const padLeft = (value: Numbers, characterAmount: number, sign: string = "0"): string => {
   // needs string validation
    const hex = numberToHex(value);
    
    const [prefix, hexValue] = hex.startsWith('-') ? ["-0x", hex.substr(3)] : ["0x", hex.substr(2)];

    return prefix.concat(hexValue.padStart(characterAmount, sign));
}


/**
 * 1.x function if number will convert to hex.
 * Adds a padding on the right of a string, Useful for adding paddings to HEX strings.
 * @param value 
 * @param characterAmount 
 * @param sign 
 * @returns 
 */
export const padRight = (value: Numbers, characterAmount: number, sign: string = "0"): string => {
    // const prefixed = typeof value === 'number' || hasPrefix(value)  ? "0x" 
    const hexString = numberToHex(value); 

    const prefixLength = hexString.startsWith('-') ? 3 : 2;
    return hexString.padEnd(characterAmount+ prefixLength, sign);
}

export const rightPad = padRight;

export const leftPad = padLeft;

export const toTwosComplement = (value: Numbers ):string => {
    if (typeof value === 'string' && !isHexStrict(value)) throw new Error(`invalid value was given: {$value}`); 

    const val = toNumber(value); 
    if (val >= 0) return padLeft(toHex(value),64);

    //negative case: get compliment
    const v = BigInt(val);
    return padLeft(numberToHex(v+BigInt(2**256+1)),64);
}