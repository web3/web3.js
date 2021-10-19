import { HexString } from 'web3-utils';

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

export abstract class Web3Config implements ConfigOptions {
	public onConfigChange?: <T extends keyof ConfigOptions, T2 extends ConfigOptions[T]>(
		data: T,
		oldValue: T2,
		newValue: T2,
	) => void;

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
		this.onConfigChange?.('handleRevert', this._config.handleRevert, val);
		this._config.handleRevert = val;
	}

	public get defaultAccount() {
		return this._config.defaultAccount;
	}

	public set defaultAccount(val) {
		this.onConfigChange?.('defaultAccount', this._config.defaultAccount, val);

		this._config.defaultAccount = val;
	}

	public get defaultBlock() {
		return this._config.defaultBlock;
	}

	public set defaultBlock(val) {
		this.onConfigChange?.('defaultBlock', this._config.defaultBlock, val);

		this._config.defaultBlock = val;
	}

	public get transactionBlockTimeout() {
		return this._config.transactionBlockTimeout;
	}

	public set transactionBlockTimeout(val) {
		this.onConfigChange?.('transactionBlockTimeout', this._config.transactionBlockTimeout, val);

		this._config.transactionBlockTimeout = val;
	}

	public get transactionConfirmationBlocks() {
		return this._config.transactionConfirmationBlocks;
	}

	public set transactionConfirmationBlocks(val) {
		this.onConfigChange?.(
			'transactionConfirmationBlocks',
			this._config.transactionConfirmationBlocks,
			val,
		);

		this._config.transactionConfirmationBlocks = val;
	}

	public get transactionPollingTimeout() {
		return this._config.transactionPollingTimeout;
	}

	public set transactionPollingTimeout(val) {
		this.onConfigChange?.(
			'transactionPollingTimeout',
			this._config.transactionPollingTimeout,
			val,
		);

		this._config.transactionPollingTimeout = val;
	}

	public get blockHeaderTimeout() {
		return this._config.blockHeaderTimeout;
	}

	public set blockHeaderTimeout(val) {
		this.onConfigChange?.('blockHeaderTimeout', this._config.blockHeaderTimeout, val);

		this._config.blockHeaderTimeout = val;
	}

	public get maxListenersWarningThreshold() {
		return this._config.maxListenersWarningThreshold;
	}

	public set maxListenersWarningThreshold(val) {
		this.onConfigChange?.(
			'maxListenersWarningThreshold',
			this._config.maxListenersWarningThreshold,
			val,
		);

		this._config.maxListenersWarningThreshold = val;
	}

	public get defaultChain() {
		return this._config.defaultChain;
	}

	public set defaultChain(val) {
		this.onConfigChange?.('defaultChain', this._config.defaultChain, val);

		this._config.defaultChain = val;
	}

	public get defaultHardfork() {
		return this._config.defaultHardfork;
	}

	public set defaultHardfork(val) {
		this.onConfigChange?.('defaultHardfork', this._config.defaultHardfork, val);

		this._config.defaultHardfork = val;
	}

	public get defaultCommon() {
		return this._config.defaultCommon;
	}

	public set defaultCommon(val) {
		this.onConfigChange?.('defaultCommon', this._config.defaultCommon, val);

		this._config.defaultCommon = val;
	}
}
