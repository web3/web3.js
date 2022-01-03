import HttpProvider from 'web3-providers-http';
import { Web3Context } from '../../src/web3_context';
import { Web3RequestManager } from '../../src/web3_request_manager';

describe('Web3Context', () => {
	it('should return providers on class level', () => {
		expect(Web3Context.providers).toBeDefined();
	});

	it('should return providers on instance level', () => {
		const context = new Web3Context('test');
		expect(context.providers).toBeDefined();
		expect(context.providers).toEqual(Web3Context.providers);
	});

	it('should create instance of request manager', () => {
		const context = new Web3Context('test');

		expect(context.requestManager).toBeInstanceOf(Web3RequestManager);
	});

	it('should return current provider from request manager', () => {
		const context = new Web3Context('test');

		expect(context.currentProvider).toBe(context.requestManager.provider);
	});

	it('should set return current provider for the request manager', () => {
		const context = new Web3Context('test');

		context.currentProvider = 'http://test/abc';

		expect(context.currentProvider).toBeInstanceOf(HttpProvider);
	});
});
