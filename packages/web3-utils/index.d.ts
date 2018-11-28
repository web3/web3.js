import BigNumber from "bn.js";

export type Unit =
    | "noether"
    | "wei"
    | "kwei"
    | "Kwei"
    | "babbage"
    | "femtoether"
    | "mwei"
    | "Mwei"
    | "lovelace"
    | "picoether"
    | "gwei"
    | "Gwei"
    | "shannon"
    | "nanoether"
    | "nano"
    | "szabo"
    | "microether"
    | "micro"
    | "finney"
    | "milliether"
    | "milli"
    | "ether"
    | "kether"
    | "grand"
    | "mether"
    | "gether"
    | "tether";

export type Mixed =
    | string
    | number
    | BigNumber
    | {
        type: string;
        value: string;
    }
    | {
        t: string;
        v: string;
    };

export type Hex = string | number;

export declare class BN extends BigNumber {
    constructor(
        number: number | string | number[] | Buffer | BN,
        base?: number | 'hex',
        endian?: 'le' | 'be'
    )
    super(number, base, endian);
 }

// utils types
export declare function isBN(value: string | number): boolean;
export declare function isBigNumber(value: BigNumber): boolean;
export declare function toBN(number: number | string): BigNumber;
export declare function toTwosComplement(number: number | string | BigNumber): string;
export declare function isAddress(address: string): boolean;
export declare function isHex(hex: Hex): boolean;
export declare function isHexStrict(hex: Hex): boolean;
export declare function asciiToHex(string: string): string;
export declare function hexToAscii(string: string): string;
export declare function toAscii(string: string): string;
export declare function bytesToHex(bytes: number[]): string;
export declare function numberToHex(value: number | string | BigNumber): string;
export declare function checkAddressChecksum(address: string): boolean;
export declare function fromAscii(string: string): string;
export declare function fromDecimal(value: string | number | BigNumber): string;
export declare function fromUtf8(string: string): string;
export declare function fromWei(value: BigNumber, unit?: Unit): BigNumber | string;
export declare function hexToBytes(hex: Hex): number[];
export declare function hexToNumber(hex: Hex): number;
export declare function hexToNumberString(hex: Hex): string;
export declare function hexToString(hex: Hex): string;
export declare function hexToUtf8(string: string): string;
export declare function keccak256(string: string): string;
export declare function padLeft(string: string, characterAmount: number, sign?: string): string;
export declare function leftPad(string: string, characterAmount: number, sign?: string): string;
export declare function rightPad(string: string, characterAmount: number, sign?: string): string;
export declare function padRight(string: string, characterAmount: number, sign?: string): string;
export declare function sha3(value: Mixed): string;
export declare function randomHex(bytesSize: number): string;
export declare function utf8ToHex(string: string): string;
export declare function stringToHex(string: string): string;
export declare function toChecksumAddress(address: string): string;
export declare function toDecimal(hex: Hex): number;
export declare function toHex(value: Mixed): string;
export declare function toUtf8(string: string): string;
export declare function toWei(value: number | string | BigNumber, unit?: Unit): BigNumber | string;
export declare function isBloom(bloom: string): boolean;
export declare function isTopic(topic: string): boolean;
export declare function _fireError(error: Object, emitter: Object, reject: Function, callback: Function): Object;
export declare function _jsonInterfaceMethodToString(json: Object): string;
export declare function _flattenTypes(includeTuple: boolean, puts: Object): string[];
export declare function soliditySha3(...val: Mixed[]): string;
export declare function getUnitValue(unit: string): string;
export declare function unitMap(): IUnits;

// bloom types
export declare function testAddress(bloom: string, address: string): boolean;
export declare function testTopic(bloom: string, topic: string): boolean;

export interface IUnits {
    noether: string;
    wei: string;
    kwei: string;
    Kwei: string;
    babbage: string;
    femtoether: string;
    mwei: string;
    Mwei: string;
    lovelace: string;
    picoether: string;
    gwei: string;
    Gwei: string;
    shannon: string;
    nanoether: string;
    nano: string;
    szabo: string;
    microether: string;
    micro: string;
    finney: string;
    milliether: string;
    milli: string;
    ether: string;
    kether: string;
    grand: string;
    mether: string;
    gether: string;
    tether: string;
}
