/* eslint-disable @typescript-eslint/no-magic-numbers */

import { HexString, Numbers } from "../../src/types";


export const padLeftData: [[Numbers, number, string], HexString][] = [
    [[0, 10, '0'], '0x0000000000'],
    [['0x01', 64, 'f'], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01'],
    [['-0x01', 64, 'f'], '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01'],
    [['5', 32, '0'], '00000000000000000000000000000005'],
    [['-05', 32, 'f'],'fffffffffffffffffffffffffffff-05'],
    [['abcd', 8, '0'],'0000abcd'],
    [['-abcd', 8, '0'],'000-abcd'],
    [[BigInt('9007199254740992'),32,'0'],'0x00000000000000000020000000000000'],
    [[BigInt('-9007199254740992'),32,'0'],'-0x00000000000000000020000000000000'],
    [[9007199254740992n,32,'0'],'0x00000000000000000020000000000000'],
    [[-9007199254740992n,32,'0'],'-0x00000000000000000020000000000000'],
    [[-13, 10, '0'],'-0x000000000d'],
    [['9.5', 8, '0'],'000009.5']
]

export const padLeftInvalidData: [[any, number, string], HexString][] = [
    [[9.5, 64, 'f'], 'Invalid value given "9.5". Error: not a valid integer.'],
    [[null, 8, '0'],'Invalid value given "null". Error: not a valid integer.'],
    [[undefined,8,'0'], 'Invalid value given "undefined". Error: not a valid integer.'],
    [[{},3, 'f'], 'Invalid value given "[object Object]". Error: not a valid integer.'],
]

export const padRightData: [[Numbers, number, string], HexString][] = [
    [[1, 5, '0'], '0x10000'],
    [[-2000, 128, '0'], '-0x7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'],
    [['0x00', 5, 'f'], '0x00fff'],
    [['-0x01', 64, 'f'], '-0x01ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
    [['zxy', 11, '0'],'zxy00000000'],
    [['-abcd', 32, '1'],'-abcd111111111111111111111111111'],
    [[10000n,8,'0'],'0x27100000'],
    [[BigInt(10000),8,'0'],'0x27100000'],
    [[BigInt(-14),8,'0'],'-0xe0000000'],
    [[-14n,8,'0'],'-0xe0000000'],
    [['15.5', 8, '0'],'15.50000']
]

export const padRightInvalidData: [[any, number, string], HexString][] = [
    [[15.5, 64, 'f'], 'Invalid value given "15.5". Error: not a valid integer.'],
    [[null, 8, '0'],'Invalid value given "null". Error: not a valid integer.'],
    [[undefined,8,'0'], 'Invalid value given "undefined". Error: not a valid integer.'],
    [[{},3, 'f'], 'Invalid value given "[object Object]". Error: not a valid integer.'],
]

export const toTwosComplementData: [Numbers, HexString][] = [
    [256, '0x0000000000000000000000000000000000000000000000000000000000000100'],
    [-256,'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00'],
    [0, '0x0000000000000000000000000000000000000000000000000000000000000000'],
    ['0x1','0x0000000000000000000000000000000000000000000000000000000000000001'],
    ['-0x1', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
    [BigInt('9007199254740992'), '0x0000000000000000000000000000000000000000000000000020000000000000'],
    [BigInt('-9007199254740992'),'0xffffffffffffffffffffffffffffffffffffffffffffffffffe0000000000000'],
    [9007199254740992n, '0x0000000000000000000000000000000000000000000000000020000000000000'],
    [-9007199254740992n, '0xffffffffffffffffffffffffffffffffffffffffffffffffffe0000000000000'],
    ['13', '0x000000000000000000000000000000000000000000000000000000000000000d'],
    ['-13', '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff3']
]

export const toTwosComplementInvalidData: [Numbers, HexString][] = [
    ['ab', 'Invalid value given "ab". Error: not a valid integer.'],
    ['-ab', 'Invalid value given "-ab". Error: not a valid integer.'],
    ['ab0x', 'Invalid value given "ab0x". Error: not a valid integer.'],
    [25.5, 'Invalid value given "25.5". Error: not a valid integer.'],
    ["-120.0", 'Invalid value given "-120.0". Error: not a valid integer.']
]
