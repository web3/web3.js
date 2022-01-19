import { MethodNotImplementedError } from 'web3-common';

import HttpProvider from '../../src/index';

describe('HttpProvider - not implemented methods', () => {
	let httpProvider: HttpProvider;

	beforeAll(() => {
		httpProvider = new HttpProvider('http://localhost:8545');
	});

	it('getStatus', () => {
		expect(() => {
			httpProvider.getStatus();
		}).toThrow(MethodNotImplementedError);
	});

	it('on', () => {
		expect(() => {
			httpProvider.on();
		}).toThrow(MethodNotImplementedError);
	});

	it('removeListener', () => {
		expect(() => {
			httpProvider.removeListener();
		}).toThrow(MethodNotImplementedError);
	});

	it('once', () => {
		expect(() => {
			httpProvider.once();
		}).toThrow(MethodNotImplementedError);
	});

	it('removeAllListeners', () => {
		expect(() => {
			httpProvider.removeAllListeners();
		}).toThrow(MethodNotImplementedError);
	});

	it('connect', () => {
		expect(() => {
			httpProvider.connect();
		}).toThrow(MethodNotImplementedError);
	});

	it('disconnect', () => {
		expect(() => {
			httpProvider.disconnect();
		}).toThrow(MethodNotImplementedError);
	});

	it('reset', () => {
		expect(() => {
			httpProvider.reset();
		}).toThrow(MethodNotImplementedError);
	});

	it('reconnect', () => {
		expect(() => {
			httpProvider.reconnect();
		}).toThrow(MethodNotImplementedError);
	});
});
