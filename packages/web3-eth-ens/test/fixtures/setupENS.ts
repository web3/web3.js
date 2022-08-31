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
// import ENSRegistry from '@ensdomains/ens-contracts/artifacts'
import { Contract } from 'web3-eth-contract';
// import { ContractAbi, ContractConstructorArgs } from 'web3-eth-abi';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ContractAbi } from 'web3-eth-abi';
// import REGISTRY from '../../src/abi/registry';
// import RESOLVER from '../../src/abi/resolver';
// import { registryAddresses } from './config';
import ENSREGISTRY from './ens/ENSRegistry.json';
// import RESOLVER from './ens/PublicResolver.json';
// import NAMEWRAPPER from './ens/NameWrapper.json';
// import { namehash } from './utils';

import { getSystemTestProvider, getSystemTestAccounts } from './system_tests_utils';

async function deployContract<T extends ContractAbi>(
	account: string,
	contractAbi: ContractAbi,
	contractByteCode: string,
	constructorArguments?: string[],
): Promise<Contract<T>> {
	const contract: Contract<T> = new Contract(contractAbi, undefined, {
		provider: getSystemTestProvider(),
	});

	// eslint-disable-next-line no-console
	console.log(constructorArguments !== undefined && { arguments: [constructorArguments] });
	const deployOptions: Record<string, unknown> = {
		data: contractByteCode,
		...(!!constructorArguments && { arguments: [constructorArguments] }),
	};

	const sendOptions = { from: account, gas: '1000000' };

	const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

	return deployedContract;
}
export async function setupENS(): Promise<Contract<typeof ENSREGISTRY.abi>> {
	// let registryContract: Contract<typeof ENSREGISTRY.abi>;
	// let deployOptions: Record<string, unknown>;
	// let sendOptions: Record<string, unknown>;
	const accounts: string[] = await getSystemTestAccounts();
	// const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
	const defaultAccount = accounts[0];
	const registry = await deployContract(defaultAccount, ENSREGISTRY.abi, ENSREGISTRY.bytecode);

	// const nameWrapper = await deployContract(defaultAccount, NAMEWRAPPER.abi, NAMEWRAPPER.bytecode);

	// const resolver = await deployContract(defaultAccount, RESOLVER.abi, RESOLVER.bytecode, [
	// 	registry.options.address as string,
	// 	nameWrapper.options.address as string,
	// 	defaultAccount,
	// 	ZERO_ADDRESS,
	// ]);
	// console.log('Registry:', registry.options.address);
	// console.log('Resolver:', resolver.options.address);
	return registry;
}
