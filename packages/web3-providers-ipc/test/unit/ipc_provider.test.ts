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

import * as fs from 'fs';
import { InvalidClientError } from 'web3-errors';
import IpcProvider from '../../src/index';

jest.mock('net');
jest.mock('fs');

describe('IpcProvider', () => {
	let socketPath: string;

	beforeEach(() => {
		socketPath = '/test/test.ipc';
		jest.spyOn(fs, 'existsSync').mockReturnValue(true);
	});

	describe('constructor', () => {
		it('should construct the instance of the provider', () => {
			const provider = new IpcProvider(socketPath);
			expect(provider).toBeInstanceOf(IpcProvider);
		});

		it('should try to connect', () => {
			const connectSpy = jest.spyOn(IpcProvider.prototype, 'connect');
			// eslint-disable-next-line no-new
			new IpcProvider(socketPath);

			expect(connectSpy).toHaveBeenCalled();
		});
	});

	describe('connect', () => {
		it('should verify socket path', () => {
			// eslint-disable-next-line no-new
			new IpcProvider(socketPath);

			expect(fs.existsSync).toHaveBeenCalledWith(socketPath);
			expect(fs.existsSync).toHaveBeenCalledTimes(1);
		});

		it('should throw error if socket path does not exists', () => {
			jest.spyOn(fs, 'existsSync').mockReturnValue(false);

			expect(() => new IpcProvider(socketPath)).toThrow(new InvalidClientError(socketPath));
		});

		it('should add listeners to socket', () => {
			const provider = new IpcProvider(socketPath);
			jest.spyOn(provider['_socket'], 'on');

			expect(provider['_socket'].on).toHaveBeenCalledWith('connect', expect.any(Function));
			expect(provider['_socket'].on).toHaveBeenCalledWith('end', expect.any(Function));
			expect(provider['_socket'].on).toHaveBeenCalledWith('close', expect.any(Function));
			expect(provider['_socket'].on).toHaveBeenCalledWith('data', expect.any(Function));
		});

		it('should connect to socket path', () => {
			const provider = new IpcProvider(socketPath);
			jest.spyOn(provider['_socket'], 'connect');

			expect(provider['_socket'].connect).toHaveBeenCalledTimes(1);
			expect(provider['_socket'].connect).toHaveBeenCalledWith({ path: socketPath });
		});
		it('check wait params', () => {
			const provider = new IpcProvider(socketPath);
			expect(provider.waitTimeOut).toBe(5000);
			expect(provider.waitMaxNumberOfAttempts).toBe(10);
			provider.waitTimeOut = 300;
			provider.waitMaxNumberOfAttempts = 20;
			expect(provider.waitTimeOut).toBe(300);
			expect(provider.waitMaxNumberOfAttempts).toBe(20);
		});
	});
});
