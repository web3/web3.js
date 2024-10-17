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
import { GreeterBytecode, GreeterAbi } from '../shared_fixtures/build/Greeter';
import {
	getSystemTestProvider,
	createTempAccount,
	describeIf,
	getSystemTestBackend,
	BACKEND,
	closeOpenConnection,
} from '../fixtures/system_test_utils';

describe('contract', () => {
	describeIf(getSystemTestBackend() === BACKEND.GETH)('createAccessList', () => {
		let contract: Contract<typeof GreeterAbi>;
		let deployedContract: Contract<typeof GreeterAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let acc: { address: string; privateKey: string };

		beforeAll(async () => {
			contract = new Contract(GreeterAbi, undefined, {
				provider: getSystemTestProvider(),
			});
			acc = await createTempAccount();

			deployOptions = {
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			};

			sendOptions = { from: acc.address, gas: '1000000' };
		});

		afterAll(async () => {
			await closeOpenConnection(contract);
		});

		beforeEach(async () => {
			deployedContract = await contract.deploy(deployOptions).send(sendOptions);
			deployedContract.defaultAccount = acc.address;
		});

		it('create access list for setter', async () => {
			const receipt = await deployedContract.methods
				.setGreeting('New Greeting')
				.send({ gas: '1000000' });
			expect(receipt.from).toEqual(acc.address);

			const accessList = await deployedContract.methods
				.setGreeting('New Greeting')
				.createAccessList();

			const accessListResult = {
				accessList: [
					{
						address: deployedContract.options.address?.toLowerCase(),
						storageKeys: [
							'0x0000000000000000000000000000000000000000000000000000000000000001',
						],
					},
				],
				gasUsed: '0x866b',
			};

			expect(accessList).toStrictEqual(accessListResult);
		});

		it('create access list for getter', async () => {
			const receipt = await deployedContract.methods
				.setGreeting('New Greeting')
				.send({ gas: '1000000' });
			expect(receipt.from).toEqual(acc.address);

			const accessList = await deployedContract.methods.greet().createAccessList();

			const accessListResult = {
				accessList: [
					{
						address: deployedContract.options.address?.toLowerCase(),
						storageKeys: [
							'0x0000000000000000000000000000000000000000000000000000000000000001',
						],
					},
				],
				gasUsed: '0x68ab',
			};

			expect(accessList).toStrictEqual(accessListResult);
		});
	});
});
