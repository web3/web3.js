/* eslint-disable @typescript-eslint/no-magic-numbers */

import { HexString, Numbers } from "../../src/types";


export const padLeftData: [[Numbers, number, string], HexString][] = [
    [[0, 10, '0'], '0x0000000000'],
    [['0x01', 64, 'f'], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01'],
    [['abcd', 8, '0'],'0000abcd'],
    [[BigInt(14),8,'0'],'000'],
    [[-1, 10, '0'], '0x0000000000'],
    [['-0x01', 64, 'f'], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01'],
    [['-abcd', 8, '0'],'000-abcd'],
    [[BigInt(-14),8,'0'],'000']
]

export const padRightData: [[Numbers, number, string], HexString][] = [
    [[1, 5, '0'], '0x10000'],
    [['0x00', 5, 'f'], '0x00fff'],
    [['zxy', 8, '0'],'zxy0000000000000000000000000000000000000000000000000000000000000'],
    [[BigInt(10000),8,'0'],'10000000'],
    [[-1, 4, '0'], '-0x1000'],
    [['-0x01', 64, 'f'], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01'],
    [['-abcd', 8, '0'],'0000abcd'],
    [[BigInt(-14),8,'0'],'000']
]

export const toTwosComplementData: [Numbers, HexString][] = [
    [256, '0x0000000000000000000000000000000000000000000000000000000000000100'],
    [-256,'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00'],
    ['0x1','0x0000000000000000000000000000000000000000000000000000000000000001'],
    ['-0x1', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
    [BigInt('9007199254740992'), '0x0000000000000000000000000000000000000000000000000020000000000000'],
    [BigInt('-9007199254740992'),'0xffffffffffffffffffffffffffffffffffffffffffffffffffe0000000000000'],
    ['0x0f', '0x000000000000000000000000000000000000000000000000000000000000000f'],
    ['13', '0x000000000000000000000000000000000000000000000000000000000000000d'],
    ['-13', '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff3']
]

