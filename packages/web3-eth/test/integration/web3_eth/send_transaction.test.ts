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

// TODO Seems to be an issue with linter falsely reporting this
// error for Transaction Error Scenarios tests
/* eslint-disable jest/no-conditional-expect */

import {
	Transaction,
	TransactionWithFromLocalWalletIndex,
	TransactionWithToLocalWalletIndex,
	TransactionWithFromAndToLocalWalletIndex,
	Address,
	DEFAULT_RETURN_FORMAT,
} from 'web3-types';
import { Wallet } from 'web3-eth-accounts';
import { isHexStrict } from 'web3-validator';

import Web3Eth from '../../../src';
import {
	closeOpenConnection,
	createAccountProvider,
	createTempAccount,
	getSystemTestBackend,
	getSystemTestProvider,
	isGeth,
	itIf,
	BACKEND,
} from '../../fixtures/system_test_utils';
import { SimpleRevertAbi, SimpleRevertDeploymentData } from '../../fixtures/simple_revert';

describe('Web3Eth.sendTransaction', () => {
	let web3Eth: Web3Eth;
	let tempAcc: { address: string; privateKey: string };

	beforeAll(async () => {
		web3Eth = new Web3Eth(getSystemTestProvider());
		tempAcc = await createTempAccount();
	});

	afterAll(async () => {
		await closeOpenConnection(web3Eth);
	});

	it('should make a simple value transfer', async () => {
		const transaction: Transaction = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: BigInt(1),
		};
		const response = await web3Eth.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		expect(response.events).toBeUndefined();

		const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
		expect(minedTransactionData).toMatchObject(transaction);
	});

	it('should make a simple value transfer - with local wallet indexed sender', async () => {
		const web3EthWithWallet = new Web3Eth(getSystemTestProvider());
		const accountProvider = createAccountProvider(web3Eth);
		const wallet = new Wallet(accountProvider);

		web3EthWithWallet['_accountProvider'] = accountProvider;
		web3EthWithWallet['_wallet'] = wallet;

		web3EthWithWallet.wallet?.add(tempAcc.privateKey);

		const transaction: TransactionWithFromLocalWalletIndex = {
			from: 0,
			to: '0x0000000000000000000000000000000000000000',
			gas: 21000,
			value: BigInt(1),
		};
		const response = await web3EthWithWallet.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		expect(response.events).toBeUndefined();

		const minedTransactionData = await web3EthWithWallet.getTransaction(
			response.transactionHash,
		);

		expect(minedTransactionData).toMatchObject({
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: BigInt(1),
		});

		await closeOpenConnection(web3EthWithWallet);
	});

	it('should make a simple value transfer - with local wallet indexed receiver', async () => {
		const web3EthWithWallet = new Web3Eth(getSystemTestProvider());
		const accountProvider = createAccountProvider(web3Eth);
		const wallet = new Wallet(accountProvider);

		web3EthWithWallet['_accountProvider'] = accountProvider;
		web3EthWithWallet['_wallet'] = wallet;

		web3EthWithWallet.wallet?.add(tempAcc.privateKey);

		const transaction: TransactionWithToLocalWalletIndex = {
			from: tempAcc.address,
			to: 0,
			gas: 21000,
			value: BigInt(1),
		};
		const response = await web3EthWithWallet.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		expect(response.events).toBeUndefined();

		const minedTransactionData = await web3EthWithWallet.getTransaction(
			response.transactionHash,
		);

		expect(minedTransactionData).toMatchObject({
			from: tempAcc.address,
			to: wallet.get(0)?.address.toLowerCase(),
			value: BigInt(1),
		});

		await closeOpenConnection(web3EthWithWallet);
	});

	it('should make a simple value transfer - with local wallet indexed sender and receiver', async () => {
		const web3EthWithWallet = new Web3Eth(getSystemTestProvider());
		const accountProvider = createAccountProvider(web3Eth);
		const wallet = new Wallet(accountProvider);

		web3EthWithWallet['_accountProvider'] = accountProvider;
		web3EthWithWallet['_wallet'] = wallet;

		const tempAcc2 = await createTempAccount();

		web3EthWithWallet.wallet?.add(tempAcc.privateKey);

		web3EthWithWallet.wallet?.add(tempAcc2.privateKey);

		const transaction: TransactionWithFromAndToLocalWalletIndex = {
			from: 0,
			to: 1,
			gas: 21000,
			value: BigInt(1),
		};
		const response = await web3EthWithWallet.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		expect(response.events).toBeUndefined();

		const minedTransactionData = await web3EthWithWallet.getTransaction(
			response.transactionHash,
		);

		expect(minedTransactionData).toMatchObject({
			from: tempAcc.address,
			to: wallet.get(1)?.address.toLowerCase(),
			value: BigInt(1),
		});

		await closeOpenConnection(web3EthWithWallet);
	});
	it('should make a transaction with no value transfer', async () => {
		const transaction: Transaction = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: BigInt(0),
		};
		const response = await web3Eth.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		expect(response.events).toBeUndefined();

		const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
		expect(minedTransactionData).toMatchObject(transaction);
	});
	it('should send a transaction with data', async () => {
		const transaction: Transaction = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			data: '0x64edfbf0e2c706ba4a09595315c45355a341a576cc17f3a19f43ac1c02f814ee',
			value: BigInt(0),
		};
		const response = await web3Eth.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		expect(response.events).toBeUndefined();

		const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
		expect(minedTransactionData).toMatchObject(transaction);
	});
	it('should send a transaction while ignoring gas price successfully', async () => {
		const transaction: TransactionWithToLocalWalletIndex = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: BigInt(1),
			data: '0x64edfbf0e2c706ba4a09595315c45355a341a576cc17f3a19f43ac1c02f814ee',
		};

		const localWeb3Eth = new Web3Eth(getSystemTestProvider());
		localWeb3Eth.config.ignoreGasPricing = true;
		const response = await localWeb3Eth.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		await closeOpenConnection(localWeb3Eth);
	});
	it('should send a transaction with automated gas price successfully', async () => {
		const transaction: TransactionWithToLocalWalletIndex = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: BigInt(1),
			data: '0x64edfbf0e2c706ba4a09595315c45355a341a576cc17f3a19f43ac1c02f814ee',
		};

		const localWeb3Eth = new Web3Eth(getSystemTestProvider());
		localWeb3Eth.config.ignoreGasPricing = false;
		const response = await localWeb3Eth.sendTransaction(transaction);
		expect(response.status).toBe(BigInt(1));
		await closeOpenConnection(localWeb3Eth);
	});
	describe('Deploy and interact with contract', () => {
		let greeterContractAddress: string;

		it('should deploy a contract', async () => {
			const greeterContractDeploymentData =
				'0x60806040523480156200001157600080fd5b5060405162000a6a38038062000a6a8339818101604052810190620000379190620002a4565b80600090805190602001906200004f92919062000057565b505062000359565b828054620000659062000324565b90600052602060002090601f016020900481019282620000895760008555620000d5565b82601f10620000a457805160ff1916838001178555620000d5565b82800160010185558215620000d5579182015b82811115620000d4578251825591602001919060010190620000b7565b5b509050620000e49190620000e8565b5090565b5b8082111562000103576000816000905550600101620000e9565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001708262000125565b810181811067ffffffffffffffff8211171562000192576200019162000136565b5b80604052505050565b6000620001a762000107565b9050620001b5828262000165565b919050565b600067ffffffffffffffff821115620001d857620001d762000136565b5b620001e38262000125565b9050602081019050919050565b60005b8381101562000210578082015181840152602081019050620001f3565b8381111562000220576000848401525b50505050565b60006200023d6200023784620001ba565b6200019b565b9050828152602081018484840111156200025c576200025b62000120565b5b62000269848285620001f0565b509392505050565b600082601f8301126200028957620002886200011b565b5b81516200029b84826020860162000226565b91505092915050565b600060208284031215620002bd57620002bc62000111565b5b600082015167ffffffffffffffff811115620002de57620002dd62000116565b5b620002ec8482850162000271565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200033d57607f821691505b602082108103620003535762000352620002f5565b5b50919050565b61070180620003696000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063a41368621461003b578063cfae32171461006c575b600080fd5b6100556004803603810190610050919061043f565b61008a565b60405161006392919061052b565b60405180910390f35b6100746101b0565b604051610081919061055b565b60405180910390f35b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756000846040516100c0929190610672565b60405180910390a182600090805190602001906100de929190610242565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600060405161010f91906106a9565b60405180910390a160016000808054610127906105ac565b80601f0160208091040260200160405190810160405280929190818152602001828054610153906105ac565b80156101a05780601f10610175576101008083540402835291602001916101a0565b820191906000526020600020905b81548152906001019060200180831161018357829003601f168201915b5050505050905091509150915091565b6060600080546101bf906105ac565b80601f01602080910402602001604051908101604052809291908181526020018280546101eb906105ac565b80156102385780601f1061020d57610100808354040283529160200191610238565b820191906000526020600020905b81548152906001019060200180831161021b57829003601f168201915b5050505050905090565b82805461024e906105ac565b90600052602060002090601f01602090048101928261027057600085556102b7565b82601f1061028957805160ff19168380011785556102b7565b828001600101855582156102b7579182015b828111156102b657825182559160200191906001019061029b565b5b5090506102c491906102c8565b5090565b5b808211156102e15760008160009055506001016102c9565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61034c82610303565b810181811067ffffffffffffffff8211171561036b5761036a610314565b5b80604052505050565b600061037e6102e5565b905061038a8282610343565b919050565b600067ffffffffffffffff8211156103aa576103a9610314565b5b6103b382610303565b9050602081019050919050565b82818337600083830152505050565b60006103e26103dd8461038f565b610374565b9050828152602081018484840111156103fe576103fd6102fe565b5b6104098482856103c0565b509392505050565b600082601f830112610426576104256102f9565b5b81356104368482602086016103cf565b91505092915050565b600060208284031215610455576104546102ef565b5b600082013567ffffffffffffffff811115610473576104726102f4565b5b61047f84828501610411565b91505092915050565b60008115159050919050565b61049d81610488565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156104dd5780820151818401526020810190506104c2565b838111156104ec576000848401525b50505050565b60006104fd826104a3565b61050781856104ae565b93506105178185602086016104bf565b61052081610303565b840191505092915050565b60006040820190506105406000830185610494565b818103602083015261055281846104f2565b90509392505050565b6000602082019050818103600083015261057581846104f2565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806105c457607f821691505b6020821081036105d7576105d661057d565b5b50919050565b60008190508160005260206000209050919050565b600081546105ff816105ac565b61060981866104ae565b94506001821660008114610624576001811461063657610669565b60ff1983168652602086019350610669565b61063f856105dd565b60005b8381101561066157815481890152600182019150602081019050610642565b808801955050505b50505092915050565b6000604082019050818103600083015261068c81856105f2565b905081810360208301526106a081846104f2565b90509392505050565b600060208201905081810360008301526106c381846105f2565b90509291505056fea2646970667358221220fe0f28c9f8ef0a13a95934b974e7bc2ca6762b40a5b93ccd6ca2038f454bf52764736f6c634300080e003300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000017736f6c79656e7420677265656e2069732070656f706c65000000000000000000';
			const transaction: Transaction = {
				from: tempAcc.address,
				data: greeterContractDeploymentData,
				input: greeterContractDeploymentData,
				gas: BigInt('475520'),
			};
			const response = await web3Eth.sendTransaction(transaction);
			expect(response.status).toBe(BigInt(1));
			expect(response.events).toBeUndefined();
			expect(response.contractAddress).toBeDefined();

			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject({
				from: tempAcc.address,
				input: greeterContractDeploymentData,
				gas: BigInt('475520'),
			});

			greeterContractAddress = response.contractAddress as string;
		});

		it('should update greet in contract', async () => {
			const contractFunctionCall =
				'0xa4136862000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000023432000000000000000000000000000000000000000000000000000000000000';
			const transaction: Transaction = {
				from: tempAcc.address,
				to: greeterContractAddress,
				data: contractFunctionCall,
				input: contractFunctionCall,
			};
			const response = await web3Eth.sendTransaction(transaction);
			expect(response.events).toBeUndefined();
			expect(response.status).toBe(BigInt(1));

			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject({
				from: tempAcc.address,
				to: greeterContractAddress,
				input: contractFunctionCall,
			});
		});
	});

	describe('Transaction Types', () => {
		it('should send a successful type 0x0 transaction', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: BigInt(1),
				type: BigInt(0),
			};
			const response = await web3Eth.sendTransaction(transaction);
			expect(response.events).toBeUndefined();
			expect(response.type).toBe(BigInt(0));
			expect(response.status).toBe(BigInt(1));

			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});

		it('should send a successful type 0x1 transaction', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: BigInt(1),
				type: BigInt(1),
				// TODO If this property is not included, tx gets default to type: 0x0
				// from what I can tell our library isn't doing this, but it happens
				// with both Geth and Ganache, so I'm not sure
				accessList: [],
			};
			const response = await web3Eth.sendTransaction(transaction);
			expect(response.events).toBeUndefined();
			expect(response.type).toBe(BigInt(1));
			expect(response.status).toBe(BigInt(1));

			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});

		it('should send a successful type 0x2 transaction', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: BigInt(1),
				type: BigInt(2),
			};
			const response = await web3Eth.sendTransaction(transaction);
			expect(response.events).toBeUndefined();
			expect(response.type).toBe(BigInt(2));
			expect(response.status).toBe(BigInt(1));

			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});

		it('should send a successful type 0x2 transaction (gas = estimateGas)', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: BigInt(1),
				type: BigInt(2),
			};

			transaction.gas = await web3Eth.estimateGas(transaction);

			const response = await web3Eth.sendTransaction(transaction);
			expect(response.events).toBeUndefined();
			expect(response.type).toBe(BigInt(2));
			expect(response.status).toBe(BigInt(1));

			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});

		it('should send a successful type 0x2 transaction (fee per gas from: calculateFeeData)', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: BigInt(1),
				type: BigInt(2),
			};

			const feeData = await web3Eth.calculateFeeData();
			transaction.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
			transaction.maxFeePerGas = feeData.maxFeePerGas;

			const response = await web3Eth.sendTransaction(transaction);
			expect(response.events).toBeUndefined();
			expect(response.type).toBe(BigInt(2));
			expect(response.status).toBe(BigInt(1));

			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});

		it('should send a successful type 0x0 transaction with data', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				data: '0x64edfbf0e2c706ba4a09595315c45355a341a576cc17f3a19f43ac1c02f814ee',
				value: BigInt(1),
				type: BigInt(0),
			};
			const response = await web3Eth.sendTransaction(transaction, DEFAULT_RETURN_FORMAT);
			expect(response.type).toBe(BigInt(0));
			expect(response.events).toBeUndefined();
			expect(response.status).toBe(BigInt(1));
			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});

		it('should send a successful autodetected type 0x0 gasprice as data', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				data: '0x64edfbf0e2c706ba4a09595315c45355a341a576cc17f3a19f43ac1c02f814ee',
				value: BigInt(1),
				gasPrice: BigInt(2500000008),
			};
			const response = await web3Eth.sendTransaction(transaction, DEFAULT_RETURN_FORMAT);
			expect(response.type).toBe(BigInt(0));
			expect(response.status).toBe(BigInt(1));
			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});

		it('should send a successful default type 0x2 transaction with data', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				data: '0x64edfbf0e2c706ba4a09595315c45355a341a576cc17f3a19f43ac1c02f814ee',
				value: BigInt(1),
				gas: BigInt(30000),
			};
			const response = await web3Eth.sendTransaction(transaction, DEFAULT_RETURN_FORMAT);
			expect(response.type).toBe(BigInt(2));
			expect(response.status).toBe(BigInt(1));
			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			expect(minedTransactionData).toMatchObject(transaction);
		});
	});
	it('should autofill a successful type 0x2 transaction with only maxFeePerGas passed', async () => {
		const transaction: Transaction = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: BigInt(1),
			maxFeePerGas: BigInt(2500000016),
		};
		const response = await web3Eth.sendTransaction(transaction);
		expect(response.events).toBeUndefined();
		expect(response.type).toBe(BigInt(2));
		expect(response.status).toBe(BigInt(1));
		const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
		expect(minedTransactionData).toMatchObject(transaction);
	});

	it('should autofill a successful type 0x2 transaction with only maxPriorityFeePerGas passed', async () => {
		const transaction: Transaction = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: BigInt(1),
			maxPriorityFeePerGas: BigInt(100),
		};
		const response = await web3Eth.sendTransaction(transaction);
		expect(response.events).toBeUndefined();
		expect(response.type).toBe(BigInt(2));
		expect(response.status).toBe(BigInt(1));
		const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
		expect(minedTransactionData).toMatchObject(transaction);
	});

	itIf(isGeth)(
		'should send type 0x2 transaction with maxPriorityFeePerGas got from await web3Eth.getMaxPriorityFeePerGas()',
		async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: BigInt(1),
				maxPriorityFeePerGas: await web3Eth.getMaxPriorityFeePerGas(),
			};
			const response = await web3Eth.sendTransaction(transaction);

			// eslint-disable-next-line jest/no-standalone-expect
			expect(response.events).toBeUndefined();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(response.type).toBe(BigInt(2));
			// eslint-disable-next-line jest/no-standalone-expect
			expect(response.status).toBe(BigInt(1));
			const minedTransactionData = await web3Eth.getTransaction(response.transactionHash);
			// eslint-disable-next-line jest/no-standalone-expect
			expect(minedTransactionData).toMatchObject(transaction);
		},
	);

	describe('Transaction PromiEvents', () => {
		let transaction: Transaction;

		beforeEach(async () => {
			tempAcc = await createTempAccount();
			transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: '0x1',
			};
		});

		it('should listen to the sending event', async () => {
			await web3Eth.sendTransaction(transaction).on('sending', data => {
				expect(data).toMatchObject(transaction);
			});
			expect.assertions(1);
		});

		it('should listen to the sent event', async () => {
			await web3Eth.sendTransaction(transaction).on('sent', data => {
				expect(data).toMatchObject(transaction);
			});
			expect.assertions(1);
		});

		it('should listen to the transactionHash event', async () => {
			await web3Eth.sendTransaction(transaction).on('transactionHash', data => {
				expect(isHexStrict(data)).toBe(true);
			});
			expect.assertions(1);
		});

		it('should listen to the receipt event', async () => {
			const expectedTransactionReceipt = {
				blockHash: expect.any(String),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				from: transaction.from,
				to: transaction.to,
				transactionHash: expect.any(String),
			};
			await web3Eth.sendTransaction(transaction).on('receipt', data => {
				expect(data).toEqual(expect.objectContaining(expectedTransactionReceipt));

				// To avoid issue with the `objectContaining` and `cypress` had to add
				// these expectations explicitly on each attribute
				expect(typeof data.blockNumber).toBe('bigint');
				expect(typeof data.cumulativeGasUsed).toBe('bigint');
				expect(typeof data.effectiveGasPrice).toBe('bigint');
				expect(typeof data.gasUsed).toBe('bigint');
				expect(typeof data.transactionIndex).toBe('bigint');
				expect(data.status).toBe(BigInt(1));
				expect(data.type).toBe(BigInt(2));
				expect(data.events).toBeUndefined();
			});
			expect.assertions(9);
		});

		it('should listen to the confirmation event', async () => {
			const expectedTransactionConfirmation = {
				confirmationNumber: expect.any(BigInt),
				receipt: {
					blockHash: expect.any(String),
					blockNumber: expect.any(BigInt),
					cumulativeGasUsed: expect.any(BigInt),
					effectiveGasPrice: expect.any(BigInt),
					gasUsed: expect.any(BigInt),
					logs: [],
					logsBloom:
						'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
					status: BigInt(1),
					from: transaction.from,
					to: transaction.to,
					transactionHash: expect.any(String),
					transactionIndex: BigInt(0),
					type: BigInt(0),
				},
				latestBlockHash: expect.any(String),
			};

			await web3Eth.sendTransaction(transaction).on('confirmation', data => {
				expect(data).toEqual(expect.objectContaining(expectedTransactionConfirmation));
			});

			// TODO Confirmations are dependent on the next block being mined,
			// this is manually triggering the next block to be created since both
			// Geth and Ganache wait for transaction before mining a block.
			// This should be revisted to implement a better solution
			await web3Eth.sendTransaction(transaction);

			// TODO: Debug why the assertions are not being called
			// expect.assertions(1);
		});
	});

	describe('Transaction Error Scenarios', () => {
		let simpleRevertContractAddress: Address;

		beforeAll(async () => {
			const simpleRevertDeployTransaction: Transaction = {
				from: tempAcc.address,
				data: SimpleRevertDeploymentData,
			};
			simpleRevertDeployTransaction.gas = await web3Eth.estimateGas(
				simpleRevertDeployTransaction,
			);
			simpleRevertContractAddress = (
				await web3Eth.sendTransaction(simpleRevertDeployTransaction)
			).contractAddress as Address;
		});

		it('Should throw TransactionRevertInstructionError because gas too low', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: '0x0000000000000000000000000000000000000000',
				value: BigInt(1),
				gas: 1,
			};

			const expectedThrownError = {
				name: 'TransactionRevertInstructionError',
				code: 402,
				reason:
					getSystemTestBackend() === BACKEND.GETH
						? 'err: intrinsic gas too low: have 1, want 21000 (supplied gas 1)'
						: 'base fee exceeds gas limit',
			};

			if (getSystemTestBackend() !== BACKEND.HARDHAT) {
				await expect(
					web3Eth
						.sendTransaction(transaction)
						.on('error', error => expect(error).toMatchObject(expectedThrownError)),
				).rejects.toMatchObject(expectedThrownError);
			} else {
				try {
					await web3Eth.sendTransaction(transaction);
				} catch (error) {
					expect((error as any).name).toEqual(expectedThrownError.name);
					expect((error as any).code).toEqual(expectedThrownError.code);
					expect((error as any).reason).toContain(expectedThrownError.reason);
				}
			}
		});
		itIf(getSystemTestBackend() !== BACKEND.HARDHAT)(
			'Should throw TransactionRevertInstructionError because insufficient funds',
			async () => {
				const transaction: Transaction = {
					from: tempAcc.address,
					to: '0x0000000000000000000000000000000000000000',
					value: BigInt(
						'99999999999999999999999999999999999999999999999999999999999999999',
					),
				};

				const expectedThrownError = {
					name: 'TransactionRevertInstructionError',
					message: 'Transaction has been reverted by the EVM',
					code: 402,
					reason:
						getSystemTestBackend() === BACKEND.GETH
							? expect.stringContaining(
									'err: insufficient funds for gas * price + value: address',
							  )
							: 'VM Exception while processing transaction: insufficient balance',
				};

				// eslint-disable-next-line jest/no-standalone-expect
				await expect(
					web3Eth
						.sendTransaction(transaction)
						// eslint-disable-next-line jest/no-standalone-expect
						.on('error', error => expect(error).toMatchObject(expectedThrownError)),
				).rejects.toMatchObject(expectedThrownError);
			},
		);

		it('Should throw TransactionRevertInstructionError because of contract revert and return revert reason', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: simpleRevertContractAddress,
				data: '0xba57a511000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000067265766572740000000000000000000000000000000000000000000000000000',
			};

			web3Eth.handleRevert = true;

			const expectedThrownError = {
				name: 'TransactionRevertInstructionError',
				code: 402,
				reason:
					getSystemTestBackend() === BACKEND.GETH
						? 'execution reverted: This is a send revert'
						: "Error: VM Exception while processing transaction: reverted with reason string 'This is a send revert'",
				signature: '0x08c379a0',
				data: '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612073656e64207265766572740000000000000000000000',
				receipt: undefined,
			};

			await expect(
				web3Eth
					.sendTransaction(transaction)
					.on('error', error => expect(error).toMatchObject(expectedThrownError)),
			).rejects.toMatchObject(expectedThrownError);
		});

		it('Should throw TransactionRevertWithCustomError because of contract revert and return custom error ErrorWithNoParams', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: simpleRevertContractAddress,
				data: '0x3ebf4d9c',
			};

			web3Eth.handleRevert = true;

			const expectedThrownError = {
				name: 'TransactionRevertWithCustomError',
				code: 438,
				reason:
					getSystemTestBackend() === BACKEND.GETH
						? 'execution reverted'
						: 'Error: VM Exception while processing transaction: reverted with an unrecognized custom error (return data: 0x72090e4d)',
				signature: '0x72090e4d',
				customErrorName: 'ErrorWithNoParams',
				customErrorDecodedSignature: 'ErrorWithNoParams()',
				customErrorArguments: {},
				receipt: undefined,
			};

			await expect(
				web3Eth
					.sendTransaction(transaction, undefined, { contractAbi: SimpleRevertAbi })
					.on('error', error => expect(error).toMatchObject(expectedThrownError)),
			).rejects.toMatchObject(expectedThrownError);
		});

		it('Should throw TransactionRevertWithCustomError because of contract revert and return custom error ErrorWithParams', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: simpleRevertContractAddress,
				data: '0x819f48fe',
			};

			web3Eth.handleRevert = true;

			const expectedThrownError = {
				name: 'TransactionRevertWithCustomError',
				code: 438,
				reason:
					getSystemTestBackend() === BACKEND.GETH
						? 'execution reverted'
						: 'Error: VM Exception while processing transaction: reverted with an unrecognized custom error (return data: 0xc85bda60000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000)',
				signature: '0xc85bda60',
				data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				customErrorName: 'ErrorWithParams',
				customErrorDecodedSignature: 'ErrorWithParams(uint256,string)',
				customErrorArguments: {
					code: BigInt(42),
					message: 'This is an error with params',
				},
				receipt: undefined,
			};

			await expect(
				web3Eth
					.sendTransaction(transaction, undefined, { contractAbi: SimpleRevertAbi })
					.on('error', error => expect(error).toMatchObject(expectedThrownError)),
			).rejects.toMatchObject(expectedThrownError);
		});

		it('Should throw TransactionRevertInstructionError because of contract revert', async () => {
			const transaction: Transaction = {
				from: tempAcc.address,
				to: simpleRevertContractAddress,
				data: '0xba57a511000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000067265766572740000000000000000000000000000000000000000000000000000',
			};

			web3Eth.handleRevert = false;

			const expectedThrownError = {
				name: 'TransactionRevertInstructionError',
				code: 402,
				reason:
					getSystemTestBackend() === BACKEND.GETH
						? 'execution reverted: This is a send revert'
						: "Error: VM Exception while processing transaction: reverted with reason string 'This is a send revert'",
				signature: '0x08c379a0',
				data: '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612073656e64207265766572740000000000000000000000',
			};

			await expect(
				web3Eth
					.sendTransaction(transaction)
					.on('error', error => expect(error).toMatchObject(expectedThrownError)),
			).rejects.toMatchObject(expectedThrownError);
		});
	});
});
