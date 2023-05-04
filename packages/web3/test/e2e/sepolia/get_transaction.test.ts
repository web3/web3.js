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
import { Bytes, TransactionInfo } from 'web3-types';
import { bytesToUint8Array, hexToBytes } from 'web3-utils';

import Web3 from '../../../src';
import { getSystemE2ETestProvider } from '../e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';

describe(`${getSystemTestBackend()} tests - getTransaction`, () => {
	const provider = getSystemE2ETestProvider();

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it.each(
		toAllVariants<{
			transactionHash: Bytes;
		}>({
			transactionHash: [
				'0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
				bytesToUint8Array(
					hexToBytes(
						'0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
					),
				),
				new Uint8Array(
					hexToBytes(
						'0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
					),
				),
			],
		}),
	)('getTransaction', async ({ transactionHash }) => {
		const result = await web3.eth.getTransaction(transactionHash);

		expect(result).toMatchObject<TransactionInfo>({
			hash: '0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
			nonce: BigInt('0x0'),
			blockHash: '0xdb1cb1fc3867fa28e4ba2297fbb1e65b81a3212beb1b73cbcbfe40c4192ee948',
			blockNumber: BigInt('0x314675'),
			transactionIndex: BigInt('0x8'),
			from: '0xa127c5e6a7e3600ac34a9a9928e52521677e7211',
			gasPrice: BigInt('0x9502f908'),
			maxPriorityFeePerGas: BigInt('0x9502f900'),
			maxFeePerGas: BigInt('0x9502f910'),
			gas: BigInt('0x54eca'),
			input: '0x608060405234801561001057600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f342827c97908e5e2f71151c08502a66d44b6f758e3ac2f1de95f02eb95f0a73560405160405180910390a36104dc806100de6000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80632e64cec1146100515780636057361d1461006f578063893d20e81461008b578063a6f9dae1146100a9575b600080fd5b6100596100c5565b60405161006691906102fb565b60405180910390f35b61008960048036038101906100849190610347565b6100ce565b005b610093610168565b6040516100a091906103b5565b60405180910390f35b6100c360048036038101906100be91906103fc565b610192565b005b60008054905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461015e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161015590610486565b60405180910390fd5b8060008190555050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610222576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161021990610486565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f342827c97908e5e2f71151c08502a66d44b6f758e3ac2f1de95f02eb95f0a73560405160405180910390a380600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000819050919050565b6102f5816102e2565b82525050565b600060208201905061031060008301846102ec565b92915050565b600080fd5b610324816102e2565b811461032f57600080fd5b50565b6000813590506103418161031b565b92915050565b60006020828403121561035d5761035c610316565b5b600061036b84828501610332565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061039f82610374565b9050919050565b6103af81610394565b82525050565b60006020820190506103ca60008301846103a6565b92915050565b6103d981610394565b81146103e457600080fd5b50565b6000813590506103f6816103d0565b92915050565b60006020828403121561041257610411610316565b5b6000610420848285016103e7565b91505092915050565b600082825260208201905092915050565b7f43616c6c6572206973206e6f74206f776e657200000000000000000000000000600082015250565b6000610470601383610429565b915061047b8261043a565b602082019050919050565b6000602082019050818103600083015261049f81610463565b905091905056fea26469706673582212201fcfa803d5c15c78e1e356cc1946c1bf14f9809acd349df1fd41362fa1a9e4d564736f6c63430008120033',
			chainId: BigInt('0xaa36a7'),
			type: BigInt('0x2'),
			v: BigInt('0x0'),
			s: '0x58f3924a7c468ab3df1a46ecef93910b4c05a13c3c3a9f4bf87b11f912b2748a',
			r: '0x7fcc0285117b5613d0766b0bcd6cab69538bc0991b2bc4ddebbcc3cb5b4d8fb0',
			// TODO These values are included when fetching the transaction from
			// Nethermind, but not Infura
			// to: null,
			// value: '0x0',
			// yParity: '0x0'
		});
	});
});
