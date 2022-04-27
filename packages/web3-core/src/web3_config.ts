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

import { Web3EventEmitter } from 'web3-common';
import { Numbers, HexString, toHex, BlockNumberOrTag } from 'web3-utils';
import { TransactionTypeParser } from './types';
// eslint-disable-next-line import/no-cycle
import { TransactionBuilder } from './web3_context';

// To avoid cycle dependency declare this
export interface Web3ConfigOptions {
	handleRevert: boolean;
	defaultAccount: HexString | null;
	defaultBlock: BlockNumberOrTag;
	transactionBlockTimeout: number;
	transactionConfirmationBlocks: number;
	transactionPollingInterval: number;
	transactionPollingTimeout: number;
	transactionReceiptPollingInterval: number | null;
	transactionConfirmationPollingInterval: number | null;
	blockHeaderTimeout: number;
	maxListenersWarningThreshold: number;
	defaultNetworkId: Numbers | null;
	defaultChain: string;
	defaultHardfork: string;
	defaultCommon: Record<string, unknown> | null;
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
		defaultAccount: null,
		defaultBlock: 'latest',
		transactionBlockTimeout: 50,
		transactionConfirmationBlocks: 24,
		transactionPollingInterval: 1000,
		transactionPollingTimeout: 750,
		transactionReceiptPollingInterval: null,
		transactionConfirmationPollingInterval: null,
		blockHeaderTimeout: 10,
		maxListenersWarningThreshold: 100,
		defaultNetworkId: null,
		defaultChain: 'mainnet',
		defaultHardfork: 'london',
		// TODO - Check if there is a default Common
		defaultCommon: null,
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

	public get transactionPollingInterval() {
		return this._config.transactionPollingInterval;
	}

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

	public get transactionPollingTimeout() {
		return this._config.transactionPollingTimeout;
	}

	public set transactionPollingTimeout(val) {
		this._triggerConfigChange('transactionPollingTimeout', val);

		this._config.transactionPollingTimeout = val;
	}

	public get transactionReceiptPollingInterval() {
		return this._config.transactionReceiptPollingInterval;
	}

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
