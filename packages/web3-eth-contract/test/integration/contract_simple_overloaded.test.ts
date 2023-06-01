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
import Contract from '../../src';
import { SimpleOverloadedAbi, SimpleOverloadedBytecode } from '../fixtures/SimpleOverloaded';
import { createTempAccount, getSystemTestProvider } from '../fixtures/system_test_utils';

describe('SimpleOverloaded', () => {
	let contract: Contract<typeof SimpleOverloadedAbi>;
	let mainAcc: { address: string; privateKey: string };
	let contractDeployed: Contract<typeof SimpleOverloadedAbi>;

	beforeAll(async () => {
		mainAcc = await createTempAccount();
		contract = new Contract(SimpleOverloadedAbi, undefined, {
			provider: getSystemTestProvider(),
		});
		contractDeployed = await contract
			.deploy({
				data: SimpleOverloadedBytecode,
			})
			.send({ from: mainAcc.address, gas: '10000000' });
	});

	it('should call getSecret with no args', async () => {
		const response = await contractDeployed.methods.getSecret().call();
		expect(response).toBe(BigInt(42));
	});

	it('should call getSecret with one args', async () => {
		const response = await contractDeployed.methods.getSecret(42).call();
		expect(response).toBe(BigInt(84));
	});

	it('should call getSecret with two args', async () => {
		const response = await contractDeployed.methods.getSecret(42, 'some string').call();
		expect(response).toStrictEqual({ '0': BigInt(84), '1': 'some string', __length__: 2 });
	});

	it('should send setSecret with no args', async () => {
		const transactionReceipt = await contractDeployed.methods
			.setSecret()
			.send({ from: mainAcc.address, gas: '10000000' });
		expect(transactionReceipt.status).toBe(BigInt(1));

		const response = await contractDeployed.methods.getSecret(42, 'some string').call();
		expect(response).toStrictEqual({ '0': BigInt(84), '1': 'some string', __length__: 2 });
	});

	it('should send setSecret with one args', async () => {
		const transactionReceipt = await contractDeployed.methods
			.setSecret(42)
			.send({ from: mainAcc.address, gas: '10000000' });
		expect(transactionReceipt.status).toBe(BigInt(1));

		const response = await contractDeployed.methods.getSecret(42, 'some string').call();
		expect(response).toStrictEqual({ '0': BigInt(126), '1': 'some string', __length__: 2 });
	});

	it('should send setSecret with two args', async () => {
		const transactionReceipt = await contractDeployed.methods
			.setSecret(42, 'more string')
			.send({ from: mainAcc.address, gas: '10000000' });
		expect(transactionReceipt.status).toBe(BigInt(1));

		const response = await contractDeployed.methods.getSecret(42, 'some string').call();
		expect(response).toStrictEqual({
			'0': BigInt(168),
			'1': 'more stringsome string',
			__length__: 2,
		});
	});

	it('should send multicall with one arg', async () => {
		const transactionReceipt = await contractDeployed.methods
			.multicall(['0x5b9fdc30', '0x5b9fdc30', '0x5b9fdc30'])
			.send({ from: mainAcc.address, gas: '10000000' });
		expect(transactionReceipt.status).toBe(BigInt(1));
	});

	it('should send multicall with two args', async () => {
		const transactionReceipt = await contractDeployed.methods
			.multicall(99999999999, ['0x5b9fdc30', '0x5b9fdc30', '0x5b9fdc30'])
			.send({ from: mainAcc.address, gas: '10000000' });
		expect(transactionReceipt.status).toBe(BigInt(1));
	});
});
