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

import { onNewProviderDiscovered, requestEIP6963Providers } from '../../src/web3_eip6963';

describe('requestEIP6963Providers', () => {
	it('should reject with an error if window object is not available', async () => {
		// Mocking window object absence
		(global as any).window = undefined;

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		await expect(requestEIP6963Providers()).rejects.toThrow(
			'window object not available, EIP-6963 is intended to be used within a browser',
		);
	});

	it('should resolve with updated providers map when events are triggered', async () => {
		class CustomEventPolyfill extends Event {
			public detail: any;
			public constructor(eventType: string, eventInitDict: any) {
				super(eventType, eventInitDict);
				this.detail = eventInitDict.detail;
			}
		}

		(global as any).CustomEvent = CustomEventPolyfill;

		const mockProviderDetail = {
			info: {
				uuid: 'test-uuid',
				name: 'Test Provider',
				icon: 'test-icon',
				rdns: 'test-rdns',
			},
			provider: {}, // Mock provider object
		};

		const mockEvent = {
			type: 'eip6963:announceProvider',
			detail: mockProviderDetail,
		};

		// Mock window methods
		(global as any).window = {
			addEventListener: jest
				.fn()
				.mockImplementation((_event, callback) => callback(mockEvent)), // eslint-disable-line
			dispatchEvent: jest.fn(),
		};

		const result = await requestEIP6963Providers();

		expect(result).toEqual(new Map([['test-uuid', mockProviderDetail]]));
	});

	it('onNewProviderDiscovered should throw an error if window object is not available', () => {
		// Mock the window object not being available
		(global as any).window = undefined;

		// Expect an error to be thrown
		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onNewProviderDiscovered(_providerEvent => {});
		}).toThrow('window object not available, EIP-6963 is intended to be used within a browser');
	});

	it('onNewProviderDiscovered should add an event listener when window object is available', () => {
		(global as any).window = {
			addEventListener: jest.fn(),
		};

		const callback = jest.fn();
		onNewProviderDiscovered(callback);

		// Expect the callback to have been called when the event listener is added
		expect(global.window.addEventListener).toHaveBeenCalledWith(
			'web3:providersMapUpdated',
			callback,
		);
	});
});
