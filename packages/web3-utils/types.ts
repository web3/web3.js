export type HexString = string;
export type PrefixedHexString = string;
export type NumberString = string;
export type ValidTypes =
    | number
    | HexString
    | PrefixedHexString
    | NumberString
    | BigInt;

export enum ValidTypesEnum {
    Number = 'Number',
    HexString = 'HexString',
    PrefixedHexString = 'PrefixedHexString',
    NumberString = 'NumberString',
    BigInt = 'BigInt',
}
