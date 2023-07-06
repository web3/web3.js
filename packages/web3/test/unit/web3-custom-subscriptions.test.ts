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

import { CommonSubscriptionEvents, Web3Subscription } from 'web3-core';
import { Web3 } from '../../src/web3';

describe('Web3 Custom Subscriptions', () => {
	it('should be able to define and subscribe to custom subscription', async () => {
		class CustomSubscription extends Web3Subscription<
			CommonSubscriptionEvents & {
				data: string;
			},
			{
				readonly customArgs?: string;
			}
		> {
			protected _buildSubscriptionParams() {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return ['customArgs', this.args] as ['customArgs', any];
			}
		}

		const CustomSub = {
			custom: CustomSubscription,
		};
		const args = {
			customArgs: 'hello custom',
		};
		const exec = new Promise((resolve, reject) => {
			const provider = {
				send: jest.fn().mockImplementation((obj: unknown) => {
					expect(obj).toMatchObject({
						id: expect.stringMatching(
							// match a Guid:
							/[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}/i,
						),
						jsonrpc: '2.0',
						method: 'eth_subscribe',
						params: ['customArgs', args],
					});
					resolve(true);
				}),
				supportsSubscriptions: () => {
					return true;
				},
			};

			try {
				const web3NoProvider = new Web3({
					provider,
					registeredSubscriptions: CustomSub,
				});

				// eslint-disable-next-line no-void
				void web3NoProvider.subscriptionManager.subscribe('custom', args);
			} catch (error) {
				reject(error);
			}
		});
		await expect(exec).resolves.toBe(true);
	});
});
