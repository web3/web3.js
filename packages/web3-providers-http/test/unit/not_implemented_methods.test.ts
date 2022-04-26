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
