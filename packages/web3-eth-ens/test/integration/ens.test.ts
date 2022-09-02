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
import { sha3, toChecksumAddress } from 'web3-utils';

import { Address, Bytes } from 'web3-types';
import { ENS } from '../../src';
import { namehash } from '../../src/utils';

import { getSystemTestAccounts, getSystemTestProvider } from '../fixtures/system_tests_utils';

import { FIFSRegistrarAbi, FIFSRegistrarBytecode } from '../fixtures/ens/FIFSRegistrar';
import { ENSRegistryAbi, ENSRegistryBytecode } from '../fixtures/ens/ENSRegistry';
import { DummyNameWrapperApi, DummyNameWrapperBytecode } from '../fixtures/ens/DummyNameWrapper';
import { PublicResolverAbi, PublicResolverBytecode } from '../fixtures/ens/PublicResolver';
import { ReverseRegistrarAbi, ReverseRegistarBytecode } from '../fixtures/ens/ReverseRegistrar';

// import RESOLVER from '../fixtures/ens/PublicResolver.json';
// getOwner
// setOwner
// getTTL
// setTTL
// setSubnodeOwner
// setSubnodeRecord
// setApprovalForAll
// isApprovedForAll
// recordExists
// getResolver
// setResolver
// setRecord

describe('ens', () => {
	let registry: Contract<typeof ENSRegistryAbi>;
	let resolver: Contract<typeof PublicResolverAbi>;
	let nameWrapper: Contract<typeof DummyNameWrapperApi>;
	let registrar: Contract<typeof FIFSRegistrarAbi>;
	let reverseRegistrar: Contract<typeof ReverseRegistrarAbi>;

	const tld = 'test';
	const node = namehash('resolver');
	const label = sha3('resolver') as string;

	let accounts: string[];
	let ens: ENS;
	let defaultAccount: string;

	const ZERO_ADDRESS: Address = '0x0000000000000000000000000000000000000000';
	const ZERO_NODE: Bytes = '0x0000000000000000000000000000000000000000000000000000000000000000';
	const addressOne = '0x0000000000000000000000000000000000000001';

	beforeAll(async () => {
		accounts = await getSystemTestAccounts();

		[defaultAccount] = accounts;

		const sendOptions: PayableTxOptions = { from: defaultAccount, gas: '10000000' };

		const Registry = new Contract(ENSRegistryAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		const DummyNameWrapper = new Contract(DummyNameWrapperApi, undefined, {
			provider: getSystemTestProvider(),
		});

		const Resolver = new Contract(PublicResolverAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		const FifsRegistrar = new Contract(FIFSRegistrarAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		const ReverseRegistar = new Contract(ReverseRegistrarAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		registry = await Registry.deploy({ data: ENSRegistryBytecode }).send(sendOptions);

		nameWrapper = await DummyNameWrapper.deploy({ data: DummyNameWrapperBytecode }).send(
			sendOptions,
		);

		resolver = await Resolver.deploy({
			data: PublicResolverBytecode,
			arguments: [
				registry.options.address as string,
				nameWrapper.options.address as string,
				accounts[1],
				defaultAccount,
			],
		}).send(sendOptions);

		await registry.methods.setSubnodeOwner(ZERO_NODE, label, defaultAccount).send(sendOptions);
		await registry.methods
			.setResolver(node, resolver.options.address as string)
			.send(sendOptions);
		await resolver.methods.setAddr(node, addressOne).send(sendOptions);

		registrar = await FifsRegistrar.deploy({
			data: FIFSRegistrarBytecode,
			arguments: [registry.options.address as string, namehash(tld)],
		}).send(sendOptions);

		await registry.methods
			.setSubnodeOwner(ZERO_NODE, sha3(tld) as string, defaultAccount)
			.send(sendOptions);

		reverseRegistrar = await ReverseRegistar.deploy({
			data: ReverseRegistarBytecode,
			arguments: [registry.options.address as string],
		}).send(sendOptions);

		await registry.methods
			.setSubnodeOwner(ZERO_NODE, sha3('reverse') as string, defaultAccount)
			.send(sendOptions);

		await registry.methods
			.setSubnodeOwner(
				namehash('reverse'),
				sha3('adr') as string,
				reverseRegistrar.options.address as string,
			)
			.send(sendOptions);

		ens = new ENS(
			registry.options.address,
			new ENS.providers.HttpProvider(getSystemTestProvider()),
		);
	});

	it('should return the subnode owner of "resolver"', async () => {
		const owner = await ens.getOwner('resolver');

		expect(owner).toEqual(toChecksumAddress(defaultAccount));
	});

	// eslint-disable-next-line jest/expect-expect
	// it('should allow setting the TTL', async () => {
	// 	// const result = await ens.setTTL('0x0', 3600, { from: defaultAccount });
	// 	// const res = await ens.getTTL('0x0');
	// 	// const x = await registry.methods
	// 	// 	.setTTL(namehash(ZERO_ADDRESS), 3600)
	// 	// 	.send({ from: defaultAccount });
	// 	// assert.equal(result.logs.length, 1);
	// 	// const { args } = result.logs[0];
	// 	// assert.equal(
	// 	// 	args.node,
	// 	// 	'0x0000000000000000000000000000000000000000000000000000000000000000',
	// 	// );
	// 	// assert.equal(args.ttl.toNumber(), 3600);
	// 	// console.log('hi');
	// 	// ens.get
	// 	console.log(accounts);
	// 	const node = namehash('resolver');
	// 	const label = sha3('resolver') as string;

	// 	console.log(namehash(ZERO_ADDRESS).length);
	// 	console.log(ZERO_NODE.length);
	// 	console.log(namehash(ZERO_ADDRESS));
	// 	console.log(ZERO_NODE);
	// 	// await ens.setSubnodeOwner(ZERO_NODE, label, defaultAccount, {
	// 	// 	from: defaultAccount,
	// 	// });

	// 	await registry.methods
	// 		.setSubnodeOwner(ZERO_NODE, label, defaultAccount)
	// 		.send({ from: defaultAccount });

	// 	await registry.methods
	// 		.setResolver(node, resolver.options.address as Address)
	// 		.send({ from: defaultAccount });
	// 	await resolver.methods.setAddr(node, addressOne).send({ from: defaultAccount });
	// });
	// eslint-disable-next-line jest/expect-expect
	// it('should return the subnode owner of "resolver"', async () => {
	// 	const node = namehash('resolver');
	// 	const label = sha3('resolver') as string;

	// 	console.log(node);
	// 	console.log(label);

	// 	const owner = await ens.getOwner('resolver');
	// 	console.log(owner);
	// 	console.log(defaultAccount);

	// 	const addr = '0x0000000000000000000000000000000000001234';

	// 	// const result = await ens.setOwner('0x0', addr, { from: defaultAccount });
	// 	const o = await registry.methods.owner(namehash('0x0')).send({ from: defaultAccount });
	// 	console.log(await ens.getOwner('0x0'));
	// 	// console.log(o);
	// 	// await deployContract(defaultAccount, RESOLVER.abi, RESOLVER.bytecode, [
	// 	// 	registry.options.address as string,
	// 	// 	ZERO_ADDRESS,
	// 	// 	defaultAccount,
	// 	// 	ZERO_ADDRESS,
	// 	// ]);
	// 	// const res = await registry.methods
	// 	// 	.setSubnodeOwner(
	// 	// 		// format({ eth: 'address' }, ZERO_ADDRESS, DEFAULT_RETURN_FORMAT),
	// 	// 		namehash(ZERO_ADDRESS),
	// 	// 		label,
	// 	// 		defaultAccount,
	// 	// 	)
	// 	// 	.send({ from: defaultAccount });
	// 	// await ens.setSubnodeOwner(ZERO_ADDRESS, label, defaultAccount, { from: defaultAccount });
	// 	// console.log(res);
	// });

	// it('should fetch the registered resolver for the subnode "resolver"', async () => {
	// 	const resolverInRegistry = await ens.getResolver('resolver');
	// 	expect(resolverInRegistry.options.address).toEqual(resolver.options.address);
	// });

	// it('should return the subnode owner of "resolver"', async () => {
	// 	const owner = await ens.getOwner('resolver');

	// 	console.log(owner);
	// 	// assert.equal(owner, account);
	// });

	// eslint-disable-next-line jest/expect-expect
	// it('should set owner', async () => {
	// 	// const owner = await registry.methods.setOwner(ZERO_ADDRESS, ZERO_ADDRESS).send();
	// 	// eslint-disable-next-line no-console
	// 	// console.log('Owner of registry:', owner);
	// 	// ens.provider = new ens.providers.HttpProvider('http://localhost:8545');
	// 	const owner = await ens.setOwner('resolver', defaultAccount, { from: defaultAccount });
	// 	// const a = await ens.checkNetwork();
	// 	console.log(owner);
	// 	// console.log(ens.provider);
	// 	// console.log(accounts);
	// 	// ens.
	// });

	// it('should allow ownership transfers', async () => {
	// 	const addr = '0x0000000000000000000000000000000000001234';

	// 	// const result = await ens.setOwner('0x0', addr);

	// 	// expect(await ens.getOwner('0x0')).resolves.toEqual(addr);

	// 	// console.log(result);
	// 	// assert.equal(result.logs.length, 1);
	// 	// const { args } = result.logs[0];
	// 	// assert.equal(
	// 	// 	args.node,
	// 	// 	'0x0000000000000000000000000000000000000000000000000000000000000000',
	// 	// );
	// 	// assert.equal(args.owner, addr);
	// });
});
