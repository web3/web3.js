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
	describeIf,
	isWs,
	createTempAccount,
} from '../fixtures/system_test_utils';
import { processAsync, toUpperCaseHex } from '../shared_fixtures/utils';

describe('contract', () => {
	describe('erc721', () => {
		let contract: Contract<typeof ERC721TokenAbi>;
		let contractDeployed: Contract<typeof ERC721TokenAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;

		beforeAll(async () => {
			contract = new Contract(ERC721TokenAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			const acc = await createTempAccount();

			deployOptions = {
				data: ERC721TokenBytecode,
				arguments: [],
			};
			sendOptions = { from: acc.address, gas: '10000000' };
		});

		it('should deploy the contract', async () => {
			await expect(contract.deploy(deployOptions).send(sendOptions)).resolves.toBeDefined();
		});

		describe('contract instance', () => {
			let acc: { address: string; privateKey: string };
			let acc2: { address: string; privateKey: string };
			beforeEach(async () => {
				acc = await createTempAccount();
				acc2 = await createTempAccount();
				sendOptions = { from: acc.address, gas: '10000000' };
				contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
			});

			describe('methods', () => {
				it('should return the name', async () => {
					expect(await contractDeployed.methods.name().call()).toBe('GameItem');
				});

				it('should return the symbol', async () => {
					expect(await contractDeployed.methods.symbol().call()).toBe('ITM');
				});

				it('should award item', async () => {
					const acc3 = await createTempAccount();
					await contractDeployed.methods
						.awardItem(acc3.address, 'http://my-nft-uri')
						.send(sendOptions);

					const logs = await contractDeployed.getPastEvents('Transfer');
					// TODO: Type of the getPastEvents are not valid.
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					const tokenId = logs[0]?.returnValues?.tokenId;

					expect(
						toUpperCaseHex(
							(await contractDeployed.methods
								.ownerOf(tokenId)
								.call()) as unknown as string,
						),
					).toBe(toUpperCaseHex(acc3.address));
				});
			});

			describeIf(isWs)('events', () => {
				it('should emit transfer event', async () => {
					await expect(
						processAsync(async resolve => {
							const event = contractDeployed.events.Transfer();
							event.on('data', data => {
								resolve({
									from: toUpperCaseHex(data.returnValues.from as string),
									to: toUpperCaseHex(data.returnValues.to as string),
									tokenId: data.returnValues.tokenId,
								});
							});

							await contractDeployed.methods
								.awardItem(acc2.address, 'http://my-nft-uri')
								.send(sendOptions);
						}),
					).resolves.toEqual({
						from: '0x0000000000000000000000000000000000000000',
						to: toUpperCaseHex(acc2.address),
						tokenId: '0',
					});
				});
			});
		});
	});
});
