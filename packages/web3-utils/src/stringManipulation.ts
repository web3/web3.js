import { numberToHex, toHex, toNumber } from "./converters"
import { Numbers } from './types';
import { isHexStrict } from './validation';

/**
 * Adds a padding on the left of a string, if value is a integer or bigInt will be converted to a hex string.
 */

export const padLeft = (value: Numbers | string, characterAmount: number, sign = "0"): string => {
   if (typeof value === 'string' && !isHexStrict(value)) {
       return value.padStart(characterAmount, sign);
   }
   

    const hex = typeof value === 'string' && isHexStrict(value) ? value : numberToHex(value);
    
    const [prefix, hexValue] = hex.startsWith('-') ? ["-0x", hex.substr(3)] : ["0x", hex.substr(2)];

    return prefix.concat(hexValue.padStart(characterAmount, sign));
}


/**
 * Adds a padding on the right of a string, if value is a integer or bigInt will be converted to a hex string.
 */
export const padRight = (value: Numbers, characterAmount: number, sign = "0"): string => {
    if (typeof value === 'string' && !isHexStrict(value)) {
        return value.padEnd(characterAmount, sign);
    }
    const hexString = typeof value === 'string' && isHexStrict(value) ? value : numberToHex(value);

    const prefixLength = hexString.startsWith('-') ? 3 : 2;
    return hexString.padEnd(characterAmount+ prefixLength, sign);
}

export const rightPad = padRight;

export const leftPad = padLeft;

/**
 * Converts a negative number into the two’s complement.
 */
export const toTwosComplement = (value: Numbers ): string => {

    const val = toNumber(value); 

    if (val >= 0) return padLeft(toHex(val),64);

    const v = BigInt(val);
    return padLeft(numberToHex(v+BigInt(2**256+1)),64);
}