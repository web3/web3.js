import BigNumber from "bn.js";
import us from "underscore";

type Unit =
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

type Mixed =
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

type Hex = string | number;

export default interface Utils {
    BN: BigNumber;
    isBN(any: any): boolean;
    isBigNumber(any: any): boolean;
    toBN(number: number | string | BigNumber): BigNumber;
    toTwosComplement(number: number | string | BigNumber): string;
    isAddress(address: string): boolean;
    isHex(hex: Hex): boolean;
    isHexStrict(hex: Hex): boolean;
    _: us.UnderscoreStatic;
    asciiToHex(str: string): string;
    hexToAscii(val: string): string;
    bytesToHex(bytes: number[]): string;
    numberToHex(value: number | string | BigNumber): string;
    checkAddressChecksum(address: string): boolean;
    fromAscii(value: string): string;
    fromDecimal(value: string | number | BigNumber): string;
    fromUtf8(value: string): string;
    fromWei(value: BigNumber, unit?: Unit): BigNumber;
    fromWei(value: string | number, unit?: Unit): string;
    hexToBytes(hex: string): number[];
    hexToNumber(value: string | number | BigNumber): number;
    hexToNumberString(value: string | number | BigNumber): string;
    hexToString(value: string): string;
    hexToUtf8(hex: string): string;
    keccak256(value: string): string;
    leftPad(string: string, chars: number, sign: string): string;
    padLeft(string: string, chars: number, sign: string): string;
    rightPad(string: string, chars: number, sign: string): string;
    padRight(string: string, chars: number, sign: string): string;
    sha3(
        val: string,
        val2?: string,
        val3?: string,
        val4?: string,
        val5?: string
    ): string;
    randomHex(bytes: number): string;
    stringToHex(val: string): string;
    toAscii(hex: string): string;
    toChecksumAddress(address: string): string;
    toDecimal(val: any): number;
    toHex(value: any, returnType: boolean): string;
    toUtf8(val: any): string;
    toWei(val: string | number, unit?: Unit): string;
    toWei(val: BigNumber, unit?: Unit): BigNumber;
    unitMap: any;
    utf8ToHex(str: string): string;
    isBloom(bloom: string): boolean;
    isTopic(topic: string): boolean;
    _fireError(error: Object, emitter: Object, reject: Function, callback: Function): Object;
    _jsonInterfaceMethodToString(json: Object): string;
    _flattenTypes(includeTuple: boolean, puts: Object): string[];
    getUnitValue(unit: string): string;
    soliditySha3(...val: Mixed[]): string;

}

export default interface BloomFilter {
    testAddress(bloom: string, address: string): boolean;
    testTopic(bloom: string, topic: string): boolean;
}