import { toHex } from "converters"


/**
 * Adds a padding on the left of a string, Useful for adding paddings to HEX strings.
 * @param value 
 * @param characterAmount 
 * @param sign 
 * @returns 
 */

export const padLeft = (value: string | number, characterAmount: number, sign: string = "0"): string => {
    // const prefixed = typeof value === 'number' || hasPrefix(value)  ? "0x" : "";
    const hexString = toHex(value);

    //if number convert to hexstring
    if (typeof value === 'number') value = value.toString(16);
    value = value.replace(/^0x/i,'');

    const padding = (characterAmount + 2 - hexString.length + 1 >= 0) ? characterAmount + 2 - hexString.length + 1 : 0; //account for 0x, add 2

    return "0x".concat(sign.repeat(padding), value.replace(/^0x/i,''));
}

//add this function to validation later
const hasPrefix = (value: string): boolean => {
    return /^0x/i.test(value);
} 

/**
 * 1.x function if number will convert to hex.
 * Adds a padding on the right of a string, Useful for adding paddings to HEX strings.
 * @param value 
 * @param characterAmount 
 * @param sign 
 * @returns 
 */
export const padRight = (value: string | number, characterAmount: number, sign: string = "0"): string => {
    // const prefixed = typeof value === 'number' || hasPrefix(value)  ? "0x" 
    const hexString = toHex(value); 
    //if number convert to string
    // if (typeof value === 'number') value = value.toString(16);
    // value = value.replace(/^0x/i,'')

    const padding = (characterAmount + 2 - hexString.length + 1 >= 0) ? characterAmount + 2 - hexString.length + 1 : 0; //account for 0x, add 2

    return hexString?.concat(value, sign.repeat(padding))
}

export const rightPad = padRight;

export const leftPad = padLeft;

export const toTwosComplement = (value: number | string | bigint ):string => {
    const val = BigInt(value); //check if its greater than 0
    if (val >= 0) return toHex(value);

    //negative case: get compliment

    return padLeft(toHex(val+BigInt(2**256+1)),64);
}

