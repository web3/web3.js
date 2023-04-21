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
import Web3 from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
	itIf,
} from '../../shared_fixtures/system_tests_utils';
import { GreeterAbi, GreeterBytecode } from '../../shared_fixtures/build/Greeter';
import {
	getAllowedSendTransaction,
	getE2ETestAccountAddress,
	getE2ETestAccountPrivateKey,
	getSystemE2ETestProvider,
} from '../e2e_utils';

describe(`${getSystemTestBackend()} tests - contract`, () => {
	const provider = getSystemE2ETestProvider();
	const initialGreet = 'Soylent green is people';

	let web3: Web3;
	let deployedContractAddress: string;

	beforeAll(() => {
		if (getAllowedSendTransaction()) {
			web3 = new Web3(provider);
			web3.eth.accounts.wallet.add(getE2ETestAccountPrivateKey());
		}
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	itIf(getAllowedSendTransaction())('should deploy a contract', async () => {
		const contract = new web3.eth.Contract(GreeterAbi, undefined, {
			provider: getSystemE2ETestProvider(),
		}).deploy({
			data: GreeterBytecode,
			arguments: [initialGreet],
		});
		const signedTransaction = await web3.eth.accounts.signTransaction(
			{
				from: getE2ETestAccountAddress(),
				input: contract.encodeABI(),
				gas: await contract.estimateGas(),
			},
			getE2ETestAccountPrivateKey(),
		);
		const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
		deployedContractAddress = result.contractAddress as string;

		// TODO This should work, but throws a type error
		// for root not being included in expected object.
		// However, root is not apart of result object.
		// expect(result).toMatchObject<TransactionReceipt>({
		// eslint-disable-next-line jest/no-standalone-expect
		expect(result).toMatchObject({
			// root: expect.any(String),
			blockHash: expect.any(String),
			blockNumber: expect.any(BigInt),
			cumulativeGasUsed: expect.any(BigInt),
			effectiveGasPrice: expect.any(BigInt),
			from: getE2ETestAccountAddress().toLowerCase(),
			contractAddress: expect.any(String),
			gasUsed: expect.any(BigInt),
			logs: [],
			logsBloom:
				'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			status: BigInt(1),
			transactionHash: expect.any(String),
			transactionIndex: expect.any(BigInt),
			type: BigInt(2),
		});
	});

	itIf(getAllowedSendTransaction())('should call setGreeting on deployed contract', async () => {
		const expectedGreet = 'Where we’re going, we don’t need roads';
		const contract = new web3.eth.Contract(GreeterAbi, deployedContractAddress, {
			provider: getSystemE2ETestProvider(),
		});

		let greeting = await contract.methods.greet().call();
		// eslint-disable-next-line jest/no-standalone-expect
		expect(greeting).toBe(initialGreet);

		const signedTransaction = await web3.eth.accounts.signTransaction(
			{
				from: getE2ETestAccountAddress(),
				to: deployedContractAddress,
				input: contract.methods.setGreeting(expectedGreet).encodeABI(),
				gas: await contract.methods.setGreeting(expectedGreet).estimateGas(),
			},
			getE2ETestAccountPrivateKey(),
		);

		const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

		greeting = await contract.methods.greet().call();
		// eslint-disable-next-line jest/no-standalone-expect
		expect(greeting).toBe(expectedGreet);

		// TODO This should work, but throws a type error
		// for root not being included in expected object.
		// However, root is not apart of result object.
		// expect(result).toMatchObject<TransactionReceipt>({
		// eslint-disable-next-line jest/no-standalone-expect
		expect(result).toMatchObject({
			// root: expect.any(String),
			blockHash: expect.any(String),
			blockNumber: expect.any(BigInt),
			cumulativeGasUsed: expect.any(BigInt),
			effectiveGasPrice: expect.any(BigInt),
			from: getE2ETestAccountAddress().toLowerCase(),
			gasUsed: expect.any(BigInt),
			logs: [
				{
					address: deployedContractAddress,
					blockHash: expect.any(String),
					blockNumber: expect.any(BigInt),
					data: '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000017536f796c656e7420677265656e2069732070656f706c65000000000000000000000000000000000000000000000000000000000000000000000000000000002a5768657265207765e28099726520676f696e672c20776520646f6ee2809974206e65656420726f61647300000000000000000000000000000000000000000000',
					logIndex: expect.any(BigInt),
					removed: false,
					topics: ['0x0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b75'],
					transactionHash: expect.any(String),
					transactionIndex: expect.any(BigInt),
				},
				{
					address: deployedContractAddress,
					blockHash: expect.any(String),
					blockNumber: expect.any(BigInt),
					data: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a5768657265207765e28099726520676f696e672c20776520646f6ee2809974206e65656420726f61647300000000000000000000000000000000000000000000',
					logIndex: expect.any(BigInt),
					removed: false,
					topics: ['0x7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e'],
					transactionHash: expect.any(String),
					transactionIndex: expect.any(BigInt),
				},
			],
			logsBloom: expect.any(String),
			status: BigInt(1),
			transactionHash: expect.any(String),
			transactionIndex: expect.any(BigInt),
			type: BigInt(2),
		});
	});
});
