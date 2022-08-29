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

import { Numbers, HexString, BlockNumberOrTag } from 'web3-types';
import { toHex } from 'web3-utils';
import { TransactionTypeParser } from './types';
// eslint-disable-next-line import/no-cycle
import { TransactionBuilder } from './web3_context';
import { Web3EventEmitter } from './web3_event_emitter';

// To avoid cycle dependency declare this
export interface Web3ConfigOptions {
	handleRevert: boolean;
	defaultAccount?: HexString;
	defaultBlock: BlockNumberOrTag;
	transactionSendTimeout: number;
	transactionBlockTimeout: number;
	transactionConfirmationBlocks: number;
	transactionPollingInterval: number;
	transactionPollingTimeout: number;
	transactionReceiptPollingInterval?: number;
	transactionConfirmationPollingInterval?: number;
	blockHeaderTimeout: number;
	maxListenersWarningThreshold: number;
	defaultNetworkId?: Numbers;
	defaultChain: string;
	defaultHardfork: string;
	defaultCommon?: Record<string, unknown>;
	defaultTransactionType: Numbers;
	defaultMaxPriorityFeePerGas: Numbers;
	transactionBuilder?: TransactionBuilder;
	transactionTypeParser?: TransactionTypeParser;
}

type ConfigEvent<T, P extends keyof T = keyof T> = P extends unknown
	? { name: P; oldValue: T[P]; newValue: T[P] }
	: never;

export enum Web3ConfigEvent {
	CONFIG_CHANGE = 'CONFIG_CHANGE',
}

export abstract class Web3Config
	extends Web3EventEmitter<{ [Web3ConfigEvent.CONFIG_CHANGE]: ConfigEvent<Web3ConfigOptions> }>
	implements Web3ConfigOptions
{
	private _config: Web3ConfigOptions = {
		handleRevert: false,
		defaultAccount: undefined,
		defaultBlock: 'latest',
		transactionBlockTimeout: 50,
		transactionConfirmationBlocks: 24,
		transactionPollingInterval: 1000,
		transactionPollingTimeout: 750 * 1000,
		transactionReceiptPollingInterval: undefined,
		transactionSendTimeout: 750 * 1000,
		transactionConfirmationPollingInterval: undefined,
		blockHeaderTimeout: 10,
		maxListenersWarningThreshold: 100,
		defaultNetworkId: undefined,
		defaultChain: 'mainnet',
		defaultHardfork: 'london',
		// TODO - Check if there is a default Common
		defaultCommon: undefined,
		defaultTransactionType: '0x0',
		defaultMaxPriorityFeePerGas: toHex(2500000000),
		transactionBuilder: undefined,
		transactionTypeParser: undefined,
	};

	public constructor(options?: Partial<Web3ConfigOptions>) {
		super();

		this.setConfig(options ?? {});
	}

	public getConfig() {
		return this._config;
	}

	public setConfig(options: Partial<Web3ConfigOptions>) {
		// TODO: Improve and add key check
		Object.assign(this._config, options);
	}

	/**
	 * The `handleRevert` options property returns the revert reason string if enabled for the following methods:
	 * - web3.eth.sendTransaction()
	 * - web3.eth.call()
	 * - myContract.methods.myMethod().call()
	 * - myContract.methods.myMethod().send()
	 * Default is `false`.
	 *
	 * `Note`: At the moment `handleRevert` is only supported for `sendTransaction` and not for `sendSignedTransaction`
	 */
	public get handleRevert() {
		return this._config.handleRevert;
	}

	/**
	 * Will set the handleRevert
	 */
	public set handleRevert(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'handleRevert',
			oldValue: this._config.handleRevert,
			newValue: val,
		});
		this._config.handleRevert = val;
	}

	/**
	 * This default address is used as the default `from` property, if no `from` property is specified in for the following methods:
	 * - web3.eth.sendTransaction()
	 * - web3.eth.call()
	 * - myContract.methods.myMethod().call()
	 * - myContract.methods.myMethod().send()
	 */
	public get defaultAccount() {
		return this._config.defaultAccount;
	}
	/**
	 * Will set the default account.
	 */
	public set defaultAccount(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'defaultAccount',
			oldValue: this._config.defaultAccount,
			newValue: val,
		});
		this._config.defaultAccount = val;
	}

	/**
	 * The default block is used for certain methods. You can override it by passing in the defaultBlock as last parameter. The default value is `"latest"`.
	 * - web3.eth.getBalance()
	 * - web3.eth.getCode()
	 * - web3.eth.getTransactionCount()
	 * - web3.eth.getStorageAt()
	 * - web3.eth.call()
	 * - myContract.methods.myMethod().call()
	 */
	public get defaultBlock() {
		return this._config.defaultBlock;
	}

	/**
	 * Will set the default block.
	 *
	 * - A block number
	 * - `"earliest"` - String: The genesis block
	 * - `"latest"` - String: The latest block (current head of the blockchain)
	 * - `"pending"` - String: The currently mined block (including pending transactions)
	 */
	public set defaultBlock(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'defaultBlock',
			oldValue: this._config.defaultBlock,
			newValue: val,
		});
		this._config.defaultBlock = val;
	}

	/**
	 * The time used to wait for Ethereum Node to return the sent transaction result.
	 * Note: If the RPC call stuck at the Node and therefor timed-out, the transaction may still be pending or even mined by the Network. We recommend checking the pending transactions in such a case.
	 * Default is `750` seconds (12.5 minutes).
	 */
	public get transactionSendTimeout() {
		return this._config.transactionSendTimeout;
	}

	/**
	 * Will set the transactionSendTimeout.
	 */
	public set transactionSendTimeout(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionSendTimeout',
			oldValue: this._config.transactionSendTimeout,
			newValue: val,
		});
		this._config.transactionSendTimeout = val;
	}

	/**
	 * The `transactionBlockTimeout` is used over socket-based connections. This option defines the amount of new blocks it should wait until the first confirmation happens, otherwise the PromiEvent rejects with a timeout error.
	 * Default is `50`.
	 */
	public get transactionBlockTimeout() {
		return this._config.transactionBlockTimeout;
	}

	/**
	 * Will set the transactionBlockTimeout.
	 */
	public set transactionBlockTimeout(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionBlockTimeout',
			oldValue: this._config.transactionBlockTimeout,
			newValue: val,
		});
		this._config.transactionBlockTimeout = val;
	}

	/**
	 * This defines the number of blocks it requires until a transaction is considered confirmed.
	 * Default is `24`.
	 */
	public get transactionConfirmationBlocks() {
		return this._config.transactionConfirmationBlocks;
	}

	/**
	 * Will set the transactionConfirmationBlocks.
	 */
	public set transactionConfirmationBlocks(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionConfirmationBlocks',
			oldValue: this._config.transactionConfirmationBlocks,
			newValue: val,
		});

		this._config.transactionConfirmationBlocks = val;
	}

	/**
	 * Used over HTTP connections. This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network.
	 * Default is `1000` ms.
	 */
	public get transactionPollingInterval() {
		return this._config.transactionPollingInterval;
	}

	/**
	 * Will set the transactionPollingInterval.
	 */
	public set transactionPollingInterval(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionPollingInterval',
			oldValue: this._config.transactionPollingInterval,
			newValue: val,
		});

		this._config.transactionPollingInterval = val;

		this.transactionReceiptPollingInterval = val;
		this.transactionConfirmationPollingInterval = val;
	}
	/**
	 * Used over HTTP connections. This option defines the number of seconds Web3 will wait for a receipt which confirms that a transaction was mined by the network. Note: If this method times out, the transaction may still be pending.
	 * Default is `750` seconds (12.5 minutes).
	 */
	public get transactionPollingTimeout() {
		return this._config.transactionPollingTimeout;
	}

	/**
	 * Will set the transactionPollingTimeout.
	 */
	public set transactionPollingTimeout(val) {
		this._triggerConfigChange('transactionPollingTimeout', val);

		this._config.transactionPollingTimeout = val;
	}

	/**
	 * The `transactionPollingInterval` is used over HTTP connections. This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network.
	 * Default is `undefined`
	 */
	public get transactionReceiptPollingInterval() {
		return this._config.transactionReceiptPollingInterval;
	}

	/**
	 * Will set the transactionReceiptPollingInterval
	 */
	public set transactionReceiptPollingInterval(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionReceiptPollingInterval',
			oldValue: this._config.transactionReceiptPollingInterval,
			newValue: val,
		});

		this._config.transactionReceiptPollingInterval = val;
	}

	public get transactionConfirmationPollingInterval() {
		return this._config.transactionConfirmationPollingInterval;
	}

	public set transactionConfirmationPollingInterval(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionConfirmationPollingInterval',
			oldValue: this._config.transactionConfirmationPollingInterval,
			newValue: val,
		});

		this._config.transactionConfirmationPollingInterval = val;
	}

	/**
	 * The blockHeaderTimeout is used over socket-based connections. This option defines the amount seconds it should wait for “newBlockHeaders” event before falling back to polling to fetch transaction receipt.
	 * Default is `10` seconds.
	 */
	public get blockHeaderTimeout() {
		return this._config.blockHeaderTimeout;
	}

	/**
	 * Will set the blockHeaderTimeout
	 */
	public set blockHeaderTimeout(val) {
		this._triggerConfigChange('blockHeaderTimeout', val);

		this._config.blockHeaderTimeout = val;
	}

	public get maxListenersWarningThreshold() {
		return this._config.maxListenersWarningThreshold;
	}

	public set maxListenersWarningThreshold(val) {
		this._triggerConfigChange('maxListenersWarningThreshold', val);

		this._config.maxListenersWarningThreshold = val;
	}

	public get defaultNetworkId() {
		return this._config.defaultNetworkId;
	}

	public set defaultNetworkId(val) {
		this._triggerConfigChange('defaultNetworkId', val);

		this._config.defaultNetworkId = val;
	}

	public get defaultChain() {
		return this._config.defaultChain;
	}

	public set defaultChain(val) {
		this._triggerConfigChange('defaultChain', val);

		this._config.defaultChain = val;
	}

	/**
	 * Will return the default hardfork. Default is `london`
	 * The default hardfork property can be one of the following:
	 * - `chainstart`
	 * - `homestead`
	 * - `dao`
	 * - `tangerineWhistle`
	 * - `spuriousDragon`
	 * - `byzantium`
	 * - `constantinople`
	 * - `petersburg`
	 * - `istanbul`
	 * - `berlin`
	 * - `london`
	 * - 'arrowGlacier',
	 * - 'tangerineWhistle',
	 * - 'muirGlacier'
	 *
	 */
	public get defaultHardfork() {
		return this._config.defaultHardfork;
	}

	/**
	 * Will set the default hardfork.
	 *
	 */
	public set defaultHardfork(val) {
		this._triggerConfigChange('defaultHardfork', val);

		this._config.defaultHardfork = val;
	}

	/**
	 *
	 * Will get the default common property
	 * The default common property does contain the following Common object:
	 * - `customChain` - `Object`: The custom chain properties
	 * 	- `name` - `string`: (optional) The name of the chain
	 * 	- `networkId` - `number`: Network ID of the custom chain
	 * 	- `chainId` - `number`: Chain ID of the custom chain
	 * - `baseChain` - `string`: (optional) mainnet, goerli, kovan, rinkeby, or ropsten
	 * - `hardfork` - `string`: (optional) chainstart, homestead, dao, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul, berlin, or london
	 * Default is `undefined`.
	 *
	 */
	public get defaultCommon() {
		return this._config.defaultCommon;
	}

	/**
	 * Will set the default common property
	 *
	 */
	public set defaultCommon(val) {
		this._triggerConfigChange('defaultCommon', val);

		this._config.defaultCommon = val;
	}

	public get defaultTransactionType() {
		return this._config.defaultTransactionType;
	}

	public set defaultTransactionType(val) {
		this._triggerConfigChange('defaultTransactionType', val);

		this._config.defaultTransactionType = val;
	}

	public get defaultMaxPriorityFeePerGas() {
		return this._config.defaultMaxPriorityFeePerGas;
	}

	public set defaultMaxPriorityFeePerGas(val) {
		this._triggerConfigChange('defaultMaxPriorityFeePerGas', val);
		this._config.defaultMaxPriorityFeePerGas = val;
	}

	public get transactionBuilder() {
		return this._config.transactionBuilder;
	}

	public set transactionBuilder(val) {
		this._triggerConfigChange('transactionBuilder', val);
		this._config.transactionBuilder = val;
	}

	public get transactionTypeParser() {
		return this._config.transactionTypeParser;
	}

	public set transactionTypeParser(val) {
		this._triggerConfigChange('transactionTypeParser', val);
		this._config.transactionTypeParser = val;
	}

	private _triggerConfigChange<K extends keyof Web3ConfigOptions>(
		config: K,
		newValue: Web3ConfigOptions[K],
	) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: config,
			oldValue: this._config[config],
			newValue,
		} as ConfigEvent<Web3ConfigOptions>);
	}
}
