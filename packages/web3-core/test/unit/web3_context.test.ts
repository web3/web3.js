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
import { ExistingPluginNamespaceError } from 'web3-errors';
import HttpProvider from 'web3-providers-http';
import {
	EthExecutionAPI,
	JsonRpcPayload,
	JsonRpcResponse,
	Web3APIMethod,
	Web3APIReturnType,
	Web3AccountProvider,
	Web3BaseWalletAccount,
	Web3BaseWallet,
} from 'web3-types';
import { Web3Context, Web3PluginBase, Web3ContextObject } from '../../src/web3_context';
import { Web3RequestManager } from '../../src/web3_request_manager';
import { RequestManagerMiddleware } from '../../src/types';
import { CustomTransactionType } from './fixtures/custom_transaction_type';

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

		it('should return undefined when getting givenprovider', () => {
			const context = new Web3Context('http://test.com');
			expect(context.givenProvider).toBeUndefined();
		});
		it('should set return current provider for the request manager', () => {
			const context = new Web3Context('http://test.com');
			context.currentProvider = 'http://test/abc';

			expect(context.currentProvider).toBeInstanceOf(HttpProvider);
		});
		it('should set httpProvider', () => {
			const context = new Web3Context();
			const url = 'http://test/abc';
			context.setProvider(url);
			const httpProvider = new HttpProvider(url);
			expect(context.provider).toEqual(httpProvider);
		});

		it('get batch request', () => {
			const context = new Web3Context();
			const BatchRequestClass = context.BatchRequest;

			expect(new BatchRequestClass()).toBeInstanceOf(context.BatchRequest);
		});

		it('should set middleware for the request manager', () => {
			const context = new Web3Context('http://test.com');

			const middleware: RequestManagerMiddleware<EthExecutionAPI> = {
				processRequest: jest.fn(
					async <Param = unknown[]>(request: JsonRpcPayload<Param>) => request,
				),
				processResponse: jest.fn(
					async <
						Method extends Web3APIMethod<EthExecutionAPI>,
						ResponseType = Web3APIReturnType<EthExecutionAPI, Method>,
					>(
						response: JsonRpcResponse<ResponseType>,
					) => response,
				),
			};

			context.setRequestManagerMiddleware(middleware);
			expect(context.requestManager.middleware).toEqual(middleware);
		});
		it('should instantiate a new Web3Context object with provided context object', () => {
			const config = { defaultNetworkId: 'my-network-id', defaultHardfork: 'my-fork' };
			const context = {
				provider: 'http://test.com',
				config,
			} as Web3ContextObject;
			const newContext = Web3Context.fromContextObject(context);
			expect(newContext.currentProvider).toBeInstanceOf(HttpProvider);
			expect(newContext.requestManager).toBeInstanceOf(Web3RequestManager);
			expect(newContext.config.defaultHardfork).toEqual(config.defaultHardfork);
			expect(newContext.config.defaultNetworkId).toEqual(config.defaultNetworkId);
		});

		describe('accountsProvider', () => {
			const createAccountProvider = (): Web3AccountProvider<Web3BaseWalletAccount> => {
				const accountProvider = {
					privateKeyToAccount: jest.fn().mockImplementation(() => {
						return '';
					}),
					decrypt: jest.fn(),
					create: jest.fn().mockImplementation(() => {
						return '';
					}),
				};
				return accountProvider;
			};
			const accountProvider = createAccountProvider();

			class WalletExample<
				T extends Web3BaseWalletAccount = Web3BaseWalletAccount,
			> extends Web3BaseWallet<T> {
				public create = jest.fn(() => this);
				public add = jest.fn(() => this);
				public get = jest.fn(() => {
					return {
						address: 'mockAddress',
						privateKey: 'mockPrivateKey',
						signTransaction: jest.fn(),
						sign: jest.fn(),
						encrypt: jest.fn(),
					} as unknown as T;
				});
				public remove = jest.fn(() => true);
				public clear = jest.fn(() => this);
				public encrypt = jest.fn(async () => Promise.resolve([]));
				public decrypt = jest.fn();
				public save = jest.fn();
				public load = jest.fn();
			}

			const wallet = new WalletExample(accountProvider);
			it('should set wallet in context', () => {
				const context = new Web3Context({
					provider: 'http://test.com',
					wallet,
				});

				expect(context.wallet).toEqual(wallet);
			});
			it('should set the Accountsprovider when creating new context', () => {
				const context = new Web3Context({
					provider: 'http://test.com',
					accountProvider,
				});

				expect(context.accountProvider).toEqual(accountProvider);
			});

			it('should set wallet', () => {
				const context = new Web3Context({
					provider: 'http://test.com',
					wallet,
				});
				expect(context.wallet).toEqual(wallet);
			});
		});
	});

	describe('getContextObject', () => {
		it('should return correct context object', () => {
			const context = new Context1('http://test/abc');

			// The following is because a specific property is different in node 18 than it is in node 20 and 21
			// So the problematic property is removed from the object and then added to ensure its presence and its location
			// And the snapshot is updated to reflect the change.
			// Once node 18 is no longer supported, this can be removed. And the snapshot need to be updated then.

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const symbolForShapeMode = Object.getOwnPropertySymbols(
				(context.getContextObject().requestManager as any)._emitter,
			).find(s => s.description === 'shapeMode');
			if (symbolForShapeMode) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				delete (context.getContextObject().requestManager as any)._emitter[
					symbolForShapeMode
				];
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(context.getContextObject().requestManager as any)._emitter = {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				...(context.getContextObject().requestManager as any)._emitter,
				[Symbol.for('shapeMode')]: false,
			};

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

		it('context should be using the default common', () => {
			const parent = new Context1({
				provider: 'http://test/abc',
				config: {
					defaultCommon: {
						customChain: {
							name: 'foo',
							networkId: 'my-network-id',
							chainId: 1337,
						},
						baseChain: 'mainnet',
						hardfork: 'berlin',
					},
				},
			});
			const child = parent.use(Context2);

			expect(child.defaultCommon?.customChain.networkId).toBe('my-network-id');
			expect(child.defaultCommon?.customChain.chainId).toBe(1337);
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

	describe('registerPlugin', () => {
		it('should create a new type using registerNewTransactionType on a custom plugin', () => {
			const context = new Context1('http://test/abc');
			const pluginNamespace = 'plugin';

			class Plugin extends Web3PluginBase {
				public constructor() {
					super();
					this.registerNewTransactionType(3, CustomTransactionType);
				}
				public pluginNamespace = pluginNamespace;
			}

			expect(() => context.registerPlugin(new Plugin())).not.toThrow();
		});
		it('should throw ExistingPluginNamespaceError', () => {
			const context = new Context1('http://test/abc');
			const pluginNamespace = 'plugin';

			class Plugin extends Web3PluginBase {
				public pluginNamespace = pluginNamespace;
			}
			class Plugin2 extends Web3PluginBase {
				public pluginNamespace = pluginNamespace;
			}

			context.registerPlugin(new Plugin());
			expect(() => context.registerPlugin(new Plugin2())).toThrow(
				new ExistingPluginNamespaceError(pluginNamespace),
			);
		});
	});
});
