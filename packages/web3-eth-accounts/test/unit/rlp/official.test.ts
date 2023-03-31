/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { RLP } from '../../../src';
import { bytesToHex, hexToBytes } from '../../../src/rlp/utils';

import * as official from '../../fixtures/rlptest.json';
import { numberToBytes } from '../../fixtures/utils';

describe('official tests', () => {
	it.each(Object.entries(official.tests).map(([name, data]) => ({ name, data })))(
		`should pass %s`,
		({ data }) => {
			let incoming: any = data.in;
			// if we are testing a big number
			if (incoming[0] === '#') {
				incoming = numberToBytes(BigInt(incoming.slice(1))); // eslint-disable-line
			}

			const encoded = RLP.encode(incoming);

			const out =
				data.out.startsWith('0') && data.out[1] === 'x' ? data.out.slice(2) : data.out;
			expect(encoded).toEqual(hexToBytes(out));
		},
	);
});

// The tests below are taken from Geth
// https://github.com/ethereum/go-ethereum/blob/99be62a9b16fd7b3d1e2e17f1e571d3bef34f122/rlp/decode_test.go

const gethCases = [
	{ input: '05', value: '05' },
	{ input: '80', value: '' },
	{ input: '01', value: '01' },
	{ input: '820505', value: '0505' },
	{ input: '83050505', value: '050505' },
	{ input: '8405050505', value: '05050505' },
	{ input: '850505050505', value: '0505050505' },
	{ input: 'C0', value: [] },
	{ input: '00', value: '00' },
	{ input: '820004', value: '0004' },
	{ input: 'C80102030405060708', value: ['01', '02', '03', '04', '05', '06', '07', '08'] },
	{ input: 'C50102030405', value: ['01', '02', '03', '04', '05'] },
	{ input: 'C102', value: ['02'] },
	{ input: '8D6162636465666768696A6B6C6D', value: '6162636465666768696a6b6c6d' },
	{ input: '86010203040506', value: '010203040506' },
	{ input: '89FFFFFFFFFFFFFFFFFF', value: 'ffffffffffffffffff' },
	{
		input: 'B848FFFFFFFFFFFFFFFFF800000000000000001BFFFFFFFFFFFFFFFFC8000000000000000045FFFFFFFFFFFFFFFFC800000000000000001BFFFFFFFFFFFFFFFFF8000000000000000001',
		value: 'fffffffffffffffff800000000000000001bffffffffffffffffc8000000000000000045ffffffffffffffffc800000000000000001bfffffffffffffffff8000000000000000001',
	},
	{ input: '10', value: '10' },
	{ input: '820001', value: '0001' },
	{
		input: 'C50583343434',
		value: ['05', '343434'],
	},
	{
		input: 'C601C402C203C0',
		value: ['01', ['02', ['03', []]]],
	},
	{
		input: 'C58083343434',
		value: ['', '343434'],
	},

	{
		input: 'C105',
		value: ['05'],
	},
	{
		input: 'C7C50583343434C0',
		value: [['05', '343434'], []],
	},
	{
		input: '83222222',
		value: '222222',
	},
	{
		input: 'C3010101',
		value: ['01', '01', '01'],
	},
	{
		input: 'C501C3C00000',
		value: ['01', [[], '00', '00']],
	},
	{
		input: 'C103',
		value: ['03'],
	},
	{
		input: 'C50102C20102',
		value: ['01', '02', ['01', '02']],
	},
	{
		input: 'C3010203',
		value: ['01', '02', '03'],
	},
	{
		input: 'C20102',
		value: ['01', '02'],
	},
	{
		input: 'C101',
		value: ['01'],
	},
	{
		input: 'C180',
		value: [''],
	},
	{
		input: 'C1C0',
		value: [[]],
	},
	{
		input: 'C103',
		value: ['03'],
	},

	{
		input: 'C2C103',
		value: [['03']],
	},
	{
		input: 'C20102',
		value: ['01', '02'],
	},
	{
		input: 'C3010203',
		value: ['01', '02', '03'],
	},
	{
		input: 'C401020304',
		value: ['01', '02', '03', '04'],
	},
	{
		input: 'C20180',
		value: ['01', ''],
	},
	{
		input: 'C50183010203',
		value: ['01', '010203'],
	},
	{ input: '82FFFF', value: 'ffff' },
	{ input: '07', value: '07' },
	{ input: '8180', value: '80' },
	{ input: 'C109', value: ['09'] },
	{ input: 'C58403030303', value: ['03030303'] },

	{ input: 'C3808005', value: ['', '', '05'] },
	{ input: 'C50183040404', value: ['01', '040404'] },
];

function arrToStringArr(arr: any): any {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	return arr.map((a: any) => {
		if (Array.isArray(a)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return arrToStringArr(a);
		}
		return bytesToHex(a);
	});
}

describe('geth tests', () => {
	it.each(gethCases)('should pass Geth test', gethCase => {
		const input = hexToBytes(gethCase.input);
		expect(() => {
			const output = RLP.decode(input);
			expect(
				Array.isArray(output)
					? JSON.stringify(arrToStringArr(output))
					: bytesToHex(Uint8Array.from(output as any)),
			).toEqual(Array.isArray(output) ? JSON.stringify(gethCase.value) : gethCase.value);
		}).not.toThrow();
	});
});
