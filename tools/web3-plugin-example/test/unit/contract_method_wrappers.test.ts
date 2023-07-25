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
import Web3 from 'web3';
import { DEFAULT_RETURN_FORMAT } from 'web3-types';

import { ContractMethodWrappersPlugin } from '../../src/contract_method_wrappers';
import { ERC20TokenAbi } from '../../src/ERC20Token';

declare module '../web3_export_helper' {
	interface Web3 {
		contractMethodWrappersPlugin: ContractMethodWrappersPlugin;
	}
}

describe('ContractMethodWrappersPlugin', () => {
	it('should register the plugin', () => {
		const web3 = new Web3('http://127.0.0.1:8545');
		web3.registerPlugin(
			new ContractMethodWrappersPlugin(
				ERC20TokenAbi,
				'0xdAC17F958D2ee523a2206206994597C13D831ec7',
			),
		);
		expect(web3.contractMethodWrappersPlugin).toBeDefined();
	});

	describe('methods', () => {
		const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
		const sender = '0x8da5e39ec14b57fb9bcd9aa2b4500e909119795d';
		const recipient = '0x4f641def1e7845caab95ac717c80416082430d0d';
		const amount = BigInt(42);
		const expectedSenderBalance =
			'0x0000000000000000000000000000000000000000000000000000000000000280';
		const expectedRecipientBalance =
			'0x0000000000000000000000000000000000000000000000000000000000000120';
		let requestManagerSendSpy: jest.Mock;

		let web3: Web3;

		beforeAll(() => {
			web3 = new Web3('http://127.0.0.1:8545');
			web3.registerPlugin(new ContractMethodWrappersPlugin(ERC20TokenAbi, contractAddress));
		});

		beforeEach(() => {
			requestManagerSendSpy = jest.fn();
			web3.contractMethodWrappersPlugin._contract.requestManager.send = requestManagerSendSpy;
		});

		it('should call `getFormattedBalance` with expected RPC object', async () => {
			requestManagerSendSpy.mockResolvedValueOnce(expectedSenderBalance);

			await web3.contractMethodWrappersPlugin.getFormattedBalance(
				sender,
				DEFAULT_RETURN_FORMAT,
			);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_call',
				params: [
					expect.objectContaining({
						input: '0x70a082310000000000000000000000008da5e39ec14b57fb9bcd9aa2b4500e909119795d',
						to: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
					}),
					'latest',
				],
			});
		});

		it('should call `transferAndGetBalances` with expected RPC object', async () => {
			const mockBlockData = {
				parentHash: '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
				sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
				miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
				stateRoot: '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
				transactionsRoot:
					'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				difficulty: '0x4ea3f27bc',
				number: '0x1b4',
				gasLimit: '0x1388',
				gasUsed: '0x1c96e73',
				timestamp: '0x55ba467c',
				extraData: '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
				mixHash: '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
				nonce: '0x1c11920a4',
				totalDifficulty: '0x78ed983323d',
				size: '0x220',
				transactions: [
					'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
					'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
					'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
				],
				uncles: [
					'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
					'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
					'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
				],
				hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			};
			const expectedGasPrice = '0x1ca14bd70';
			const expectedTransactionHash =
				'0xc41b9a4f654c44552e135f770945916f57c069b80326f9a5f843e613491ab6b1';

			requestManagerSendSpy.mockResolvedValueOnce(mockBlockData);
			requestManagerSendSpy.mockResolvedValueOnce(expectedGasPrice);
			// Mocking block number for trySendTransaction call
			requestManagerSendSpy.mockResolvedValueOnce('0x1');
			requestManagerSendSpy.mockResolvedValueOnce(expectedTransactionHash);
			// Mocking response for getTransactionReceipt for waitForTransactionReceipt
			requestManagerSendSpy.mockResolvedValueOnce({});
			// Mocking getBlockNumber for waitForTransactionReceipt
			requestManagerSendSpy.mockResolvedValueOnce('0x2');
			requestManagerSendSpy.mockResolvedValueOnce(expectedSenderBalance);
			requestManagerSendSpy.mockResolvedValueOnce(expectedRecipientBalance);

			const balances = await web3.contractMethodWrappersPlugin.transferAndGetBalances(
				sender,
				recipient,
				amount,
			);
			// The first call will be to `eth_gasPrice` and the second is to `eth_blockNumber`. And the third one will be to `eth_sendTransaction`:
			expect(requestManagerSendSpy).toHaveBeenNthCalledWith(4, {
				method: 'eth_sendTransaction',
				params: [
					expect.objectContaining({
						input: '0xa9059cbb0000000000000000000000004f641def1e7845caab95ac717c80416082430d0d000000000000000000000000000000000000000000000000000000000000002a',
						from: sender,
						gasPrice: expectedGasPrice,
						maxFeePerGas: undefined,
						maxPriorityFeePerGas: undefined,
						to: contractAddress,
					}),
				],
			});

			expect(balances).toStrictEqual({
				sender: {
					address: sender,
					balance: BigInt(expectedSenderBalance),
				},
				recipient: {
					address: recipient,
					balance: BigInt(expectedRecipientBalance),
				},
			});
		});
	});
});
