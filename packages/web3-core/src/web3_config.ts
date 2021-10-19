import { HexString } from 'web3-utils';
import { Web3EventEmitter } from 'web3-common';

interface ConfigOptions {
	handleRevert: boolean;
	defaultAccount: HexString | null;
	defaultBlock: HexString;
	transactionBlockTimeout: number;
	transactionConfirmationBlocks: number;
	transactionPollingTimeout: number;
	blockHeaderTimeout: number;
	maxListenersWarningThreshold: number;
	defaultChain: string | null;
	defaultHardfork: string | null;
	defaultCommon: Record<string, unknown> | null;
}

type ConfigEvent<T, P extends keyof T = keyof T> = P extends unknown
	? { name: P; oldValue: T[P]; newValue: T[P] }
	: never;

export enum Web3ConfigEvent {
	CONFIG_CHANGE = 'CONFIG_CHANGE',
}

export abstract class Web3Config
	extends Web3EventEmitter<{ [Web3ConfigEvent.CONFIG_CHANGE]: ConfigEvent<ConfigOptions> }>
	implements ConfigOptions
{
	private _config: ConfigOptions = {
		handleRevert: false,
		defaultAccount: null,
		defaultBlock: 'latest',
		transactionBlockTimeout: 50,
		transactionConfirmationBlocks: 24,
		transactionPollingTimeout: 750,
		blockHeaderTimeout: 10,
		maxListenersWarningThreshold: 100,
		defaultChain: null,
		defaultHardfork: null,
		defaultCommon: null,
	};

	public getConfig() {
		return this._config;
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
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'transactionPollingTimeout',
			oldValue: this._config.transactionPollingTimeout,
			newValue: val,
		});

		this._config.transactionPollingTimeout = val;
	}

	public get blockHeaderTimeout() {
		return this._config.blockHeaderTimeout;
	}

	public set blockHeaderTimeout(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'blockHeaderTimeout',
			oldValue: this._config.blockHeaderTimeout,
			newValue: val,
		});

		this._config.blockHeaderTimeout = val;
	}

	public get maxListenersWarningThreshold() {
		return this._config.maxListenersWarningThreshold;
	}

	public set maxListenersWarningThreshold(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'maxListenersWarningThreshold',
			oldValue: this._config.maxListenersWarningThreshold,
			newValue: val,
		});
		this._config.maxListenersWarningThreshold = val;
	}

	public get defaultChain() {
		return this._config.defaultChain;
	}

	public set defaultChain(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'defaultChain',
			oldValue: this._config.defaultChain,
			newValue: val,
		});

		this._config.defaultChain = val;
	}

	public get defaultHardfork() {
		return this._config.defaultHardfork;
	}

	public set defaultHardfork(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'defaultHardfork',
			oldValue: this._config.defaultHardfork,
			newValue: val,
		});

		this._config.defaultHardfork = val;
	}

	public get defaultCommon() {
		return this._config.defaultCommon;
	}

	public set defaultCommon(val) {
		this.emit(Web3ConfigEvent.CONFIG_CHANGE, {
			name: 'defaultCommon',
			oldValue: this._config.defaultCommon,
			newValue: val,
		});

		this._config.defaultCommon = val;
	}
}
