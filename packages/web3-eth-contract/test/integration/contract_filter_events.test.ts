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

import { toBigInt } from 'web3-utils';
import { EventLog } from 'web3-types';
import { Contract } from '../../src';
import { ERC20TokenAbi, ERC20TokenBytecode } from '../shared_fixtures/build/ERC20Token';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import {
	getSystemTestProvider,
	createTempAccount,
	createNewAccount,
	closeOpenConnection,
} from '../fixtures/system_test_utils';

const initialSupply = BigInt('5000000000');

describe('contract getPastEvent filter', () => {
	describe('erc20', () => {
		let contract: Contract<typeof ERC20TokenAbi>;
		let contractDeployed: Contract<typeof ERC20TokenAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let mainAcc: Record<string, string>;
		let toAcc1: Record<string, string>;
		let toAcc2: Record<string, string>;
		let toAcc3: Record<string, string>;

		beforeAll(async () => {
			contract = new Contract(ERC20TokenAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			deployOptions = {
				data: ERC20TokenBytecode,
				arguments: [initialSupply],
			};
			mainAcc = await createTempAccount();
			sendOptions = { from: mainAcc.address, gas: '10000000' };
			contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
			toAcc1 = await createNewAccount();
			toAcc2 = await createNewAccount();
			toAcc3 = await createNewAccount();
			const value = BigInt(10);
			await contractDeployed.methods.transfer(toAcc1.address, value).send(sendOptions);
			await contractDeployed.methods.transfer(toAcc2.address, value).send(sendOptions);
			await contractDeployed.methods.transfer(toAcc3.address, value).send(sendOptions);
		});

		afterAll(async () => {
			await closeOpenConnection(contract);
		});

		it('should filter one event by address with event name and filter param', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents('Transfer', {
				fromBlock: 'earliest',
				filter: {
					to: toAcc2.address,
				},
			})) as unknown as EventLog[];
			expect(res[0]).toBeDefined();
			expect((res[0]?.returnValues?.to as string).toUpperCase()).toBe(
				toAcc2.address.toUpperCase(),
			);
		});
		it('should filter one event by address without event name and filter param', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents({
				fromBlock: 'earliest',
				filter: {
					to: toAcc2.address,
				},
			})) as unknown as EventLog[];
			expect(res[0]).toBeDefined();
			expect((res[0]?.returnValues?.to as string).toUpperCase()).toBe(
				toAcc2.address.toUpperCase(),
			);
		});
		it('should filter one event by address with event name allEvents and filter param', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents('allEvents', {
				fromBlock: 'earliest',
				filter: {
					to: toAcc2.address,
				},
			})) as unknown as EventLog[];
			expect(res[0]).toBeDefined();
			expect((res[0]?.returnValues?.to as string).toUpperCase()).toBe(
				toAcc2.address.toUpperCase(),
			);
		});
		it('should filter few event by addresses array', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents('Transfer', {
				fromBlock: 'earliest',
				filter: {
					to: [toAcc2.address, toAcc3.address],
				},
			})) as unknown as EventLog[];
			expect(res).toHaveLength(2);

			const event2 = res.filter(
				e =>
					String(e.returnValues.to).toUpperCase() ===
					String(toAcc2.address).toUpperCase(),
			)[0];
			const event3 = res.filter(
				e =>
					String(e.returnValues.to).toUpperCase() ===
					String(toAcc3.address).toUpperCase(),
			)[0];

			expect(event2).toBeDefined();
			expect(event3).toBeDefined();
			expect((event2?.returnValues?.to as string).toUpperCase()).toBe(
				toAcc2.address.toUpperCase(),
			);
			expect((event3?.returnValues?.to as string).toUpperCase()).toBe(
				toAcc3.address.toUpperCase(),
			);
		});
		it('should filter few event by addresses array without eventName', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents({
				fromBlock: 'earliest',
				filter: {
					to: [toAcc2.address, toAcc3.address],
				},
			})) as unknown as EventLog[];
			expect(res).toHaveLength(2);

			const event2 = res.filter(
				e =>
					String(e.returnValues.to).toUpperCase() ===
					String(toAcc2.address).toUpperCase(),
			)[0];
			const event3 = res.filter(
				e =>
					String(e.returnValues.to).toUpperCase() ===
					String(toAcc3.address).toUpperCase(),
			)[0];

			expect(event2).toBeDefined();
			expect(event3).toBeDefined();
			expect((event2?.returnValues?.to as string).toUpperCase()).toBe(
				toAcc2.address.toUpperCase(),
			);
			expect((event3?.returnValues?.to as string).toUpperCase()).toBe(
				toAcc3.address.toUpperCase(),
			);
		});
	});

	describe('basic', () => {
		let contract: Contract<typeof BasicAbi>;
		let contractDeployed: Contract<typeof BasicAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let mainAcc: Record<string, string>;

		beforeAll(async () => {
			contract = new Contract(BasicAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			deployOptions = {
				data: BasicBytecode,
				arguments: [123, '123'],
			};
			mainAcc = await createTempAccount();
			sendOptions = { from: mainAcc.address, gas: '10000000' };
			contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
			await contractDeployed.methods
				.firesMultiValueIndexedEvent('str1', 1, true)
				.send(sendOptions);
			await contractDeployed.methods
				.firesMultiValueIndexedEvent('str2', 2, false)
				.send(sendOptions);
			await contractDeployed.methods
				.firesMultiValueIndexedEvent('str3', 3, true)
				.send(sendOptions);
			await contractDeployed.methods
				.firesMultiValueIndexedEventWithStringIndexed('str4', 4, true)
				.send(sendOptions);
		});

		afterAll(async () => {
			await closeOpenConnection(contract);
		});

		it('should filter one event by address with event name and filter param', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents(
				'MultiValueIndexedEvent',
				{
					fromBlock: 'earliest',
					filter: {
						val: 2,
					},
				},
			)) as unknown as EventLog[];
			expect(res[0]).toBeDefined();
			expect(res[0]?.returnValues?.val).toBe(toBigInt(2));
		});
		it('should filter few event by numbers array', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents(
				'MultiValueIndexedEvent',
				{
					fromBlock: 'earliest',
					filter: {
						val: [2, 3],
					},
				},
			)) as unknown as EventLog[];
			expect(res).toHaveLength(2);

			const event2 = res.filter(e => e.returnValues.val === toBigInt(2))[0];
			const event3 = res.filter(e => e.returnValues.val === toBigInt(3))[0];

			expect(event2).toBeDefined();
			expect(event3).toBeDefined();
			expect(event2?.returnValues?.val).toBe(toBigInt(2));
			expect(event3?.returnValues?.val).toBe(toBigInt(3));
		});
		it('should filter few event by bool array', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents(
				'MultiValueIndexedEvent',
				{
					fromBlock: 'earliest',
					filter: {
						flag: [true],
					},
				},
			)) as unknown as EventLog[];
			expect(res).toHaveLength(2);

			const event1 = res.filter(e => e.returnValues.val === toBigInt(1))[0];
			const event3 = res.filter(e => e.returnValues.val === toBigInt(3))[0];

			expect(event1).toBeDefined();
			expect(event3).toBeDefined();
			expect(event1?.returnValues?.val).toBe(toBigInt(1));
			expect(event3?.returnValues?.val).toBe(toBigInt(3));
		});

		it('should filter events using non-indexed string', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents(
				'MultiValueIndexedEvent',
				{
					fromBlock: 'earliest',
					filter: {
						str: 'str2',
					},
				},
			)) as unknown as EventLog[];
			expect(res).toHaveLength(1);

			const event = res[0];
			expect(event).toBeDefined();
			expect(event.returnValues.str).toBe('str2');
			expect(event.returnValues.val).toBe(BigInt(2));
			expect(event.returnValues.flag).toBeFalsy();
		});

		it('should filter events using indexed string', async () => {
			const res: EventLog[] = (await contractDeployed.getPastEvents(
				'MultiValueIndexedEventWithStringIndexed',
				{
					fromBlock: 'earliest',
					filter: {
						str: 'str4',
					},
				},
			)) as unknown as EventLog[];
			expect(res).toHaveLength(1);

			const event = res[0];
			expect(event).toBeDefined();
			expect(event.returnValues.str).toBe(
				'0x3f6d5d7b72c0059e2ecac56fd4adeefb2cff23aa41d13170f78ea6bf81e6e0ca',
			);
			expect(event.returnValues.val).toBe(BigInt(4));
			expect(event.returnValues.flag).toBeTruthy();
		});
	});
});
