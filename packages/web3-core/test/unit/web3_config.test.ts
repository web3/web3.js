import { Web3Config } from '../../src/web3_config';

class MyConfigObject extends Web3Config {}

const defaultConfig = {
	blockHeaderTimeout: 10,
	defaultAccount: null,
	defaultBlock: 'latest',
	defaultChain: null,
	defaultCommon: null,
	defaultHardfork: null,
	handleRevert: false,
	maxListenersWarningThreshold: 100,
	transactionBlockTimeout: 50,
	transactionConfirmationBlocks: 24,
	transactionPollingTimeout: 750,
};

describe('Web3Config', () => {
	it('should init default config values', () => {
		const obj = new MyConfigObject();

		expect(obj.getConfig()).toEqual(defaultConfig);
	});

	it.each(Object.keys(defaultConfig))('should expose a public getter for "%s"', key => {
		const obj = new MyConfigObject();
		const getterSpy = jest.spyOn(obj, key as never, 'get');

		const result = obj[key as never];

		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		expect(getterSpy).toHaveBeenCalledTimes(1);
		expect(result).toEqual(defaultConfig[key as never]);
	});

	it.each(Object.keys(defaultConfig))('should expose a public setter for "%s"', key => {
		const obj = new MyConfigObject();
		const setterSpy = jest.spyOn(obj, key as never, 'set');

		obj[key as never] = null as never;

		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		expect(setterSpy).toHaveBeenCalledTimes(1);
	});

	it.each(Object.keys(defaultConfig))('should set new config for "%s"', key => {
		const obj = new MyConfigObject();

		obj[key as never] = 'newValue' as never;
		const result = obj[key as never];

		expect(result).toEqual('newValue');
	});

	it.each(Object.keys(defaultConfig))(
		'should trigger "onConfigChange" if "%s" is changed',
		key => {
			const obj = new MyConfigObject();
			obj.onConfigChange = jest.fn();

			obj[key as never] = 'newValue' as never;

			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			expect(obj.onConfigChange).toHaveBeenCalledTimes(1);
			expect(obj.onConfigChange).toHaveBeenCalledWith(
				key,
				defaultConfig[key as never],
				'newValue',
			);
		},
	);
});
