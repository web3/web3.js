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

// eslint-disable-next-line import/no-extraneous-dependencies
import Web3 from 'web3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3Account } from 'web3-eth-accounts';
import { Contract } from '../../../src';
import { ERC721TokenAbi, ERC721TokenBytecode } from '../../shared_fixtures/build/ERC721Token';
import { getSystemTestProvider, createLocalAccount } from '../../fixtures/system_test_utils';
import { toUpperCaseHex } from '../../shared_fixtures/utils';

describe('contract', () => {
	describe('erc721', () => {
		let contract: Contract<typeof ERC721TokenAbi>;
		let sendOptions: Record<string, unknown>;
		let deployOptions: Record<string, unknown>;
		let localAccount: Web3Account;
		let web3: Web3;
		let contractDeployed: Contract<typeof ERC721TokenAbi>;
		beforeAll(async () => {
			web3 = new Web3(getSystemTestProvider());
			localAccount = await createLocalAccount(web3);
			contract = new web3.eth.Contract(ERC721TokenAbi) as unknown as Contract<
				typeof ERC721TokenAbi
			>;

			deployOptions = {
				data: ERC721TokenBytecode,
				arguments: [],
			};

			sendOptions = {
				from: localAccount.address,
				gas: '1000000',
			};
			contractDeployed = await contract
				.deploy(deployOptions)
				.send({ ...sendOptions, gas: '3000000' });
		});

		it('should deploy the contract', () => {
			expect(contractDeployed.options.address).toBeDefined();
		});

		it.each(['0x1', '0x2'])('should award item %p', async type => {
			const tempAccount = web3.eth.accounts.create();
			const awardReceipt = await contractDeployed.methods
				.awardItem(tempAccount.address, 'http://my-nft-uri')
				.send({ ...sendOptions, type });
			expect(awardReceipt.events).toBeDefined();
			expect(awardReceipt.events?.Transfer).toBeDefined();
			expect(awardReceipt.events?.Transfer.event).toBe('Transfer');

			expect(String(awardReceipt.events?.Transfer.returnValues.from).toLowerCase()).toBe(
				'0x0000000000000000000000000000000000000000',
			);
			expect(String(awardReceipt.events?.Transfer.returnValues[0]).toLowerCase()).toBe(
				'0x0000000000000000000000000000000000000000',
			);
			expect(String(awardReceipt.events?.Transfer.returnValues.to).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);
			expect(String(awardReceipt.events?.Transfer.returnValues[1]).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);

			const tokenId = awardReceipt.events?.Transfer.returnValues?.tokenId as string;

			expect(
				toUpperCaseHex(
					(await contractDeployed.methods.ownerOf(tokenId).call()) as unknown as string,
				),
			).toBe(toUpperCaseHex(tempAccount.address));
		});

		it.each(['0x1', '0x2'])('should transferFrom item %p', async type => {
			const tempAccount = await createLocalAccount(web3);
			const toAccount = await createLocalAccount(web3);
			const awardReceipt = await contractDeployed.methods
				.awardItem(tempAccount.address, 'http://my-nft-award')
				.send({ ...sendOptions, type });
			expect(awardReceipt.events).toBeDefined();
			expect(awardReceipt.events?.Transfer).toBeDefined();
			expect(awardReceipt.events?.Transfer.event).toBe('Transfer');

			expect(String(awardReceipt.events?.Transfer.returnValues.from).toLowerCase()).toBe(
				'0x0000000000000000000000000000000000000000',
			);
			expect(String(awardReceipt.events?.Transfer.returnValues[0]).toLowerCase()).toBe(
				'0x0000000000000000000000000000000000000000',
			);
			expect(String(awardReceipt.events?.Transfer.returnValues.to).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);
			expect(String(awardReceipt.events?.Transfer.returnValues[1]).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);

			const tokenId = awardReceipt.events?.Transfer.returnValues?.tokenId as string;
			const transferFromReceipt = await contractDeployed.methods
				.transferFrom(tempAccount.address, toAccount.address, tokenId)
				.send({
					...sendOptions,
					type,
					from: tempAccount.address,
				});
			expect(transferFromReceipt.events).toBeDefined();
			expect(transferFromReceipt.events?.Transfer).toBeDefined();
			expect(transferFromReceipt.events?.Transfer.event).toBe('Transfer');
			expect(
				String(transferFromReceipt.events?.Transfer.returnValues.from).toLowerCase(),
			).toBe(tempAccount.address.toLowerCase());
			expect(String(transferFromReceipt.events?.Transfer.returnValues[0]).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);
			expect(String(transferFromReceipt.events?.Transfer.returnValues.to).toLowerCase()).toBe(
				toAccount.address.toLowerCase(),
			);
			expect(String(transferFromReceipt.events?.Transfer.returnValues[1]).toLowerCase()).toBe(
				toAccount.address.toLowerCase(),
			);
			expect(transferFromReceipt.events?.Transfer.returnValues.tokenId).toBe(tokenId);
			expect(transferFromReceipt.events?.Transfer.returnValues[2]).toBe(tokenId);

			expect(transferFromReceipt.events?.Approval).toBeDefined();
			expect(transferFromReceipt.events?.Approval.event).toBe('Approval');
			expect(
				String(transferFromReceipt.events?.Approval.returnValues.owner).toLowerCase(),
			).toBe(tempAccount.address.toLowerCase());
			expect(String(transferFromReceipt.events?.Approval.returnValues[0]).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);
			expect(
				String(transferFromReceipt.events?.Approval.returnValues.approved).toLowerCase(),
			).toBe('0x0000000000000000000000000000000000000000');
			expect(String(transferFromReceipt.events?.Approval.returnValues[1]).toLowerCase()).toBe(
				'0x0000000000000000000000000000000000000000',
			);
			expect(transferFromReceipt.events?.Approval.returnValues.tokenId).toBe(tokenId);
			expect(transferFromReceipt.events?.Approval.returnValues[2]).toBe(tokenId);

			expect(
				toUpperCaseHex(
					(await contractDeployed.methods.ownerOf(tokenId).call()) as unknown as string,
				),
			).toBe(toUpperCaseHex(toAccount.address));
		});

		it.each(['0x1', '0x2'])('should approve and then transferFrom item %p', async type => {
			const tempAccount = await createLocalAccount(web3);
			const toAccount = await createLocalAccount(web3);
			const awardReceipt = await contractDeployed.methods
				.awardItem(tempAccount.address, 'http://my-nft-award')
				.send({ ...sendOptions, type });
			expect(awardReceipt.events).toBeDefined();
			expect(awardReceipt.events?.Transfer).toBeDefined();
			expect(awardReceipt.events?.Transfer.event).toBe('Transfer');
			expect(String(awardReceipt.events?.Transfer.returnValues.from).toLowerCase()).toBe(
				'0x0000000000000000000000000000000000000000',
			);
			expect(String(awardReceipt.events?.Transfer.returnValues[0]).toLowerCase()).toBe(
				'0x0000000000000000000000000000000000000000',
			);
			expect(String(awardReceipt.events?.Transfer.returnValues.to).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);
			expect(String(awardReceipt.events?.Transfer.returnValues[1]).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);

			const tokenId = awardReceipt.events?.Transfer.returnValues?.tokenId as string;

			const approveReceipt = await contractDeployed.methods
				.approve(toAccount.address, tokenId)
				.send({
					...sendOptions,
					type,
					from: tempAccount.address,
				});
			expect(approveReceipt.events).toBeDefined();
			expect(approveReceipt.events?.Approval).toBeDefined();
			expect(approveReceipt.events?.Approval.event).toBe('Approval');
			expect(String(approveReceipt.events?.Approval.returnValues.owner).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);
			expect(String(approveReceipt.events?.Approval.returnValues[0]).toLowerCase()).toBe(
				tempAccount.address.toLowerCase(),
			);
			expect(
				String(approveReceipt.events?.Approval.returnValues.approved).toLowerCase(),
			).toBe(toAccount.address.toLowerCase());
			expect(String(approveReceipt.events?.Approval.returnValues[1]).toLowerCase()).toBe(
				toAccount.address.toLowerCase(),
			);
			expect(approveReceipt.events?.Approval.returnValues.tokenId).toBe(tokenId);
			expect(approveReceipt.events?.Approval.returnValues[2]).toBe(tokenId);

			const res = await contractDeployed.methods.getApproved(tokenId).call();
			expect(res.toString().toUpperCase()).toBe(toAccount.address.toUpperCase());

			const safeTransferFromReceipt = await contractDeployed.methods
				.safeTransferFrom(tempAccount.address, toAccount.address, tokenId)
				.send({
					...sendOptions,
					type,
					from: toAccount.address,
				});

			expect(safeTransferFromReceipt.events).toBeDefined();
			expect(safeTransferFromReceipt.events?.Transfer).toBeDefined();
			expect(safeTransferFromReceipt.events?.Transfer.event).toBe('Transfer');
			expect(safeTransferFromReceipt.events?.Approval).toBeDefined();
			expect(safeTransferFromReceipt.events?.Approval.event).toBe('Approval');

			expect(
				String(safeTransferFromReceipt.events?.Transfer.returnValues.from).toLowerCase(),
			).toBe(tempAccount.address.toLowerCase());
			expect(
				String(safeTransferFromReceipt.events?.Transfer.returnValues[0]).toLowerCase(),
			).toBe(tempAccount.address.toLowerCase());
			expect(
				String(safeTransferFromReceipt.events?.Transfer.returnValues.to).toLowerCase(),
			).toBe(toAccount.address.toLowerCase());
			expect(
				String(safeTransferFromReceipt.events?.Transfer.returnValues[1]).toLowerCase(),
			).toBe(toAccount.address.toLowerCase());
			expect(safeTransferFromReceipt.events?.Transfer.returnValues.tokenId).toBe(tokenId);
			expect(safeTransferFromReceipt.events?.Transfer.returnValues[2]).toBe(tokenId);

			expect(
				String(safeTransferFromReceipt.events?.Approval.returnValues.owner).toLowerCase(),
			).toBe(tempAccount.address.toLowerCase());
			expect(
				String(safeTransferFromReceipt.events?.Approval.returnValues[0]).toLowerCase(),
			).toBe(tempAccount.address.toLowerCase());
			expect(
				String(
					safeTransferFromReceipt.events?.Approval.returnValues.approved,
				).toLowerCase(),
			).toBe('0x0000000000000000000000000000000000000000');
			expect(
				String(safeTransferFromReceipt.events?.Approval.returnValues[1]).toLowerCase(),
			).toBe('0x0000000000000000000000000000000000000000');
			expect(safeTransferFromReceipt.events?.Approval.returnValues.tokenId).toBe(tokenId);
			expect(safeTransferFromReceipt.events?.Approval.returnValues[2]).toBe(tokenId);

			expect(
				toUpperCaseHex(
					(await contractDeployed.methods.ownerOf(tokenId).call()) as unknown as string,
				),
			).toBe(toUpperCaseHex(toAccount.address));
		});

		it.each(['0x1', '0x2'])(
			'should set approve for all item with local wallet %p',
			async type => {
				const tempAccount = await createLocalAccount(web3);
				const toAccount = await createLocalAccount(web3);

				const setApprovalReceipt = await contractDeployed.methods
					.setApprovalForAll(toAccount.address, true)
					.send({
						...sendOptions,
						type,
						from: tempAccount.address,
					});
				expect(setApprovalReceipt.events).toBeDefined();
				expect(setApprovalReceipt.events?.ApprovalForAll).toBeDefined();
				expect(setApprovalReceipt.events?.ApprovalForAll.event).toBe('ApprovalForAll');

				expect(
					String(
						setApprovalReceipt.events?.ApprovalForAll.returnValues.owner,
					).toLowerCase(),
				).toBe(tempAccount.address.toLowerCase());
				expect(
					String(setApprovalReceipt.events?.ApprovalForAll.returnValues[0]).toLowerCase(),
				).toBe(tempAccount.address.toLowerCase());
				expect(
					String(
						setApprovalReceipt.events?.ApprovalForAll.returnValues.operator,
					).toLowerCase(),
				).toBe(toAccount.address.toLowerCase());
				expect(
					String(setApprovalReceipt.events?.ApprovalForAll.returnValues[1]).toLowerCase(),
				).toBe(toAccount.address.toLowerCase());
				expect(setApprovalReceipt.events?.ApprovalForAll.returnValues.approved).toBe(true);
				expect(setApprovalReceipt.events?.ApprovalForAll.returnValues[2]).toBe(true);

				expect(
					await contractDeployed.methods
						.isApprovedForAll(tempAccount.address, toAccount.address)
						.call(),
				).toBe(true);

				const setApprovalForAllReceipt = await contractDeployed.methods
					.setApprovalForAll(toAccount.address, false)
					.send({
						...sendOptions,
						type,
						from: tempAccount.address,
					});
				expect(setApprovalForAllReceipt.events).toBeDefined();
				expect(setApprovalForAllReceipt.events?.ApprovalForAll).toBeDefined();
				expect(setApprovalForAllReceipt.events?.ApprovalForAll.event).toBe(
					'ApprovalForAll',
				);
				expect(
					String(
						setApprovalForAllReceipt.events?.ApprovalForAll.returnValues.owner,
					).toLowerCase(),
				).toBe(tempAccount.address.toLowerCase());
				expect(
					String(
						setApprovalForAllReceipt.events?.ApprovalForAll.returnValues[0],
					).toLowerCase(),
				).toBe(tempAccount.address.toLowerCase());
				expect(
					String(
						setApprovalForAllReceipt.events?.ApprovalForAll.returnValues.operator,
					).toLowerCase(),
				).toBe(toAccount.address.toLowerCase());
				expect(
					String(
						setApprovalForAllReceipt.events?.ApprovalForAll.returnValues[1],
					).toLowerCase(),
				).toBe(toAccount.address.toLowerCase());
				expect(setApprovalForAllReceipt.events?.ApprovalForAll.returnValues.approved).toBe(
					false,
				);
				expect(setApprovalForAllReceipt.events?.ApprovalForAll.returnValues[2]).toBe(false);
				expect(
					await contractDeployed.methods
						.isApprovedForAll(tempAccount.address, toAccount.address)
						.call(),
				).toBe(false);
			},
		);
	});
});
