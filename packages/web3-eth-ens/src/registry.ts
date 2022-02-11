import { inputAddressFormatter, ReceiptInfo, RevertInstructionError } from 'web3-common';
import { Contract, NonPayableCallOptions, TransactionReceipt } from 'web3-eth-contract';
import { Address, isHexStrict, sha3Raw } from 'web3-utils';
import { REGISTRY as registryABI } from './ABI/Registry';
import { namehash } from './utils';

export class Registry {
	private readonly contract: Contract<typeof registryABI>;

	public constructor() {
		// TODO for contract, when eth.net is finished we can check network
		this.contract = new Contract(registryABI);
	}
	public async getOwner(name: string) {
		const promise = new Promise<[string]>((resolve, reject) => {
			this.contract.methods
				.owner(namehash(name))
				.call()
				.then(owner => {
					resolve(owner);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async setOwner(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions,
	): Promise<ReceiptInfo | RevertInstructionError> {
		const promise = new Promise<ReceiptInfo>((resolve, reject) => {
			this.contract.methods
				.setOwner(namehash(name), inputAddressFormatter(address))
				.send(txConfig)
				.then(receipt => {
					resolve(receipt);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async getTTL(name: string) {
		const promise = new Promise((resolve, reject) => {
			this.contract.methods
				.getTTL(namehash(name))
				.call()
				.then(ttl => {
					resolve(ttl);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async setTTL(
		name: string,
		ttl: string,
		txConfig: NonPayableCallOptions,
	): Promise<ReceiptInfo | RevertInstructionError> {
		const promise = new Promise<ReceiptInfo>((resolve, reject) => {
			this.contract.methods
				.setTTL(namehash(name), ttl)
				.send(txConfig)
				.then(receipt => {
					resolve(receipt);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async setSubnodeOwner(
		name: string,
		label: string,
		address: Address,
		txConfig: NonPayableCallOptions,
	): Promise<ReceiptInfo | RevertInstructionError> {
		const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label) : label;

		const promise = new Promise<TransactionReceipt>((resolve, reject) => {
			this.contract.methods
				.setSubnodeOwner(namehash(name), hexStrictLabel, inputAddressFormatter(address))
				.send(txConfig)
				.then(receipt => {
					resolve(receipt);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async setSubnodeRecord(
		name: string,
		label: string,
		owner: Address,
		resolver: Address,
		ttl: string,
		txConfig: NonPayableCallOptions,
	): Promise<ReceiptInfo> {
		const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label) : label;

		const promise = new Promise<ReceiptInfo>((resolve, reject) => {
			this.contract.methods
				.setSubnodeRecord(
					namehash(name),
					hexStrictLabel,
					inputAddressFormatter(owner),
					inputAddressFormatter(resolver),
					ttl,
				)
				.send(txConfig)
				.then(receipt => {
					resolve(receipt);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async setApprovalForAll(
		operator: string,
		approved: boolean,
		txConfig: NonPayableCallOptions,
	): Promise<ReceiptInfo | RevertInstructionError> {
		return this.contract.methods.setApprovalForAll(operator, approved).send(txConfig);
	}

	public async isApprovedForAll(owner: Address, operator: Address) {
		const promise = new Promise((resolve, reject) => {
			this.contract.methods
				.isApprovedForAll(inputAddressFormatter(owner), inputAddressFormatter(operator))
				.call()
				.then(res => {
					resolve(res);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async recordExists(name: string) {
		const promise = new Promise((resolve, reject) => {
			this.contract.methods
				.recordExists(namehash(name))
				.call()
				.then(res => {
					resolve(res);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async getResolver(name: string) {
		const promise = new Promise((resolve, reject) => {
			this.contract.methods
				.getResolver(namehash(name))
				.call()
				.then(resolver => {
					resolve(resolver);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}

	public async setResolver(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions,
	): Promise<ReceiptInfo | RevertInstructionError> {
		const promise = new Promise<ReceiptInfo>((resolve, reject) => {
			this.contract.methods
				.getResolver(namehash(name), inputAddressFormatter(address))
				.send(txConfig)
				.then(receipt => {
					resolve(receipt);
				})
				.catch(() => {
					reject(RevertInstructionError);
				});
		});
		return promise;
	}
}
