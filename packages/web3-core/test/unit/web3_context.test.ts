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

// eslint-disable-next-line max-classes-per-file
import HttpProvider from 'web3-providers-http';
import { Web3Context } from '../../src/web3_context';
import { Web3RequestManager } from '../../src/web3_request_manager';

// eslint-disable-next-line @typescript-eslint/ban-types
class Context1 extends Web3Context<{}> {}
// eslint-disable-next-line @typescript-eslint/ban-types
class Context2 extends Web3Context<{}> {}

describe('Web3Context', () => {
	describe('constructor()', () => {
		it('should return providers on class level', () => {
			expect(Web3Context.providers).toBeDefined();
		});

		it('should return providers on instance level', () => {
			const context = new Web3Context('http://test.com');
			expect(context.providers).toBeDefined();
			expect(context.providers).toEqual(Web3Context.providers);
		});

		it('should create instance of request manager', () => {
			const context = new Web3Context('http://test.com');

			expect(context.requestManager).toBeInstanceOf(Web3RequestManager);
		});

		it('should return current provider from request manager', () => {
			const context = new Web3Context('http://test.com');

			expect(context.currentProvider).toBe(context.requestManager.provider);
		});

		it('should initialize the provider from options', () => {
			const context = new Web3Context({ provider: 'http://test.com' });

			expect(context.currentProvider).toBeInstanceOf(HttpProvider);
		});

		it('should set return current provider for the request manager', () => {
			const context = new Web3Context('http://test.com');

			context.currentProvider = 'http://test/abc';

			expect(context.currentProvider).toBeInstanceOf(HttpProvider);
		});
	});

	describe('getContextObject', () => {
		it('should return correct context object', () => {
			const context = new Context1('http://test/abc');

			expect(context.getContextObject()).toMatchSnapshot();
		});
	});

	describe('use', () => {
		it('should init child context with correct type', () => {
			const parent = new Context1('http://test/abc');
			const child = parent.use(Context2);

			expect(child).toBeInstanceOf(Context2);
		});

		it('should init context with correct configuration', () => {
			const parent = new Context1({
				provider: 'http://test/abc',
				config: { defaultNetworkId: 'my-network-id', defaultHardfork: 'my-fork' },
			});
			const child = parent.use(Context2);

			expect(child.defaultNetworkId).toBe('my-network-id');
			expect(child.defaultHardfork).toBe('my-fork');
		});

		it('should change config of child context', () => {
			const parent = new Context1('http://test/abc');
			const child = parent.use(Context2);

			parent.defaultNetworkId = 'my-network-id';

			expect(child.defaultNetworkId).toBe('my-network-id');
		});

		it('should use same instance of request manager', () => {
			const parent = new Context1('http://test/abc');
			const child = parent.use(Context2);

			expect(child.requestManager).toBe(parent.requestManager);
		});

		it('should use same instance of subscription manager', () => {
			const parent = new Context1({
				provider: 'http://test/abc',
				subscriptionManager: {} as any,
			});
			const child = parent.use(Context2);

			expect(child.subscriptionManager).toBe(parent.subscriptionManager);
		});

		it('should use same instance of provider', () => {
			const parent = new Context1('http://test/abc');
			const child = parent.use(Context2);

			expect(child.provider).toBe(parent.provider);
		});
	});

	describe('link', () => {
		it('should link context with correct configuration', () => {
			const parent = new Context1({
				provider: 'http://test/abc',
				config: { defaultNetworkId: 'my-network-id', defaultHardfork: 'my-fork' },
			});
			const child = new Context2('http://test/abc');

			child.link(parent);

			expect(child.defaultNetworkId).toBe('my-network-id');
			expect(child.defaultHardfork).toBe('my-fork');
		});

		it('should change config of child context', () => {
			const parent = new Context1('http://test/abc');
			const child = new Context2('http://test/abc');

			child.link(parent);

			parent.defaultNetworkId = 'my-network-id';

			expect(child.defaultNetworkId).toBe('my-network-id');
		});

		it('should use same instance of request manager', () => {
			const parent = new Context1('http://test/abc');
			const child = new Context2('http://test/abc');

			child.link(parent);

			expect(child.requestManager).toBe(parent.requestManager);
		});

		it('should use same instance of subscription manager', () => {
			const parent = new Context1({
				provider: 'http://test/abc',
				subscriptionManager: {} as any,
			});
			const child = new Context2('http://test/abc');

			child.link(parent);

			expect(child.subscriptionManager).toBe(parent.subscriptionManager);
		});

		it('should use same instance of provider', () => {
			const parent = new Context1('http://test/abc');
			const child = new Context2('http://test/abc');

			child.link(parent);

			expect(child.provider).toBe(parent.provider);
		});
	});
});
