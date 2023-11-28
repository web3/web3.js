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
						data: '0x70a082310000000000000000000000008da5e39ec14b57fb9bcd9aa2b4500e909119795d',
						to: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
					}),
					'latest',
				],
			});
		});

		it('should call `transferAndGetBalances` with expected RPC object', async () => {
			const expectedGasPrice = '0x1ca14bd70';
			const expectedTransactionHash =
				'0xc41b9a4f654c44552e135f770945916f57c069b80326f9a5f843e613491ab6b1';

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
			expect(requestManagerSendSpy).toHaveBeenNthCalledWith(3, {
				method: 'eth_sendTransaction',
				params: [
					expect.objectContaining({
						data: '0xa9059cbb0000000000000000000000004f641def1e7845caab95ac717c80416082430d0d000000000000000000000000000000000000000000000000000000000000002a',
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
