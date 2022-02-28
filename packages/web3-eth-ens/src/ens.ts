import { Address } from 'web3-utils';
import { RevertInstructionError } from 'web3-common';
import { NonPayableCallOptions, TransactionReceipt, Contract } from 'web3-eth-contract';
import { RESOLVER } from './abi/resolver';
import { Registry } from './registry';
import { registryContractAddress } from './config';
import { Resolver } from './resolver';

export class ENS {
	public registryAddress: string;
	private readonly _registry: Registry;
	private readonly _resolver: Resolver;

	public constructor(registryAddr?: string) {
		this._registry = new Registry(registryAddr);
		this.registryAddress = registryAddr ?? registryContractAddress; // TODO change this when eth.net is finished
		this._resolver = new Resolver(this._registry);
	}

	/**
	 * Returns the Resolver by the given address
	 */
	public async getResolver(name: string): Promise<Contract<typeof RESOLVER>> {
		return this._registry.getResolver(name);
	}

	/**
	 * set the resolver of the given name
	 */
	public async setResolver(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setResolver(name, address, txConfig);
	}

	/**
	 * Sets the owner, resolver and TTL for a subdomain, creating it if necessary.
	 */
	public async setSubnodeRecord(
		name: string,
		label: string,
		owner: Address,
		resolver: Address,
		ttl: number,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setSubnodeRecord(name, label, owner, resolver, ttl, txConfig);
	}

	/**
	 * Sets or clears an approval by the given operator.
	 */
	public async setApprovalForAll(
		operator: Address,
		approved: boolean,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setApprovalForAll(operator, approved, txConfig);
	}

	/**
	 * Returns true if the operator is approved
	 */
	public async isApprovedForAll(owner: Address, operator: Address): Promise<unknown> {
		return this._registry.isApprovedForAll(owner, operator);
	}

	/**
	 * Returns true if the record exists
	 */
	public async recordExists(name: string): Promise<unknown> {
		return this._registry.recordExists(name);
	}

	/**
	 * Returns the address of the owner of an ENS name.
	 */
	public async setSubnodeOwner(
		name: string,
		label: string,
		address: Address,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setSubnodeOwner(name, label, address, txConfig);
	}

	/**
	 * Returns the address of the owner of an ENS name.
	 */
	public async getTTL(name: string): Promise<unknown> {
		return this._registry.getTTL(name);
	}

	/**
	 * Returns the address of the owner of an ENS name.
	 */
	public async setTTL(
		name: string,
		ttl: number,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setTTL(name, ttl, txConfig);
	}

	/**
	 * Returns the owner by the given name and current configured or detected Registry
	 */
	public async getOwner(name: string): Promise<unknown> {
		return this._registry.getOwner(name);
	}

	/**
	 * Returns the address of the owner of an ENS name.
	 */
	public async setOwner(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setOwner(name, address, txConfig);
	}

	/**
	 * Returns the address of the owner of an ENS name.
	 */
	public async setRecord(
		name: string,
		owner: Address,
		resolver: Address,
		ttl: number,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setRecord(name, owner, resolver, ttl, txConfig);
	}

	/*
	 * Sets the address of an ENS name in his resolver.
	 */
	public async setAddress(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._resolver.setAddress(name, address, txConfig);
	}

	/*
	 * Sets the SECP256k1 public key associated with an ENS node.
	 */
	public async setPubkey(
		name: string,
		x: string,
		y: string,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._resolver.setPubkey(name, x, y, txConfig);
	}

	/*
	 * Sets the content hash associated with an ENS node.
	 */
	public async setContenthash(
		name: string,
		hash: string,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._resolver.setContenthash(name, hash, txConfig);
	}

	/*
	 * Resolves an ENS name to an Ethereum address.
	 */
	public async getAddress(ENSName: string) {
		return this._resolver.getAddress(ENSName);
	}

	/*
	 * Returns the X and Y coordinates of the curve point for the public key.
	 */
	public async getPubkey(ENSName: string) {
		return this._resolver.getPubkey(ENSName);
	}

	/*
	 * Returns the content hash object associated with an ENS node.
	 */
	public async getContenthash(ENSName: string) {
		return this._resolver.getContenthash(ENSName);
	}

	/*
	 * Returns true if the related Resolver does support the given signature or interfaceId.
	 */
	public async supportsInterface(ENSName: string, interfaceId: string) {
		return this._resolver.supportsInterface(ENSName, interfaceId);
	}

	// TODO after eth.net.getNetworkType is complete
	// public checkNetwork (): boolean {
	// return true;
	//  };
}
