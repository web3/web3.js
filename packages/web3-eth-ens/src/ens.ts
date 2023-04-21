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

import { isSyncing } from 'web3-eth';
import {
	RevertInstructionError,
	ENSNetworkNotSyncedError,
	ENSUnsupportedNetworkError,
} from 'web3-errors';
import { Web3Context, Web3ContextObject } from 'web3-core';
import { getId } from 'web3-net';
import {
	Address,
	SupportedProviders,
	EthExecutionAPI,
	TransactionReceipt,
	Web3NetAPI,
	NonPayableCallOptions,
	DEFAULT_RETURN_FORMAT,
	FormatType,
	FMT_NUMBER,
	DataFormat,
} from 'web3-types';
import { Contract } from 'web3-eth-contract';

import { PublicResolverAbi } from './abi/ens/PublicResolver';
import { Registry } from './registry';
import { networkIds, registryAddresses } from './config';
import { Resolver } from './resolver';

/**
 * This class is designed to interact with the ENS system on the Ethereum blockchain.
 *
 */
export class ENS extends Web3Context<EthExecutionAPI & Web3NetAPI> {
	/**
	 * The registryAddress property can be used to define a custom registry address when you are connected to an unknown chain. It defaults to the main registry address.
	 */
	public registryAddress: string;
	private readonly _registry: Registry;
	private readonly _resolver: Resolver;
	private _detectedAddress?: string;
	private _lastSyncCheck?: number;

	/**
	 * Use to create an instance of ENS
	 * @param registryAddr - (Optional) The address of the ENS registry (default: mainnet registry address)
	 * @param provider - (Optional) The provider to use for the ENS instance
	 * @example
	 * ```ts
	 * const ens = new ENS(
	 * 	"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
	 * 	"http://localhost:8545"
	 * );
	 *
	 * console.log( ens.defaultChain);
	 * > mainnet
	 * ```
	 */
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
	 * @param name - The name of the ENS domain
	 * @returns - An contract instance of the resolver
	 *
	 * @example
	 * ```ts
	 * const resolver = await ens.getResolver('resolver');
	 *
	 * console.log(resolver.options.address);
	 * > '0x1234567890123456789012345678901234567890'
	 * ```
	 */
	public async getResolver(name: string): Promise<Contract<typeof PublicResolverAbi>> {
		return this._registry.getResolver(name);
	}

	/**
	 * set the resolver of the given name
	 * @param name - The name of the ENS domain
	 * @param address - The address of the resolver
	 * @param txConfig - The transaction config
	 * @param returnFormat - (Optional) The return format, defaults to {@link DEFAULT_RETURN_FORMAT}
	 * @returns The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = await ens.setResolver('resolver', '0x1234567890123456789012345678901234567890', {from: '0x1234567890123456789012345678901234567890'});
	 * ```
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
	 * @param name - The ENS name
	 * @param label - The name of the sub-domain or sha3 hash of it
	 * @param owner - The owner of the name record
	 * @param resolver - The resolver address of the name record
	 * @param ttl - Time to live value
	 * @param txConfig - (Optional) The transaction config
	 * @param returnFormat - (Optional) The return format, defaults to {@link DEFAULT_RETURN_FORMAT}
	 * @returns - The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = await web3.eth.ens.setSubnodeRecord('ethereum.eth', 'web3', '0x1234567890123456789012345678901234567890','0xAA9133EeC3ae5f9440C1a1E61E2D2Cc571675527', 1000000);
	 * ```
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
	 * @param operator - The operator address
	 * @param approved - `true` to set the approval, `false` to clear it
	 * @param txConfig - (Optional) The transaction config
	 * @returns - The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = web3.eth.ens.setApprovalForAll('0x1234567890123456789012345678901234567890', true )
	 * ```
	 */
	public async setApprovalForAll(
		operator: Address,
		approved: boolean,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._registry.setApprovalForAll(operator, approved, txConfig);
	}

	/**
	 * Returns true if the operator is approved to make ENS registry operations on behalf of the owner.
	 * @param owner - The owner address
	 * @param operator - The operator address
	 * @param returnFormat - (Optional) The return format, defaults to {@link DEFAULT_RETURN_FORMAT}
	 * @returns - `true` if the operator is approved, `false` otherwise
	 * @example
	 * ```ts
	 * const approved = await web3.eth.ens.isApprovedForAll('0x1234567890123456789012345678901234567890', '0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990');
	 * ```
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
	 * @param name - The ENS name
	 * @returns - Returns `true` if node exists in this ENS registry. This will return `false` for records that are in the legacy ENS registry but have not yet been migrated to the new one.
	 * @example
	 * ```ts
	 * const exists = await web3.eth.ens.recordExists('ethereum.eth');
	 * ```
	 */
	public async recordExists(name: string): Promise<unknown> {
		return this._registry.recordExists(name);
	}

	/**
	 * Creates a new subdomain of the given node, assigning ownership of it to the specified owner.
	 * @param node - The ENS name
	 * @param label - The name of the sub-domain or the sha3 hash of it
	 * @param address - The registrar of this sub-domain
	 * @param txConfig - (Optional) The transaction config
	 * @param returnFormat - (Optional) The return format, defaults to {@link DEFAULT_RETURN_FORMAT}
	 * @returns - The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = await ens.setSubnodeOwner('ethereum.eth', 'web3', '0x1234567890123456789012345678901234567890', {from: '0x1234567890123456789012345678901234567890'});
	 * ```
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
	 * @param name - The ENS name
	 * @returns - Returns the caching TTL (time-to-live) of a name.
	 * @example
	 * ```ts
	 * const owner = await web3.eth.ens.getOwner('ethereum.eth');
	 * ```
	 */
	public async getTTL(name: string): Promise<unknown> {
		return this._registry.getTTL(name);
	}

	/**
	 * Sets the TTL of a name. Emits a NewTTL event.
	 * @param name - THe ENS name
	 * @param ttl - The TTL value
	 * @param txConfig - (Optional) The transaction config
	 * @returns - The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = await web3.eth.ens.setTTL('ethereum.eth', 1000);
	 * ```
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
	 * @param name - The ENS name
	 * @returns - Returns the address of the owner of the name.
	 * @example
	 * ```ts
	 * const owner = await web3.eth.ens.getOwner('ethereum.eth');
	 * ```
	 */
	public async getOwner(name: string): Promise<unknown> {
		return this._registry.getOwner(name);
	}

	/**
	 * Sets the address of the owner of an ENS name.
	 * @param name - The ENS name
	 * @param address - The address of the new owner
	 * @param txConfig - (Optional) The transaction config
	 * @param returnFormat - (Optional) The return format, defaults to {@link DEFAULT_RETURN_FORMAT}
	 * @returns - The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = await ens.setOwner('ethereum.eth', , sendOptions);
	 * ```
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
	 * @param name - The ENS name
	 * @param owner  - The owner of the name record.
	 * @param resolver  - The resolver of the name record.
	 * @param ttl  - Time to live value
	 * @param txConfig  - (Optional) The transaction config
	 * @returns - The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = await ens.setRecord( 'web3js.eth','0xe2597eb05cf9a87eb1309e86750c903ec38e527e', '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401', 1000);
	 * ```
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

	/**
	 * Sets the address of an ENS name in his resolver.
	 * @param name - The ENS name
	 * @param address - The address to set
	 * @param txConfig - (Optional) The transaction config
	 * @param returnFormat - (Optional) The return format, defaults to {@link DEFAULT_RETURN_FORMAT}
	 * @returns - The transaction receipt
	 * ```ts
	 * const receipt = await ens.setAddress('web3js.eth','0xe2597eb05cf9a87eb1309e86750c903ec38e527e');
	 *```
	 */
	public async setAddress(
		name: string,
		address: Address,
		txConfig: NonPayableCallOptions,
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._resolver.setAddress(name, address, txConfig, returnFormat);
	}

	/**
	 * Sets the SECP256k1 public key associated with an ENS node. (Emits a `PublicKeyChanged` event)
	 * @param name - The ENS name
	 * @param x - The X coordinate of the public key
	 * @param y - The Y coordinate of the public key
	 * @param txConfig - (Optional) The transaction config
	 * @returns - The transaction receipt
	 * ```ts
	 * const receipt = await web3.eth.ens.setPubkey(
	 * 'ethereum.eth',
	 * '0x0000000000000000000000000000000000000000000000000000000000000000',
	 * '0x0000000000000000000000000000000000000000000000000000000000000000',
	 * { from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c' });
	 * ```
	 */
	public async setPubkey(
		name: string,
		x: string,
		y: string,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._resolver.setPubkey(name, x, y, txConfig);
	}

	// todo do we support ipfs, onion, ...
	/**
	 * Sets the content hash associated with an ENS node. Emits a `ContenthashChanged` event.
	 * @param name - The ENS name
	 * @param hash - The content hash to set
	 * @param txConfig - (Optional) The transaction config
	 * @returns - The transaction receipt
	 * @example
	 * ```ts
	 * const receipt = web3.eth.ens.setContenthash(
	 * 	'ethereum.eth',
	 * 	'ipfs://QmaEBknbGT4bTQiQoe2VNgBJbRfygQGktnaW5TbuKixjYL',
	 * )
	 * ```
	 */
	public async setContenthash(
		name: string,
		hash: string,
		txConfig: NonPayableCallOptions,
	): Promise<TransactionReceipt | RevertInstructionError> {
		return this._resolver.setContenthash(name, hash, txConfig);
	}

	/**
	 * Resolves an ENS name to an Ethereum address.
	 * @param ENSName - The ENS name to resolve
	 * @param coinType - (Optional) The coin type, defaults to 60 (ETH)
	 * @returns - The Ethereum address of the given name
	 * ```ts
	 * const address = await web3.eth.ens.getAddress('ethereum.eth');
	 * console.log(address);
	 * > '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'
	 * ```
	 */
	public async getAddress(ENSName: string, coinType = 60) {
		return this._resolver.getAddress(ENSName, coinType);
	}

	/**
	 * Returns the X and Y coordinates of the curve point for the public key.
	 * @param ENSName - The ENS name
	 * @returns - The X and Y coordinates of the curve point for the public key
	 * @example
	 * ```ts
	 * const key = await web3.eth.ens.getPubkey('ethereum.eth');
	 * console.log(key);
	 * > {
	 * "0": "0x0000000000000000000000000000000000000000000000000000000000000000",
	 * "1": "0x0000000000000000000000000000000000000000000000000000000000000000",
	 * "x": "0x0000000000000000000000000000000000000000000000000000000000000000",
	 * "y": "0x0000000000000000000000000000000000000000000000000000000000000000"
	 * }
	 * ```
	 */
	public async getPubkey(ENSName: string) {
		return this._resolver.getPubkey(ENSName);
	}

	/**
	 * Returns the content hash object associated with an ENS node.
	 * @param ENSName - The ENS name
	 * @returns - The content hash object associated with an ENS node
	 * @example
	 * ```ts
	 * const hash = await web3.eth.ens.getContenthash('ethereum.eth');
	 * console.log(hash);
	 * > 'QmaEBknbGT4bTQiQoe2VNgBJbRfygQGktnaW5TbuKixjYL'
	 * ```
	 */
	public async getContenthash(ENSName: string) {
		return this._resolver.getContenthash(ENSName);
	}

	/**
	 * Checks if the current used network is synced and looks for ENS support there.
	 * Throws an error if not.
	 * @returns - The address of the ENS registry if the network has been detected successfully
	 * @example
	 * ```ts
	 * console.log(await web3.eth.ens.checkNetwork());
	 * > '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
	 * ```
	 */
	public async checkNetwork() {
		const now = Date.now() / 1000;
		if (!this._lastSyncCheck || now - this._lastSyncCheck > 3600) {
			const syncInfo = await isSyncing(this);

			if (!(typeof syncInfo === 'boolean' && !syncInfo)) {
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
		const addr = registryAddresses[networkIds[networkType]];

		if (typeof addr === 'undefined') {
			throw new ENSUnsupportedNetworkError(networkType);
		}

		this._detectedAddress = addr;
		return this._detectedAddress;
	}

	/**
	 * Returns true if the related Resolver does support the given signature or interfaceId.
	 * @param ENSName - The ENS name
	 * @param interfaceId - The signature of the function or the interfaceId as described in the ENS documentation
	 * @returns - `true` if the related Resolver does support the given signature or interfaceId.
	 * @example
	 * ```ts
	 * const supports = await web3.eth.ens.supportsInterface('ethereum.eth', 'addr(bytes32');
	 * console.log(supports);
	 * > true
	 * ```
	 */
	public async supportsInterface(ENSName: string, interfaceId: string) {
		return this._resolver.supportsInterface(ENSName, interfaceId);
	}

	/**
	 * @returns - Returns all events that can be emitted by the ENS registry.
	 */
	public get events() {
		return this._registry.events;
	}
}
