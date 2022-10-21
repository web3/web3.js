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

import * as eth from 'web3-eth';
import { ValidChains, Hardfork } from 'web3-types';
import { Contract } from '../../src';
import { sampleStorageContractABI } from '../fixtures/storage';
import { GreeterAbi, GreeterBytecode } from '../shared_fixtures/build/Greeter';
import { AllGetPastEventsData, getLogsData, getPastEventsData } from '../fixtures/unitTestFixtures';

jest.mock('web3-eth');

describe('Contract', () => {
	describe('constructor', () => {
		it('should init with only the abi', () => {
			const contract = new Contract([]);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi and address', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa');

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi and options', () => {
			const contract = new Contract([], { gas: '123' });

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, options and context', () => {
			const contract = new Contract(
				[],
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address and options', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa', {
				gas: '123',
			});

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address, options and context', () => {
			const contract = new Contract(
				[],
				'0x00000000219ab540356cBB839Cbe05303d7705Fa',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});
	});

	describe('Contract functions and defaults', () => {
		let sendOptions: Record<string, unknown>;
		const deployedAddr = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';

		beforeAll(() => {
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
		});

		it('should deploy contract', async () => {
			const data =
				'0x60806040523480156200001157600080fd5b5060405162000a6a38038062000a6a8339818101604052810190620000379190620002a4565b80600090805190602001906200004f92919062000057565b505062000359565b828054620000659062000324565b90600052602060002090601f016020900481019282620000895760008555620000d5565b82601f10620000a457805160ff1916838001178555620000d5565b82800160010185558215620000d5579182015b82811115620000d4578251825591602001919060010190620000b7565b5b509050620000e49190620000e8565b5090565b5b8082111562000103576000816000905550600101620000e9565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001708262000125565b810181811067ffffffffffffffff8211171562000192576200019162000136565b5b80604052505050565b6000620001a762000107565b9050620001b5828262000165565b919050565b600067ffffffffffffffff821115620001d857620001d762000136565b5b620001e38262000125565b9050602081019050919050565b60005b8381101562000210578082015181840152602081019050620001f3565b8381111562000220576000848401525b50505050565b60006200023d6200023784620001ba565b6200019b565b9050828152602081018484840111156200025c576200025b62000120565b5b62000269848285620001f0565b509392505050565b600082601f8301126200028957620002886200011b565b5b81516200029b84826020860162000226565b91505092915050565b600060208284031215620002bd57620002bc62000111565b5b600082015167ffffffffffffffff811115620002de57620002dd62000116565b5b620002ec8482850162000271565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200033d57607f821691505b602082108103620003535762000352620002f5565b5b50919050565b61070180620003696000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063a41368621461003b578063cfae32171461006c575b600080fd5b6100556004803603810190610050919061043f565b61008a565b60405161006392919061052b565b60405180910390f35b6100746101b0565b604051610081919061055b565b60405180910390f35b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756000846040516100c0929190610672565b60405180910390a182600090805190602001906100de929190610242565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600060405161010f91906106a9565b60405180910390a160016000808054610127906105ac565b80601f0160208091040260200160405190810160405280929190818152602001828054610153906105ac565b80156101a05780601f10610175576101008083540402835291602001916101a0565b820191906000526020600020905b81548152906001019060200180831161018357829003601f168201915b5050505050905091509150915091565b6060600080546101bf906105ac565b80601f01602080910402602001604051908101604052809291908181526020018280546101eb906105ac565b80156102385780601f1061020d57610100808354040283529160200191610238565b820191906000526020600020905b81548152906001019060200180831161021b57829003601f168201915b5050505050905090565b82805461024e906105ac565b90600052602060002090601f01602090048101928261027057600085556102b7565b82601f1061028957805160ff19168380011785556102b7565b828001600101855582156102b7579182015b828111156102b657825182559160200191906001019061029b565b5b5090506102c491906102c8565b5090565b5b808211156102e15760008160009055506001016102c9565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61034c82610303565b810181811067ffffffffffffffff8211171561036b5761036a610314565b5b80604052505050565b600061037e6102e5565b905061038a8282610343565b919050565b600067ffffffffffffffff8211156103aa576103a9610314565b5b6103b382610303565b9050602081019050919050565b82818337600083830152505050565b60006103e26103dd8461038f565b610374565b9050828152602081018484840111156103fe576103fd6102fe565b5b6104098482856103c0565b509392505050565b600082601f830112610426576104256102f9565b5b81356104368482602086016103cf565b91505092915050565b600060208284031215610455576104546102ef565b5b600082013567ffffffffffffffff811115610473576104726102f4565b5b61047f84828501610411565b91505092915050565b60008115159050919050565b61049d81610488565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156104dd5780820151818401526020810190506104c2565b838111156104ec576000848401525b50505050565b60006104fd826104a3565b61050781856104ae565b93506105178185602086016104bf565b61052081610303565b840191505092915050565b60006040820190506105406000830185610494565b818103602083015261055281846104f2565b90509392505050565b6000602082019050818103600083015261057581846104f2565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806105c457607f821691505b6020821081036105d7576105d661057d565b5b50919050565b60008190508160005260206000209050919050565b600081546105ff816105ac565b61060981866104ae565b94506001821660008114610624576001811461063657610669565b60ff1983168652602086019350610669565b61063f856105dd565b60005b8381101561066157815481890152600182019150602081019050610642565b808801955050505b50505092915050565b6000604082019050818103600083015261068c81856105f2565b905081810360208301526106a081846104f2565b90509392505050565b600060208201905081810360008301526106c381846105f2565b90509291505056fea26469706673582212203746baed62e6fd543d947eb69460c5abf2eef8b85afff65b442695d4abaaebbc64736f6c634300080d00330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000';
			const contract = new Contract(GreeterAbi);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const deploySpy = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, tx) => {
					expect(tx.to).toBeUndefined();
					expect(tx.gas).toStrictEqual(sendOptions.gas);
					expect(tx.gasPrice).toBeUndefined();
					expect(tx.from).toStrictEqual(sendOptions.from);
					expect(tx.data).toStrictEqual(data); // padded data

					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(newContract) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			expect(deployedContract).toBeDefined();
			expect(deployedContract.options.address).toStrictEqual(deployedAddr);
			deploySpy.mockClear();
		});

		// eslint-disable-next-line @typescript-eslint/require-await
		it('should not deploy contract with empty data', async () => {
			const contract = new Contract(GreeterAbi);

			expect(() => contract.deploy({ data: '' }).send(sendOptions)).toThrow(
				'contract creation without any data provided',
			);
		});

		// eslint-disable-next-line @typescript-eslint/require-await
		it('send method on deployed contract should work', async () => {
			const arg = 'Hello';
			const contract = new Contract(GreeterAbi);

			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					if (
						_tx.data ===
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return
						return Promise.resolve({ status: '0x1' }) as any;
					}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(newContract) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('call on deployed contract should decode result', async () => {
			const arg = 'Hello';
			const encodedArg =
				'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';

			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEthCall = jest.spyOn(eth, 'call').mockImplementation((_objInstance, _tx) => {
				expect(_tx.to).toStrictEqual(deployedAddr);
				expect(_tx.data).toBe('0xcfae3217');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(encodedArg) as any; // contract class should decode encodedArg
			});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const res = await deployedContract.methods.greet().call();
			expect(res).toStrictEqual(arg);

			spyTx.mockClear();
			spyEthCall.mockClear();
		});

		it('should clone pre deployed contract with address', () => {
			const contract = new Contract(
				sampleStorageContractABI,
				'0x00000000219ab540356cBB839Cbe05303d7705Fa',
				{ gas: '0x97254' },
			);

			const clonnedContract = contract.clone();

			expect(JSON.stringify(contract)).toStrictEqual(JSON.stringify(clonnedContract));
		});

		it('should clone new contract', () => {
			const contract = new Contract(sampleStorageContractABI);

			const clonnedContract = contract.clone();
			expect(JSON.stringify(contract)).toStrictEqual(JSON.stringify(clonnedContract));
		});

		it('defaults set and get should work', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa');

			const defaultAddr = '0xd7E30ae310C1D1800F5B641Baa7af95b2e1FD98C';
			expect(contract.defaultAccount).toBeUndefined();
			contract.defaultAccount = defaultAddr;
			expect(contract.defaultAccount).toStrictEqual(defaultAddr);

			const defaultBlock = '0xC43A';
			expect(contract.defaultBlock).toBe('latest');
			contract.defaultBlock = defaultBlock;
			expect(contract.defaultBlock).toStrictEqual(defaultBlock);

			const defaultHardfork = 'constantinople';
			expect(contract.defaultHardfork).toBe('london');
			contract.defaultHardfork = defaultHardfork;
			expect(contract.defaultHardfork).toStrictEqual(defaultHardfork);

			const baseChain = 'mainnet' as ValidChains;
			contract.defaultChain = baseChain;
			expect(contract.defaultChain).toBe(baseChain);

			const defaultCommonDifferentHardfork = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain,
				hardfork: 'petersburg' as Hardfork,
			};
			expect(contract.defaultCommon).toBeUndefined();

			// Test that defaultcommon will error when defaulthardfork is not matching
			// Has to be wrapped in another function to check Error
			expect(() => {
				contract.defaultCommon = defaultCommonDifferentHardfork;
			}).toThrow(
				new Error(
					'Web3Config hardfork doesnt match in defaultHardfork constantinople and common.hardfork petersburg',
				),
			);

			expect(contract.defaultCommon).toBeUndefined();

			// Should error when defaultCommon has different chain than defaultChain
			const defaultCommonDifferentChain = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain: 'sepolia' as ValidChains,
				hardfork: 'constantinople' as Hardfork,
			};
			expect(() => {
				contract.defaultCommon = defaultCommonDifferentChain;
			}).toThrow(
				new Error(
					'Web3Config chain doesnt match in defaultHardfork mainnet and common.hardfork sepolia',
				),
			);

			expect(contract.defaultCommon).toBeUndefined();

			const defaultCommon = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain: 'mainnet' as ValidChains,
				hardfork: 'constantinople' as Hardfork,
			};
			contract.defaultCommon = defaultCommon;
			expect(contract.defaultCommon).toBe(defaultCommon);

			const transactionBlockTimeout = 130;
			expect(contract.transactionBlockTimeout).toBe(50);
			contract.transactionBlockTimeout = transactionBlockTimeout;
			expect(contract.transactionBlockTimeout).toStrictEqual(transactionBlockTimeout);

			const transactionConfirmationBlocks = 30;
			expect(contract.transactionConfirmationBlocks).toBe(24);
			contract.transactionConfirmationBlocks = transactionConfirmationBlocks;
			expect(contract.transactionConfirmationBlocks).toStrictEqual(
				transactionConfirmationBlocks,
			);

			const transactionPollingInterval = 1000;
			expect(contract.transactionPollingInterval).toBe(1000);
			contract.transactionPollingInterval = transactionPollingInterval;
			expect(contract.transactionPollingInterval).toStrictEqual(transactionPollingInterval);

			const transactionPollingTimeout = 800000;
			expect(contract.transactionPollingTimeout).toBe(750000);
			contract.transactionPollingTimeout = transactionPollingTimeout;
			expect(contract.transactionPollingTimeout).toStrictEqual(transactionPollingTimeout);

			const transactionReceiptPollingInterval = 2000; // its new in 4.x
			expect(contract.transactionReceiptPollingInterval).toBe(1000);
			contract.transactionReceiptPollingInterval = transactionReceiptPollingInterval;
			expect(contract.transactionReceiptPollingInterval).toStrictEqual(
				transactionReceiptPollingInterval,
			);

			const transactionConfirmationPollingInterval = 2501; // its new in 4.x
			expect(contract.transactionConfirmationPollingInterval).toBe(1000);
			contract.transactionConfirmationPollingInterval =
				transactionConfirmationPollingInterval;
			expect(contract.transactionConfirmationPollingInterval).toStrictEqual(
				transactionConfirmationPollingInterval,
			);

			const transactionSendTimeout = 730000; // its new in 4.x
			expect(contract.transactionSendTimeout).toBe(750000);
			contract.transactionSendTimeout = transactionSendTimeout;
			expect(contract.transactionSendTimeout).toStrictEqual(transactionSendTimeout);

			const blockHeaderTimeout = 12;
			expect(contract.blockHeaderTimeout).toBe(10);
			contract.blockHeaderTimeout = blockHeaderTimeout;
			expect(contract.blockHeaderTimeout).toStrictEqual(blockHeaderTimeout);

			expect(contract.handleRevert).toBe(false);
			contract.handleRevert = true;
			expect(contract.handleRevert).toBe(true);
		});

		it('should set and get correct address', () => {
			const addr = '0x1230B93ffd14F2F022039675fA3fc3A46eE4C701';
			const contract = new Contract(
				[],
				'',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			contract.options.address = addr;
			expect(contract.options.address).toStrictEqual(addr);
		});

		it.skip('should set and get jsonInterface', () => {
			const contract = new Contract(
				sampleStorageContractABI,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			// contract.options.jsonInterface = ERC20TokenAbi; //TODO also check changing abi on the fly bug: https://github.com/web3/web3.js/issues/5474
			expect(contract.options.jsonInterface).toStrictEqual(sampleStorageContractABI);
		});

		it('getPastEvents with filter should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toStrictEqual(getLogsData.request.fromBlock);
					expect(_params.toBlock).toStrictEqual(getLogsData.request.toBlock);
					expect(_params.topics).toStrictEqual(getLogsData.request.topics);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(getLogsData.response) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const fromBlock = 'earliest';
			const toBlock = 'latest';
			const pastEvent = await deployedContract.getPastEvents(getPastEventsData.event as any, {
				fromBlock,
				toBlock,
			});

			expect(pastEvent).toStrictEqual(getPastEventsData.response);
			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('getPastEvents for all events should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toBeUndefined();
					expect(_params.toBlock).toBeUndefined();
					expect(_params.topics).toBeUndefined();

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(AllGetPastEventsData.getLogsData) as any; // AllGetPastEventsData.getLogsData data test is for: assume two transactions sent to contract with contractInstance.methods.setGreeting("Hello") and contractInstance.methods.setGreeting("Another Greeting")
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const pastEvent = await deployedContract.getPastEvents('allEvents');

			expect(pastEvent).toStrictEqual(AllGetPastEventsData.response);
			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('estimateGas should work', async () => {
			const arg = 'Hello';

			const contract = new Contract(
				GreeterAbi,
				// {data: GreeterBytecode,} // TODO bug fix https://github.com/web3/web3.js/issues/5473 setting data via options causing this issue
			);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementation((_objInstance, _tx, _block) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toStrictEqual(deployedAddr);
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.data).toBe(
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000',
					);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916)) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const result = await deployedContract.methods.setGreeting(arg).estimateGas(sendOptions);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});

		it('contract method send without contract address should throw error', () => {
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi);

			expect(() => contract.methods.setGreeting(arg).send(sendOptions)).toThrow(
				'Contract address not specified',
			);
		});

		it('contract method send without from address should throw error', () => {
			const gas = '1000000';
			const sendOptionsSpecial = { gas };
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi);
			contract.options.address = '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2';

			/* eslint-disable no-useless-escape */
			expect(() => contract.methods.setGreeting(arg).send(sendOptionsSpecial)).toThrow(
				'Contract "from" address not specified',
			);
		});
	});
});
