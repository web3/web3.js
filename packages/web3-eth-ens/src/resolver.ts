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

import { Address, sha3, isHexStrict } from 'web3-utils';
import { Contract, NonPayableCallOptions } from 'web3-eth-contract';
import { inputAddressFormatter, ResolverMethodMissingError } from 'web3-common';
import { interfaceIds, methodsInInterface } from './config';
import { Registry } from './registry';
import { RESOLVER } from './abi/resolver';
import { namehash } from './utils';

//  Default public resolver
//  https://github.com/ensdomains/resolvers/blob/master/contracts/PublicResolver.sol

export class Resolver {
	private readonly registry: Registry;

	public constructor(registry: Registry) {
		this.registry = registry;
	}

	private async getResolverContractAdapter(ENSName: string) {
		//  TODO : (Future 4.1.0 TDB) cache resolver contract if frequently queried same ENS name, refresh cache based on TTL and usage, also limit cache size, optional cache with a flag
		return this.registry.getResolver(ENSName);
	}

	//  https://eips.ethereum.org/EIPS/eip-165
	// eslint-disable-next-line class-methods-use-this
	public async checkInterfaceSupport(
		resolverContract: Contract<typeof RESOLVER>,
		methodName: string,
	) {
		if (interfaceIds[methodName] === undefined)
			throw new ResolverMethodMissingError(
				resolverContract.options.address ?? '',
				methodName,
			);

		let supported = false;

		supported = (await resolverContract.methods
			.supportsInterface(interfaceIds[methodName])
			.call()) as Awaited<Promise<boolean>>;

		if (!supported)
			throw new ResolverMethodMissingError(
				resolverContract.options.address ?? '',
				methodName,
			);
	}

	public async setAddress(ENSName: string, address: Address, txConfig: NonPayableCallOptions) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);
		await this.checkInterfaceSupport(resolverContract, methodsInInterface.setAddr);

		return resolverContract.methods
			.setAddr(namehash(ENSName), inputAddressFormatter(address))
			.send(txConfig);
	}

	public async setPubkey(ENSName: string, x: string, y: string, txConfig: NonPayableCallOptions) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);
		await this.checkInterfaceSupport(resolverContract, methodsInInterface.setPubkey);

		//  TODO: verify that X and Y coordinates of pub key are normalized?
		return resolverContract.methods
			.setPubkey(namehash(ENSName), namehash(x), namehash(y))
			.send(txConfig);
	}

	public async setContenthash(ENSName: string, hash: string, txConfig: NonPayableCallOptions) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);
		await this.checkInterfaceSupport(resolverContract, methodsInInterface.setContenthash);

		return resolverContract.methods.setContenthash(namehash(ENSName), hash).send(txConfig);
	}

	public async supportsInterface(ENSName: string, interfaceId: string) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);

		let interfaceIdParam = interfaceId;

		if (!isHexStrict(interfaceIdParam)) {
			interfaceIdParam = sha3(interfaceId) ?? '';

			if (interfaceId === '') throw new Error('Invalid interface Id');

			interfaceIdParam = interfaceIdParam.slice(0, 10);
		}

		return resolverContract.methods.supportsInterface(interfaceIdParam).call();
	}

	public async getAddress(ENSName: string) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);

		await this.checkInterfaceSupport(resolverContract, methodsInInterface.addr);

		return resolverContract.methods.addr(namehash(ENSName)).call();
	}

	public async getPubkey(ENSName: string) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);

		await this.checkInterfaceSupport(resolverContract, methodsInInterface.pubkey);

		return resolverContract.methods.pubkey(namehash(ENSName)).call();
	}

	public async getContenthash(ENSName: string) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);

		await this.checkInterfaceSupport(resolverContract, methodsInInterface.contenthash);

		return resolverContract.methods.contenthash(namehash(ENSName)).call();
	}
}
