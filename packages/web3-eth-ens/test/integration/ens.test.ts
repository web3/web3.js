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
import { Address, Bytes } from 'web3-types';
import { sha3, toChecksumAddress } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcProvider } from 'web3-providers-ipc';
import { ENS } from '../../src';
import { namehash } from '../../src/utils';

import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
	getSystemTestProviderUrl,
	isIpc,
	isSocket,
	isWs,
} from '../fixtures/system_tests_utils';

import { PublicResolverAbi as PublicResolver } from '../../src/abi/ens/PublicResolver';
import { ENSRegistryAbi } from '../fixtures/ens/abi/ENSRegistry';
import { NameWrapperAbi } from '../fixtures/ens/abi/NameWrapper';
import { PublicResolverAbi } from '../fixtures/ens/abi/PublicResolver';
import { ENSRegistryBytecode } from '../fixtures/ens/bytecode/ENSRegistryBytecode';
import { NameWrapperBytecode } from '../fixtures/ens/bytecode/NameWrapperBytecode';
import { PublicResolverBytecode } from '../fixtures/ens/bytecode/PublicResolverBytecode';

describe('ens', () => {
	let registry: Contract<typeof ENSRegistryAbi>;
	let resolver: Contract<typeof PublicResolverAbi>;
	let nameWrapper: Contract<typeof NameWrapperAbi>;

	type ResolverContract = Contract<typeof PublicResolverAbi>;

	let Resolver: ResolverContract;
	let getEnsResolver: Contract<typeof PublicResolver>;

	let sendOptions: PayableTxOptions;

	const domain = 'test';
	const node = namehash('resolver');
	const label = sha3('resolver') as string;

	const subdomain = 'subdomain';
	const fullDomain = `${subdomain}.${domain}`;
	const web3jsName = 'web3js.test';

	let ens: ENS;
	let defaultAccount: string;
	let accountOne: string;

	const ZERO_NODE: Bytes = '0x0000000000000000000000000000000000000000000000000000000000000000';
	const addressOne: Address = '0x0000000000000000000000000000000000000001';

	beforeAll(async () => {
		const acc1 = await createTempAccount();
		defaultAccount = acc1.address;
		const acc2 = await createTempAccount();
		accountOne = acc2.address;

		sendOptions = { from: defaultAccount, type: '0x1' };

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
	});

	afterAll(async () => {
		if (isSocket) {
			await closeOpenConnection(ens);
			// @ts-expect-error @typescript-eslint/ban-ts-comment
			await closeOpenConnection(ens?._registry?.contract);
			await closeOpenConnection(getEnsResolver);
			await closeOpenConnection(registry);
			await closeOpenConnection(resolver);
			await closeOpenConnection(nameWrapper);
		}
	});

	beforeEach(async () => {
		// set up subnode
		await registry.methods
			.setSubnodeOwner(namehash(domain), sha3('web3js') as string, defaultAccount)
			.send(sendOptions);
	});

	it('should return the subnode owner of "resolver"', async () => {
		const owner = await ens.getOwner('resolver');

		expect(owner).toEqual(toChecksumAddress(defaultAccount));
	});

	it('should return the registered resolver for the subnode "resolver"', async () => {
		getEnsResolver = await ens.getResolver('resolver');

		expect(getEnsResolver.options.address).toEqual(resolver.options.address);
	});

	it('should get the owner record for a name', async () => {
		const web3jsOwner = await ens.getOwner(web3jsName);

		expect(web3jsOwner).toEqual(toChecksumAddress(defaultAccount));
	});

	it('should get TTL', async () => {
		const TTL = await ens.getTTL(web3jsName);

		expect(TTL).toBe(BigInt(0));
	});

	it('shoud record exists', async () => {
		await registry.methods
			.setSubnodeOwner(namehash(domain), sha3(subdomain) as string, defaultAccount)
			.send(sendOptions);

		const exists = await ens.recordExists(fullDomain);

		expect(exists).toBeTruthy();
	});
});
