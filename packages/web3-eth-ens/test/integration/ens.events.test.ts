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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Contract, PayableTxOptions } from 'web3-eth-contract';
import { sha3, DEFAULT_RETURN_FORMAT } from 'web3-utils';
import { getBlock } from 'web3-eth';

import { Address, Bytes } from 'web3-types';
import { ENS } from '../../src';
import { namehash } from '../../src/utils';

import {
	getSystemTestAccounts,
	getSystemTestProvider,
	isWs,
	isIpc,
	closeOpenConnection,
	isSocket,
	describeIf,
} from '../fixtures/system_tests_utils';

import { ENSRegistryAbi } from '../../src/abi/ens/ENSRegistry';
import { ENSRegistryBytecode } from '../fixtures/ens/bytecode/ENSRegistryBytecode';
import { NameWrapperAbi } from '../fixtures/ens/abi/NameWrapper';
import { NameWrapperBytecode } from '../fixtures/ens/bytecode/NameWrapperBytecode';
import { PublicResolverAbi } from '../../src/abi/ens/PublicResolver';
import { PublicResolverBytecode } from '../fixtures/ens/bytecode/PublicResolverBytecode';

describeIf(isSocket)('ens events', () => {
	let registry: Contract<typeof ENSRegistryAbi>;
	let resolver: Contract<typeof PublicResolverAbi>;
	let nameWrapper: Contract<typeof NameWrapperAbi>;

	type ResolverContract = Contract<typeof PublicResolverAbi>;

	let Resolver: ResolverContract;
	let setEnsResolver: ResolverContract;
	let getEnsResolver: ResolverContract;

	let sendOptions: PayableTxOptions;

	const domain = 'test';
	const node = namehash('resolver');
	const label = sha3('resolver') as string;

	const web3jsName = 'web3js.test';

	const ttl = 3600;

	let accounts: string[];
	let ens: ENS;
	let defaultAccount: string;
	let accountOne: string;

	const ZERO_NODE: Bytes = '0x0000000000000000000000000000000000000000000000000000000000000000';
	const addressOne: Address = '0x0000000000000000000000000000000000000001';

	beforeAll(async () => {
		accounts = await getSystemTestAccounts();

		[defaultAccount, accountOne] = accounts;

		sendOptions = { from: defaultAccount, gas: '10000000' };

		const Registry = new Contract(ENSRegistryAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		const NameWrapper = new Contract(NameWrapperAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		Resolver = new Contract(PublicResolverAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		registry = await Registry.deploy({ data: ENSRegistryBytecode }).send(sendOptions);

		nameWrapper = await NameWrapper.deploy({ data: NameWrapperBytecode }).send(sendOptions);

		resolver = await Resolver.deploy({
			data: PublicResolverBytecode,
			arguments: [
				registry.options.address as string,
				nameWrapper.options.address as string,
				accountOne,
				defaultAccount,
			],
		}).send(sendOptions);

		await registry.methods.setSubnodeOwner(ZERO_NODE, label, defaultAccount).send(sendOptions);
		await registry.methods
			.setResolver(node, resolver.options.address as string)
			.send(sendOptions);
		await resolver.methods.setAddr(node, addressOne).send(sendOptions);

		await registry.methods
			.setSubnodeOwner(ZERO_NODE, sha3(domain) as string, defaultAccount)
			.send(sendOptions);

		const clientUrl = getSystemTestProvider();
		let provider;
		if (isIpc) provider = new ENS.providers.IpcProvider(clientUrl);
		else if (isWs) provider = new ENS.providers.WebsocketProvider(clientUrl);
		else provider = new ENS.providers.HttpProvider(clientUrl);

		ens = new ENS(registry.options.address, provider);

		const block = await getBlock(ens, 'latest', false, DEFAULT_RETURN_FORMAT);
		const gas = block.gasLimit.toString();

		// Increase gas for contract calls
		sendOptions = {
			...sendOptions,
			gas,
		};
	});

	afterAll(async () => {
		await closeOpenConnection(ens);
		// @ts-expect-error @typescript-eslint/ban-ts-comment
		await closeOpenConnection(ens?._registry?.contract);
		await closeOpenConnection(getEnsResolver);
		await closeOpenConnection(setEnsResolver);
		await closeOpenConnection(registry);
		await closeOpenConnection(resolver);
		await closeOpenConnection(nameWrapper);
	});

	beforeEach(async () => {
		// set up subnode
		await registry.methods
			.setSubnodeOwner(namehash(domain), sha3('web3js') as string, defaultAccount)
			.send(sendOptions);
	});

	// eslint-disable-next-line jest/expect-expect, jest/no-done-callback, jest/consistent-test-it
	it('ApprovalForAll event', async () => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
		await new Promise<void>(async resolve => {
			const event = ens.events.ApprovalForAll();

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			event.on('data', () => {
				resolve();
			});

			await ens.setApprovalForAll(accountOne, true, sendOptions);
		});
	});

	// eslint-disable-next-line jest/expect-expect, jest/no-done-callback
	test('NewTTL event', async () => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
		await new Promise<void>(async resolve => {
			const event = ens.events.NewTTL();

			event.on('data', () => {
				resolve();
			});

			event.on('error', () => {
				resolve();
			});

			await ens.setTTL(web3jsName, ttl, sendOptions);
		});
	});

	// eslint-disable-next-line jest/expect-expect, jest/no-done-callback, jest/consistent-test-it
	it('NewResolver event', async () => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
		await new Promise<void>(async resolve => {
			const mockAddress = '0x0000000000000000000000000000000000000000';
			const ENS_NAME = 'web3js.eth';
			const event = ens.events.NewResolver();

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			event.on('data', () => {
				resolve();
			});

			await ens.setResolver(ENS_NAME, mockAddress, sendOptions);
		});
	});
});
