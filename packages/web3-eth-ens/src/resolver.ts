import { Address } from 'web3-utils';
import { Contract, NonPayableCallOptions } from 'web3-eth-contract';
import { inputAddressFormatter } from 'web3-common';
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
		if (interfaceIds[methodName] === undefined) throw new Error(); //  ResolverMethodMissingError(resolver address, methodName);

		let supported = false;
		try {
			supported = (await resolverContract.methods
				.supportsInterface(interfaceIds[methodName])
				.call()) as Awaited<Promise<boolean>>;
		} catch (err) {
			//  TODO throw new Error
		}

		if (!supported) throw new Error(); // new ResolverMethodMissingError(resolver address, methodName);
	}

	public async setAddress(ENSName: string, address: Address, txConfig: NonPayableCallOptions) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);
		await this.checkInterfaceSupport(resolverContract, methodsInInterface.setAddr);

		try {
			return resolverContract.methods
				.setAddr(namehash(ENSName), inputAddressFormatter(address))
				.send(txConfig);
		} catch (error) {
			throw new Error(); //    to do web3 error
		}
	}

	public async setPubkey(ENSName: string, x: string, y: string, txConfig: NonPayableCallOptions) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);
		await this.checkInterfaceSupport(resolverContract, methodsInInterface.setPubkey);

		try {
			//  TODO: verify that X and Y coordinates of pub key are normalized?
			return resolverContract.methods
				.setPubkey(namehash(ENSName), namehash(x), namehash(y))
				.send(txConfig);
		} catch (error) {
			throw new Error(); //    to do web3 error
		}
	}

	public async setContenthash(ENSName: string, hash: string, txConfig: NonPayableCallOptions) {
		const resolverContract = await this.getResolverContractAdapter(ENSName);
		await this.checkInterfaceSupport(resolverContract, methodsInInterface.setContenthash);

		try {
			return resolverContract.methods.setContenthash(namehash(ENSName), hash).send(txConfig);
		} catch (error) {
			throw new Error(); //    to do web3 error
		}
	}
}
