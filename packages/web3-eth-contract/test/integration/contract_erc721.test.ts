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

import { Contract } from '../../src';
import { ERC721TokenAbi, ERC721TokenBytecode } from '../shared_fixtures/build/ERC721Token';
import {
	getSystemTestProvider,
	getSystemTestAccounts,
	describeIf,
	isWs,
} from '../fixtures/system_test_utils';
import { processAsync, toUpperCaseHex } from '../shared_fixtures/utils';

describe('contract', () => {
	describe('erc721', () => {
		let contract: Contract<typeof ERC721TokenAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let accounts: string[];

		beforeEach(async () => {
			contract = new Contract(ERC721TokenAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			accounts = await getSystemTestAccounts();

			deployOptions = {
				data: ERC721TokenBytecode,
				arguments: [],
			};

			sendOptions = { from: accounts[0], gas: '10000000' };
		});

		it('should deploy the contract', async () => {
			await expect(contract.deploy(deployOptions).send(sendOptions)).resolves.toBeDefined();
		});

		describe('contract instance', () => {
			beforeEach(async () => {
				contract = await contract.deploy(deployOptions).send(sendOptions);
			});

			describe('methods', () => {
				it('should return the name', async () => {
					expect(await contract.methods.name().call()).toBe('GameItem');
				});

				it('should return the symbol', async () => {
					expect(await contract.methods.symbol().call()).toBe('ITM');
				});

				it('should award item', async () => {
					expect(
						await contract.methods
							.awardItem(accounts[1], 'http://my-nft-uri')
							.send(sendOptions),
					).toBeDefined();

					const logs = await contract.getPastEvents('Transfer');

					// TODO: Type of the getPastEvents are not valid.
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					const { tokenId } = logs[0].returnValues;

					expect(
						toUpperCaseHex(
							(await contract.methods.ownerOf(tokenId).call()) as unknown as string,
						),
					).toBe(toUpperCaseHex(accounts[1]));
				});
			});

			describeIf(isWs)('events', () => {
				it('should emit transfer event', async () => {
					await expect(
						processAsync(async resolve => {
							const event = contract.events.Transfer();
							event.on('data', data => {
								resolve({
									from: toUpperCaseHex(data.returnValues.from as string),
									to: toUpperCaseHex(data.returnValues.to as string),
									tokenId: data.returnValues.tokenId,
								});
							});

							await contract.methods
								.awardItem(accounts[1], 'http://my-nft-uri')
								.send(sendOptions);
						}),
					).resolves.toEqual({
						from: '0x0000000000000000000000000000000000000000',
						to: toUpperCaseHex(accounts[1]),
						tokenId: '0',
					});
				});
			});
		});
	});
});
