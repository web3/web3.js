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
import { getEncodedEip712Data } from 'web3-eth-abi';
import { ecrecover, toUint8Array } from 'web3-eth-accounts';
import { bytesToHex, hexToNumber, keccak256 } from 'web3-utils';

import Web3Eth from '../../../src';
import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestBackend,
	getSystemTestProvider,
	itIf,
} from '../../fixtures/system_test_utils';

describe('Web3Eth.signTypedData', () => {
	let web3Eth: Web3Eth;
	let tempAcc: { address: string; privateKey: string };

	beforeAll(async () => {
		web3Eth = new Web3Eth(getSystemTestProvider());
		tempAcc = await createTempAccount();
	});

	afterAll(async () => {
		await closeOpenConnection(web3Eth);
	});

	itIf(getSystemTestBackend() === 'ganache')(
		'should sign the typed data, return the signature, and recover the correct ETH address',
		async () => {
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
			const encodedTypedDataHash = getEncodedEip712Data(typedData, true);
			const signature = await web3Eth.signTypedData(tempAcc.address, typedData);
			const r = toUint8Array(signature.slice(0, 66));
			const s = toUint8Array(`0x${signature.slice(66, 130)}`);
			const v = BigInt(hexToNumber(`0x${signature.slice(130, 132)}`));
			const recoveredPublicKey = bytesToHex(
				ecrecover(toUint8Array(encodedTypedDataHash), v, r, s),
			);

			const recoveredAddress = `0x${keccak256(bytesToHex(recoveredPublicKey)).slice(-40)}`;
			// eslint-disable-next-line jest/no-standalone-expect
			expect(recoveredAddress).toBe(tempAcc.address);
		},
	);
});
