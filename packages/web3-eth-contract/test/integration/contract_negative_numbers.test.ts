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
import { createTempAccount, getSystemTestProvider } from '../fixtures/system_test_utils';
import {
	NegativeNumbersAbi,
	NegativeNumbersBytecode,
} from '../shared_fixtures/build/NegativeNumbers';

describe('Contract - NegativeNumbers.sol', () => {
	const storedNegativeNumber = '-170141183460469231731687303715884105727';

	let contract: Contract<typeof NegativeNumbersAbi>;
	let contractDeployed: Contract<typeof NegativeNumbersAbi>;
	let account: Record<string, string>;
	let sendOptions: Record<string, string>;

	beforeAll(async () => {
		contract = new Contract(NegativeNumbersAbi, undefined, {
			provider: getSystemTestProvider(),
		});
		account = await createTempAccount();

		const deployOptions: Record<string, unknown> = {
			data: NegativeNumbersBytecode,
			arguments: [storedNegativeNumber],
		};
		sendOptions = {
			from: account.address,
			gas: '1000000',
		};

		contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
	});

	it('should retrieve storedNegativeNumber', async () => {
		const response = await contractDeployed.methods.storedNegativeNumber().call();
		expect(response).toBe(BigInt(storedNegativeNumber));
	});

	it('should return storedNegativeNumber when calling oneNegativeNumber(storedNegativeNumber)', async () => {
		const transactionReceipt = await contractDeployed.methods
			.oneNegativeNumber(storedNegativeNumber)
			.send(sendOptions);

		expect(transactionReceipt.logs).toMatchObject([
			{
				topics: ['0x5b53dc4e9e8fa2416d4e172bdad04be5a6d622643bc9ef45987b2caadd0d0c95'],
				data: '0xffffffffffffffffffffffffffffffff80000000000000000000000000000001',
			},
			{
				topics: [
					'0x33e7dccd3899498f4408d6468e5dfad650f32574dba2ec4f13399a82e62166d5',
					'0xffffffffffffffffffffffffffffffff80000000000000000000000000000001',
				],
				data: '0x',
			},
		]);
	});

	it('should return storedNegativeNumber when calling twoNegativeNumbers(storedNegativeNumber, secondNegativeNumber)', async () => {
		const secondNegativeNumber =
			'-17014118346046923173168730371588410572712039182039812039812098312';

		const transactionReceipt = await contractDeployed.methods
			.twoNegativeNumbers(storedNegativeNumber, secondNegativeNumber)
			.send(sendOptions);

		expect(transactionReceipt.logs).toMatchObject([
			{
				topics: ['0xfaa997e4b16dcde196bbb99868e16fa934a0b4c1f019e494d9fbffb5abc46fc2'],
				data: '0xffffffffffffffffffffffffffffffff80000000000000000000000000000001ffffffffffd6a416919bf9968e000000000000000048c26d7f0da3fa91bf56f8',
			},
			{
				topics: [
					'0x0204c97becd72594486cf753e30e8acfc9951ee663e404bc858e3d10b80da99b',
					'0xffffffffffffffffffffffffffffffff80000000000000000000000000000001',
					'0xffffffffffd6a416919bf9968e000000000000000048c26d7f0da3fa91bf56f8',
				],
				data: '0x',
			},
		]);
	});

	it('should return storedNegativeNumber when calling otherNegativeNumbers(storedNegativeNumber, secondNegativeNumber)', async () => {
		const secondNegativeNumber =
			'-17014118346046923173168730371588410572712039182039812039812098312';

		const transactionReceipt = await contractDeployed.methods
			.otherNegativeNumbers(storedNegativeNumber, secondNegativeNumber, 'fooBar')
			.send(sendOptions);

		expect(transactionReceipt.logs).toMatchObject([
			{
				topics: ['0x2e1fb99ee1b27b6491b2d46a54ac8daca82f2da6810e4b8eed4d634f78fa6948'],
				data: '0xffffffffffffffffffffffffffffffff80000000000000000000000000000001ffffffffffd6a416919bf9968e000000000000000048c26d7f0da3fa91bf56f800000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006666f6f4261720000000000000000000000000000000000000000000000000000',
			},
			{
				topics: [
					'0x0e29b573959c1b6ffd5e16886385ec1732e187cc5ac10e8faceb5e02a1c7b50b',
					'0xffffffffffffffffffffffffffffffff80000000000000000000000000000001',
					'0xffffffffffd6a416919bf9968e000000000000000048c26d7f0da3fa91bf56f8',
				],
				data: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000006666f6f4261720000000000000000000000000000000000000000000000000000',
			},
		]);
	});
});
