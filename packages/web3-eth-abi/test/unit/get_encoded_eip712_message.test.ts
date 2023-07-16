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
import { getEncodedEip712Message } from '../../src/index';

describe('getEncodedEip712Message', () => {
	const typedData = {
		types: {
			EIP712Domain: [
				{
					name: 'name',
					type: 'string',
				},
				{
					name: 'version',
					type: 'string',
				},
				{
					name: 'chainId',
					type: 'uint256',
				},
				{
					name: 'verifyingContract',
					type: 'address',
				},
			],
			Person: [
				{
					name: 'name',
					type: 'string',
				},
				{
					name: 'wallet',
					type: 'address',
				},
			],
			Mail: [
				{
					name: 'from',
					type: 'Person',
				},
				{
					name: 'to',
					type: 'Person',
				},
				{
					name: 'contents',
					type: 'string',
				},
			],
		},
		primaryType: 'Mail',
		domain: {
			name: 'Ether Mail',
			version: '1',
			chainId: 1,
			verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
		},
		message: {
			from: {
				name: 'Cow',
				wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
			},
			to: {
				name: 'Bob',
				wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
			},
			contents: 'Hello, Bob!',
		},
	};

	it('should get encoded message without hashing, hash = undefined', () => {
		const expectedEncodedMessage =
			'0x1901f2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090fc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e';
		const encodedMessage = getEncodedEip712Message(typedData);

		expect(encodedMessage).toBe(expectedEncodedMessage);
	});

	it('should get encoded message without hashing, hash = false', () => {
		const expectedEncodedMessage =
			'0x1901f2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090fc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e';
		const encodedMessage = getEncodedEip712Message(typedData);

		expect(encodedMessage).toBe(expectedEncodedMessage);
	});

	it('should get the hashed encoded message, hash = true', () => {
		const expectedHashedMessage =
			'0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2';
		const encodedMessage = getEncodedEip712Message(typedData, true);

		expect(encodedMessage).toBe(expectedHashedMessage);
	});
});
