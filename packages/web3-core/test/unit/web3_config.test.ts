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

import { toHex } from 'web3-utils';
import { Web3Config, Web3ConfigEvent } from '../../src/web3_config';

class MyConfigObject extends Web3Config {}

const defaultConfig = {
	blockHeaderTimeout: 10,
	defaultAccount: undefined,
	defaultBlock: 'latest',
	defaultChain: 'mainnet',
	defaultNetworkId: undefined,
	defaultCommon: undefined,
	defaultHardfork: 'london',
	handleRevert: false,
	maxListenersWarningThreshold: 100,
	transactionBlockTimeout: 50,
	transactionConfirmationBlocks: 24,
	transactionPollingInterval: 1000,
	transactionPollingTimeout: 750 * 1000,
	transactionReceiptPollingInterval: undefined,
	transactionSendTimeout: 750 * 1000,
	transactionConfirmationPollingInterval: undefined,
	defaultTransactionType: '0x0',
	defaultMaxPriorityFeePerGas: toHex(2500000000),
};

describe('Web3Config', () => {
	it('should init default config values', () => {
		const obj = new MyConfigObject();

		expect(obj.getConfig()).toEqual(defaultConfig);
	});

	it.each(Object.keys(defaultConfig))('should expose a public getter for "%s"', key => {
		const obj = new MyConfigObject();
		const getterSpy = jest.spyOn(obj, key as keyof MyConfigObject, 'get');

		const result = obj[key as never];

		expect(getterSpy).toHaveBeenCalledTimes(1);
		expect(result).toEqual(defaultConfig[key as never]);
	});

	it.each(Object.keys(defaultConfig))('should expose a public setter for "%s"', key => {
		const obj = new MyConfigObject();
		const setterSpy = jest.spyOn(obj, key as keyof MyConfigObject, 'set');

		obj[key as never] = undefined as never;
		expect(setterSpy).toHaveBeenCalledTimes(1);
	});

	it.each(Object.keys(defaultConfig))('should set new config for "%s"', key => {
		const obj = new MyConfigObject();

		obj[key as never] = 'newValue' as never;
		const result = obj[key as never];

		expect(result).toBe('newValue');
	});

	it.each(Object.keys(defaultConfig))(
		'should trigger "configChange" event if "%s" is changed',
		key => {
			const obj = new MyConfigObject();
			const configChange = jest.fn();
			obj.on(Web3ConfigEvent.CONFIG_CHANGE, configChange);

			obj[key as never] = 'newValue' as never;

			if (key === 'transactionPollingInterval') return;

			expect(configChange).toHaveBeenCalledTimes(1);
			expect(configChange).toHaveBeenCalledWith({
				name: key,
				oldValue: defaultConfig[key as never],
				newValue: 'newValue',
			});
		},
	);

	it('Updating transactionPollingInterval should update transactionReceiptPollingInterval and transactionConfirmationPollingInterval', () => {
		const obj = new MyConfigObject();
		const configChange = jest.fn();
		obj.on(Web3ConfigEvent.CONFIG_CHANGE, configChange);

		obj.transactionPollingInterval = 1500;

		expect(configChange).toHaveBeenCalledTimes(3);
		expect(configChange).toHaveBeenCalledWith({
			name: 'transactionPollingInterval',
			oldValue: defaultConfig.transactionPollingInterval,
			newValue: 1500,
		});
		expect(configChange).toHaveBeenCalledWith({
			name: 'transactionReceiptPollingInterval',
			oldValue: defaultConfig.transactionReceiptPollingInterval,
			newValue: 1500,
		});
		expect(configChange).toHaveBeenCalledWith({
			name: 'transactionConfirmationPollingInterval',
			oldValue: defaultConfig.transactionConfirmationPollingInterval,
			newValue: 1500,
		});
	});
});
