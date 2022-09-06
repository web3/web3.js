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

import { getBlock } from 'web3-eth';
import {
	RevertInstructionError,
	ENSNetworkNotSyncedError,
	ENSUnsupportedNetworkError,
} from 'web3-errors';
import { Web3Context, Web3ContextObject } from 'web3-core';
import { getId, Web3NetAPI } from 'web3-net';
import { Address, SupportedProviders, EthExecutionAPI, TransactionReceipt } from 'web3-types';
import { DEFAULT_RETURN_FORMAT, FormatType, FMT_NUMBER, DataFormat } from 'web3-utils';
import { NonPayableCallOptions, Contract } from 'web3-eth-contract';
import { PublicResolverAbi } from './abi/ens/PublicResolver';
import { Registry } from './registry';
import { registryAddresses } from './config';
import { Resolver } from './resolver';

export class ENS extends Web3Context<EthExecutionAPI & Web3NetAPI> {
	public registryAddress: string;
	private readonly _registry: Registry;
	private readonly _resolver: Resolver;
	private _detectedAddress?: string;
	private _lastSyncCheck?: number;

	public constructor(
		registryAddr?: string,
		provider?:
			| SupportedProviders<EthExecutionAPI & Web3NetAPI>
			| Web3ContextObject<EthExecutionAPI & Web3NetAPI>
			| string,
	) {
		super(provider ?? '');
		this.registryAddress = registryAddr ?? registryAddresses.main; // will default to main registry address
		this._registry = new Registry(this.getContextObject(), registryAddr);
		this._resolver = new Resolver(this._registry);
	}

	/**
	 * Returns the Resolver by the given address
	 */
	public async getResolver(name: string): Promise<Contract<typeof PublicResolverAbi>> {
		return this._registry.getResolver(name);
	}

	/**
	 * set the resolver of the given name
	 */
	public async setResolver(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions,
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<
		| FormatType<TransactionReceipt, typeof DEFAULT_RETURN_FORMAT>
		| FormatType<RevertInstructionError, typeof DEFAULT_RETURN_FORMAT>
	> {
		return this._registry.setResolver(name, address, txConfig, returnFormat);
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
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setSubnodeRecord(
			name,
			label,
			owner,
			resolver,
			ttl,
			txConfig,
			returnFormat,
		);
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
	public async isApprovedForAll(
		owner: Address,
		operator: Address,
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<unknown> {
		return this._registry.isApprovedForAll(owner, operator, returnFormat);
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
		node: string,
		label: string,
		address: Address,
		txConfig: NonPayableCallOptions,
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setSubnodeOwner(node, label, address, txConfig, returnFormat);
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
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setOwner(name, address, txConfig, returnFormat);
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
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._resolver.setAddress(name, address, txConfig, returnFormat);
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

	/**
	 * Checks if the current used network is synced and looks for ENS support there.
	 * Throws an error if not.
	 */
	public async checkNetwork() {
		const now = Date.now() / 1000;
		if (!this._lastSyncCheck || now - this._lastSyncCheck > 3600) {
			const block = await getBlock(this, 'latest', false, DEFAULT_RETURN_FORMAT);
			const headAge = BigInt(now) - BigInt(block.timestamp);

			if (headAge > 3600) {
				throw new ENSNetworkNotSyncedError();
			}

			this._lastSyncCheck = now;
		}

		if (this._detectedAddress) {
			return this._detectedAddress;
		}
		const networkType = await getId(this, {
			...DEFAULT_RETURN_FORMAT,
			number: FMT_NUMBER.HEX,
		}); // get the network from provider
		const addr = registryAddresses[networkType];

		if (typeof addr === 'undefined') {
			throw new ENSUnsupportedNetworkError(networkType);
		}

		this._detectedAddress = addr;
		return this._detectedAddress;
	}

	/*
	 * Returns true if the related Resolver does support the given signature or interfaceId.
	 */
	public async supportsInterface(ENSName: string, interfaceId: string) {
		return this._resolver.supportsInterface(ENSName, interfaceId);
	}
}
