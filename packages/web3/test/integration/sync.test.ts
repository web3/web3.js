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

import Web3 from '../../src/index';
import {
	closeOpenConnection,
	describeIf,
	getSystemTestProviderUrl,
	isIpc,
	isSyncTest,
	isWs,
} from '../shared_fixtures/system_tests_utils';

const addPeer = async (web3: Web3, eNode: string) => {
	return web3.requestManager.send({
		method: 'admin_addPeer',
		params: [eNode],
	});
};
const removePeer = async (web3: Web3, eNode: string) => {
	return web3.requestManager.send({
		method: 'admin_removePeer',
		params: [eNode],
	});
};
const minerStart = async (web3: Web3, start: number) => {
	return web3.requestManager.send({
		method: 'miner_start',
		params: [start],
	});
};
const nodeInfo = async (web3: Web3) => {
	return web3.requestManager.send({
		method: 'admin_nodeInfo',
		params: [],
	});
};
const addAccount = async (web3: Web3) => {
	return web3.requestManager.send({
		method: 'personal_newAccount',
		params: ['1234'],
	});
};
describeIf((isIpc || isWs) && isSyncTest)('Sync nodes test', () => {
	let web3Node1: Web3;
	let web3Node2: Web3;
	beforeAll(async () => {
		const providerPath1 = isWs
			? getSystemTestProviderUrl().replace('8545', '18545')
			: getSystemTestProviderUrl().replace('/tmp/ipc', '/tmp/ipc1');
		const providerPath2 = isWs
			? getSystemTestProviderUrl().replace('8545', '28545')
			: getSystemTestProviderUrl().replace('/tmp/ipc', '/tmp/ipc2');

		web3Node1 = new Web3(providerPath1);
		await addAccount(web3Node1);
		web3Node2 = new Web3(providerPath2);
		await addAccount(web3Node2);
	});
	afterAll(async () => {
		await closeOpenConnection(web3Node1);
		await closeOpenConnection(web3Node2);
	});

	describe('Start/end syncing', () => {
		it('should emit start syncing and end syncing events', async () => {
			const subs = await web3Node2.eth.subscribe('syncing');
			const dataPromise = new Promise(resolve => {
				subs.on('data', resolve);
			});
			const syncStartPromise = new Promise(resolve => {
				subs.on('changed', resolve);
			});
			await minerStart(web3Node1, 0);
			const node1Info = await nodeInfo(web3Node1);
			await addPeer(web3Node2, node1Info.enode);
			await minerStart(web3Node1, 1);

			expect(await syncStartPromise).toBe(true);
			await dataPromise;
			const syncEndPromise = new Promise(resolve => {
				subs.on('changed', resolve);
			});
			expect(await syncEndPromise).toBe(false);
			await removePeer(web3Node2, node1Info.enode);
		});
	});
});
