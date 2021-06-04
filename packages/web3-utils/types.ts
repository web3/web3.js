export type HexString = string;

export type NumberString = string;

export type ValidTypes = number | HexString | NumberString | BigInt;

export enum ValidTypesEnum {
    Number = 'Number',
    HexString = 'HexString',
    NumberString = 'NumberString',
    BigInt = 'BigInt',
}
