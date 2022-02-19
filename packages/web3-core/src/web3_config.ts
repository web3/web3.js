import { toHex, ValidTypes } from 'web3-utils';
import { Web3EventEmitter } from 'web3-common';

import { Web3ConfigOptions } from './types';

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
		defaultAccount: null,
		defaultBlock: 'latest',
		transactionBlockTimeout: 50,
		transactionConfirmationBlocks: 24,
		transactionPollingTimeout: 750,
		blockHeaderTimeout: 10,
		maxListenersWarningThreshold: 100,
		defaultNetworkId: null,
		defaultChain: 'mainnet',
		defaultHardfork: 'london',
		// TODO - Check if there is a default Common
		defaultCommon: null,
		defaultReturnType: ValidTypes.HexString,
		defaultTransactionType: '0x0',
		defaultMaxPriorityFeePerGas: toHex(2500000000),
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

	public get handleRevert() {
		return this._config.handleRevert;
	}

	public set handleRevert(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'handleRevert',
			oldValue: this._config.handleRevert,
			newValue: val,
		});
		this._config.handleRevert = val;
	}

	public get defaultAccount() {
		return this._config.defaultAccount;
	}

	public set defaultAccount(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'defaultAccount',
			oldValue: this._config.defaultAccount,
			newValue: val,
		});
		this._config.defaultAccount = val;
	}

	public get defaultBlock() {
		return this._config.defaultBlock;
	}

	public set defaultBlock(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'defaultBlock',
			oldValue: this._config.defaultBlock,
			newValue: val,
		});
		this._config.defaultBlock = val;
	}

	public get transactionBlockTimeout() {
		return this._config.transactionBlockTimeout;
	}

	public set transactionBlockTimeout(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionBlockTimeout',
			oldValue: this._config.transactionBlockTimeout,
			newValue: val,
		});
		this._config.transactionBlockTimeout = val;
	}

	public get transactionConfirmationBlocks() {
		return this._config.transactionConfirmationBlocks;
	}

	public set transactionConfirmationBlocks(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionConfirmationBlocks',
			oldValue: this._config.transactionConfirmationBlocks,
			newValue: val,
		});

		this._config.transactionConfirmationBlocks = val;
	}

	public get transactionPollingTimeout() {
		return this._config.transactionPollingTimeout;
	}

	public set transactionPollingTimeout(val) {
		this._triggerConfigChange('transactionPollingTimeout', val);

		this._config.transactionPollingTimeout = val;
	}

	public get blockHeaderTimeout() {
		return this._config.blockHeaderTimeout;
	}

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

	public get defaultHardfork() {
		return this._config.defaultHardfork;
	}

	public set defaultHardfork(val) {
		this._triggerConfigChange('defaultHardfork', val);

		this._config.defaultHardfork = val;
	}

	public get defaultCommon() {
		return this._config.defaultCommon;
	}

	public set defaultCommon(val) {
		this._triggerConfigChange('defaultCommon', val);

		this._config.defaultCommon = val;
	}

	public get defaultReturnType() {
		return this._config.defaultReturnType;
	}

	public set defaultReturnType(val) {
		this._triggerConfigChange('defaultReturnType', val);

		this._config.defaultReturnType = val;
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
