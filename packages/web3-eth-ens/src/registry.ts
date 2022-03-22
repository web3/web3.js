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

import { inputAddressFormatter } from 'web3-common';
import { Contract, NonPayableCallOptions } from 'web3-eth-contract';
import { Address, isHexStrict, sha3Raw } from 'web3-utils';
import REGISTRY from './abi/registry';
import { RESOLVER } from './abi/resolver';
import { registryAddresses } from './config';
import { namehash } from './utils';

export class Registry {
	private readonly contract: Contract<typeof REGISTRY>;

	public constructor(customRegistryAddress?: Address) {
		this.contract = new Contract(REGISTRY, customRegistryAddress ?? registryAddresses.main);
	}
	public async getOwner(name: string) {
		try {
			const result = this.contract.methods.owner(namehash(name)).call();

			return result;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public setOwner(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	) {
		try {
			const receipt = this.contract.methods
				.setOwner(namehash(name), inputAddressFormatter(address))
				.send(txConfig);

			return receipt;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async getTTL(name: string) {
		try {
			return this.contract.methods.ttl(namehash(name)).call();
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public setTTL(
		name: string,
		ttl: number,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	) {
		try {
			const promievent = this.contract.methods.setTTL(namehash(name), ttl).send(txConfig);

			return promievent;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public setSubnodeOwner(
		name: string,
		label: string,
		address: Address,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	) {
		const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label) : label;
		try {
			const receipt = this.contract.methods
				.setSubnodeOwner(namehash(name), hexStrictLabel, inputAddressFormatter(address))
				.send(txConfig);
			return receipt;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public setSubnodeRecord(
		name: string,
		label: string,
		owner: Address,
		resolver: Address,
		ttl: number,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	) {
		const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label) : label;
		try {
			const receipt = this.contract.methods
				.setSubnodeRecord(
					namehash(name),
					hexStrictLabel,
					inputAddressFormatter(owner),
					inputAddressFormatter(resolver),
					ttl,
				)
				.send(txConfig);
			return receipt;
		} catch (error) {
			throw new Error(); // TODO: web3-eth txconfig should be replaced with sendTransaction type
		}
	}

	public setApprovalForAll(
		operator: string,
		approved: boolean,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	) {
		try {
			const receipt = this.contract.methods
				.setApprovalForAll(operator, approved)
				.send(txConfig);

			return receipt;
		} catch (error) {
			throw new Error(); // TODO: web3-eth txconfig should be replaced with sendTransaction type
		}
	}

	public async isApprovedForAll(owner: Address, operator: Address) {
		try {
			const result = this.contract.methods
				.isApprovedForAll(inputAddressFormatter(owner), inputAddressFormatter(operator))
				.call();

			return result;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async recordExists(name: string) {
		try {
			const promise = this.contract.methods.recordExists(namehash(name)).call();

			return promise;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async getResolver(name: string) {
		try {
			return this.contract.methods
				.resolver(namehash(name))
				.call()
				.then(address => {
					// address type is unknown, not sure why
					if (typeof address === 'string') {
						const contract = new Contract(RESOLVER, address);
						// TODO: set contract provider needs to be added when ens current provider
						return contract;
					}
					throw new Error();
				});
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public setResolver(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	) {
		try {
			return this.contract.methods
				.setResolver(namehash(name), inputAddressFormatter(address))
				.send(txConfig);
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public setRecord(
		name: string,
		owner: Address,
		resolver: Address,
		ttl: number,
		txConfig: NonPayableCallOptions,
	) {
		try {
			return this.contract.methods
				.setRecord(
					namehash(name),
					inputAddressFormatter(owner),
					inputAddressFormatter(resolver),
					ttl,
				)
				.send(txConfig);
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}
}
