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

import {
	EIP6963AnnounceProviderEvent,
	EIP6963ProviderDetail,
	Eip6963EventName,
	eip6963Providers,
	requestEIP6963Providers
} from "../../src/web3_eip6963";

describe('requestEIP6963Providers', () => {

	it('should request EIP6963 providers and store them in eip6963Providers', () => {

		const mockProviderDetail: EIP6963ProviderDetail = {
			info: {
				uuid: '1',
				name: 'MockProvider',
				icon: 'icon-path',
				rdns: 'mock.rdns'
			},

			provider: {} as any
		};

		const mockAnnounceEvent: EIP6963AnnounceProviderEvent = {
			type: Eip6963EventName.eip6963announceProvider,
			detail: mockProviderDetail
		} as any;

		// Mock the window object
		(global as any).window = {
			addEventListener: jest.fn(),
			dispatchEvent: jest.fn()
		};

		// Call the function
		requestEIP6963Providers();

		// Validate event listener setup and event dispatch
		expect((global as any).window.addEventListener)
			.toHaveBeenCalledWith(Eip6963EventName.eip6963announceProvider, expect.any(Function));

		expect((global as any).window.dispatchEvent).toHaveBeenCalled();

		// Simulate the announce event
		// Access the mock function calls for addEventListener
		const addEventListenerMockCalls = (global as any).window.addEventListener.mock.calls;

		// Retrieve the first call to addEventListener and access its second argument
		const eventListenerArg = addEventListenerMockCalls[0][1];

		// Now "eventListenerArg" represents the function to be called when the event occurs
		const announceEventListener = eventListenerArg;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		announceEventListener(mockAnnounceEvent);

		// Validate if the provider detail is stored in the eip6963Providers map
		expect(eip6963Providers.get('1')).toEqual(mockProviderDetail);
	});

	it('should throw an error if window object is not available', () => {
		// Remove the window object
		delete (global as any).window;

		// Call the function and expect it to throw an error
		expect(() => {
			requestEIP6963Providers();
		}).toThrow("window object not available, EIP-6963 is intended to be used within a browser");
	});
});