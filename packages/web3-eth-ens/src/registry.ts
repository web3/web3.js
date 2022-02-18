import { inputAddressFormatter, ReceiptInfo } from 'web3-common';
import { Contract, NonPayableCallOptions } from 'web3-eth-contract';
import { Address, isHexStrict, sha3Raw, toNumber, Numbers } from 'web3-utils';
import { REGISTRY as registryABI } from './ABI/Registry';
import { RESOLVER as resolverABI } from './ABI/Resolver';
import { registryAddress } from './config';
import { namehash } from './utils';

export class Registry {
	private readonly contract: Contract<typeof registryABI>;

	public constructor(customRegistryAddress?: Address) {
		// TODO for contract, when eth.net is finished we can check network
		this.contract = customRegistryAddress
			? new Contract(registryABI, customRegistryAddress)
			: new Contract(registryABI, registryAddress);
	}
	public async getOwner(name: string) {
		try {
			const result = await this.contract.methods.owner(namehash(name)).call();

			return result;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async setOwner(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	) {
		try {
			const receipt = await this.contract.methods
				.setOwner(namehash(name), inputAddressFormatter(address))
				.send(txConfig);

			return receipt;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async getTTL(name: string) {
		try {
			const ttl = await this.contract.methods.ttl(namehash(name)).call();

			return ttl;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async setTTL(
		name: string,
		ttl: Numbers,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	): Promise<ReceiptInfo> {
		try {
			const promise = await this.contract.methods
				.setTTL(namehash(name), toNumber(ttl))
				.send(txConfig);

			return promise;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async setSubnodeOwner(
		name: string,
		label: string,
		address: Address,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	): Promise<ReceiptInfo> {
		const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label) : label;
		try {
			const receipt = await this.contract.methods
				.setSubnodeOwner(namehash(name), hexStrictLabel, inputAddressFormatter(address))
				.send(txConfig);
			return receipt;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async setSubnodeRecord(
		name: string,
		label: string,
		owner: Address,
		resolver: Address,
		ttl: Numbers,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	): Promise<ReceiptInfo> {
		const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label) : label;
		try {
			const receipt = await this.contract.methods
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

	public async setApprovalForAll(
		operator: string,
		approved: boolean,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	): Promise<ReceiptInfo> {
		try {
			const receipt = await this.contract.methods
				.setApprovalForAll(operator, approved)
				.send(txConfig);

			return receipt;
		} catch (error) {
			throw new Error(); // TODO: web3-eth txconfig should be replaced with sendTransaction type
		}
	}

	public async isApprovedForAll(owner: Address, operator: Address) {
		try {
			const promise = await this.contract.methods
				.isApprovedForAll(inputAddressFormatter(owner), inputAddressFormatter(operator))
				.call();

			return promise;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async recordExists(name: string) {
		try {
			const promise = await this.contract.methods.recordExists(namehash(name)).call();

			return promise;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async getResolver(name: string) {
		try {
			const promise = await this.contract.methods
				.resolver(namehash(name))
				.call()
				.then(address => {
					const contract = new Contract(resolverABI, address[0]);
					// TODO: set contract provider needs to be added when ens current provider
					return contract;
				});

			return promise;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}

	public async setResolver(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions, // TODO: web3-eth txconfig should be replaced with sendTransaction type
	): Promise<ReceiptInfo> {
		try {
			const promise = await this.contract.methods
				.setResolver(namehash(name), inputAddressFormatter(address))
				.send(txConfig);

			return promise;
		} catch (error) {
			throw new Error(); // TODO: TransactionRevertError Needs to be added after web3-eth call method is implemented
		}
	}
}
