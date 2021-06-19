export type PrefixedHexString = string;
export type NumberString = string;
export type ValidTypes = number | PrefixedHexString | NumberString | BigInt;

export enum ValidTypesEnum {
    Number = 'Number',
    PrefixedHexString = 'PrefixedHexString',
    NumberString = 'NumberString',
    BigInt = 'BigInt',
}
