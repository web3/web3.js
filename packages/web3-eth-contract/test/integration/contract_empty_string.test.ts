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
import { getSystemTestProvider, createTempAccount } from '../fixtures/system_test_utils';
import { MyContractAbi, MyContractBytecode } from '../fixtures/MyContract';

describe('request empty string from contract', () => {
	let contract: Contract<typeof MyContractAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	beforeAll(async () => {
		contract = new Contract(MyContractAbi, undefined, {
			provider: getSystemTestProvider(),
		});
		const acc = await createTempAccount();

		deployOptions = {
			data: MyContractBytecode,
			arguments: [],
		};

		sendOptions = { from: acc.address, gas: '1000000' };
	});

	it('should fetch empty string', async () => {
		const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

		const attribute = await deployedContract.methods.getAttr().call();

		expect(attribute).toHaveLength(0);
		expect(attribute).toBe('');
	});
});
