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
import Web3Eth from 'web3-eth';
import { Contract, PayableTxOptions } from 'web3-eth-contract';
import { sha3 } from 'web3-utils';

import { Address, Bytes, DEFAULT_RETURN_FORMAT } from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcProvider } from 'web3-providers-ipc';
import { ENS } from '../../src';
import { namehash } from '../../src/utils';

import {
	closeOpenConnection,
	getSystemTestAccounts,
	getSystemTestProvider,
	getSystemTestProviderUrl,
	isIpc,
	isSocket,
	isWs,
	itIf,
} from '../fixtures/system_tests_utils';

import { ENSRegistryAbi } from '../fixtures/ens/abi/ENSRegistry';
import { PublicResolverAbi } from '../fixtures/ens/abi/PublicResolver';
import { NameWrapperAbi } from '../fixtures/ens/abi/NameWrapper';
import { ENSRegistryBytecode } from '../fixtures/ens/bytecode/ENSRegistryBytecode';
import { NameWrapperBytecode } from '../fixtures/ens/bytecode/NameWrapperBytecode';
import { PublicResolverBytecode } from '../fixtures/ens/bytecode/PublicResolverBytecode';

describe('ens', () => {
	let registry: Contract<typeof ENSRegistryAbi>;
	let resolver: Contract<typeof PublicResolverAbi>;
	let nameWrapper: Contract<typeof NameWrapperAbi>;

	let Resolver: Contract<typeof PublicResolverAbi>;

	let sendOptions: PayableTxOptions;

	const domain = 'test';
	const domainNode = namehash(domain);
	const node = namehash('resolver');
	const label = sha3('resolver') as string;

	let web3Eth: Web3Eth;

	let accounts: string[];
	let ens: ENS;
	let defaultAccount: string;
	let accountOne: string;

	const ZERO_NODE: Bytes = '0x0000000000000000000000000000000000000000000000000000000000000000';
	const addressOne: Address = '0x0000000000000000000000000000000000000001';

	const contentHash = '0x0000000000000000000000000000000000000000000000000000000000000001';

	const DEFAULT_COIN_TYPE = 60;

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

		const clientUrl = getSystemTestProviderUrl();
		let provider;
		if (isIpc) provider = new IpcProvider(clientUrl);
		else if (isWs) provider = new ENS.providers.WebsocketProvider(clientUrl);
		else provider = new ENS.providers.HttpProvider(clientUrl);

		ens = new ENS(registry.options.address, provider);

		web3Eth = new Web3Eth(provider);
		const block = await web3Eth.getBlock('latest', false, DEFAULT_RETURN_FORMAT);
		const gas = block.gasLimit.toString();

		// Increase gas for contract calls
		sendOptions = {
			...sendOptions,
			gas,
		};
	});

	afterAll(async () => {
		if (isSocket) {
			await closeOpenConnection(ens);
			// @ts-expect-error @typescript-eslint/ban-ts-comment
			await closeOpenConnection(ens?._registry?.contract);
			await closeOpenConnection(registry);
			await closeOpenConnection(resolver);
			await closeOpenConnection(nameWrapper);
		}
	});
	beforeEach(async () => {
		// set up subnode
		await registry.methods
			.setSubnodeOwner(ZERO_NODE, sha3('eth') as string, defaultAccount)
			.send(sendOptions);
	});

	it('supports known interfaces', async () => {
		await expect(ens.supportsInterface('resolver', '0x3b3b57de')).resolves.toBeTruthy(); // IAddrResolver
		await expect(ens.supportsInterface('resolver', '0xf1cb7e06')).resolves.toBeTruthy(); // IAddressResolver
		await expect(ens.supportsInterface('resolver', '0x691f3431')).resolves.toBeTruthy(); // INameResolver
		await expect(ens.supportsInterface('resolver', '0x2203ab56')).resolves.toBeTruthy(); // IABIResolver
		await expect(ens.supportsInterface('resolver', '0xc8690233')).resolves.toBeTruthy(); // IPubkeyResolver
		await expect(ens.supportsInterface('resolver', '0x59d1d43c')).resolves.toBeTruthy(); // ITextResolver
		await expect(ens.supportsInterface('resolver', '0xbc1c58d1')).resolves.toBeTruthy(); // IContentHashResolver
		await expect(ens.supportsInterface('resolver', '0xa8fa5682')).resolves.toBeTruthy(); // IDNSRecordResolver
		await expect(ens.supportsInterface('resolver', '0x5c98042b')).resolves.toBeTruthy(); // IDNSZoneResolver
		await expect(ens.supportsInterface('resolver', '0x01ffc9a7')).resolves.toBeTruthy(); // IInterfaceResolver
	});

	it('does not support a random interface', async () => {
		await expect(ens.supportsInterface('resolver', '0x3b3b57df')).resolves.toBeFalsy();
	});

	it('fetch pubkey', async () => {
		await registry.methods
			.setResolver(domainNode, resolver.options.address as string)
			.send(sendOptions);

		const res = await ens.getPubkey(domain);
		expect(res.x).toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
		expect(res.y).toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
	});

	it('permits setting public key by owner', async () => {
		const x = '0x1000000000000000000000000000000000000000000000000000000000000000';
		const y = '0x2000000000000000000000000000000000000000000000000000000000000000';

		await resolver.methods.setPubkey(domainNode, x, y).send(sendOptions);

		const result = await ens.getPubkey(domain);

		expect(result[0]).toBe(x);
		expect(result[1]).toBe(y);
	});

	it('sets contenthash', async () => {
		await resolver.methods.setContenthash(domainNode, contentHash).send(sendOptions);

		const res = await resolver.methods.contenthash(domainNode).call(sendOptions);
		expect(res).toBe(contentHash);
	});

	// eslint-disable-next-line jest/expect-expect
	itIf(isSocket)('ContenthashChanged event', async () => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
		await new Promise<void>(async resolve => {
			const resolver2 = await ens.getResolver('resolver');
			const event = resolver2.events.ContenthashChanged();

			event.on('data', () => {
				resolve();
			});
			await resolver.methods.setContenthash(domainNode, contentHash).send(sendOptions);
		});
	});

	it('fetches contenthash', async () => {
		await resolver.methods.setContenthash(domainNode, contentHash).call(sendOptions);

		const res = await ens.getContenthash(domain);
		expect(res).toBe(contentHash);
	});

	it('sets address', async () => {
		await registry.methods
			.setResolver(domainNode, resolver.options.address as string)
			.send(sendOptions);

		await resolver.methods.setAddr(domainNode, accounts[1]).send(sendOptions);

		const res = await resolver.methods.addr(domainNode, DEFAULT_COIN_TYPE).call(sendOptions);
		expect(res).toBe(accounts[1]);
	});

	it('fetches address', async () => {
		await registry.methods
			.setResolver(domainNode, resolver.options.address as string)
			.send(sendOptions);

		await resolver.methods.setAddr(domainNode, accountOne).send(sendOptions);

		const resultAddress = await ens.getAddress(domain);
		expect(resultAddress).toBe(accountOne);
	});
});
