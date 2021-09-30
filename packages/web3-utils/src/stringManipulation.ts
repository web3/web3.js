import { stringify } from "querystring"


/**
 * Adds a padding on the left of a string, Useful for adding paddings to HEX strings.
 * @param value 
 * @param characterAmount 
 * @param sign 
 * @returns 
 */

export const padLeft = (value: string | number, characterAmount: number, sign: string = "0"): string => {
    const prefixed = hasPrefix(value) || typeof value === 'number' ? "0x" : "";

    //if number convert to string
    if (typeof value === 'number') value = value.toString(16);
    value = value.replace(/^0x/i,'')

    const padding = (characterAmount - value.length + 1 >= 0) ? characterAmount - value.length + 1 : 0;

    return prefixed.concat(sign.repeat(padding), value)
}

//add this function to validation later
const hasPrefix = (value: string | number): boolean => {
    return /0x/i.test(value);
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
    const prefixed = hasPrefix(value) || typeof value === 'number' ? "0x" : "";

    //if number convert to string
    if (typeof value === 'number') value = value.toString(16);
    value = value.replace(/^0x/i,'')

    const padding = (characterAmount - value.length + 1 >= 0) ? characterAmount - value.length + 1 : 0;

    return prefixed?.concat(value, sign.repeat(padding))
}

export const rightPad = padRight;

export const leftPad = padLeft;

export const toTwosComplement = (value: number | string | bigint ):string => {
    return '0x' ;
}
