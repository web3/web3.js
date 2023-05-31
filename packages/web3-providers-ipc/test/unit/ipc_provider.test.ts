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

import { Socket } from 'net';
import * as fs from 'fs';
import { ConnectionError, InvalidClientError } from 'web3-errors';
import { IpcProvider } from '../../src/index';

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
			expect(provider.SocketConnection).toBeInstanceOf(Socket);
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
			expect(() => new IpcProvider(socketPath)).toThrow(
				new ConnectionError(
					`Error while connecting to ${socketPath}. Reason: ${
						new InvalidClientError(socketPath).message
					}`,
				),
			);
		});

		it('should add listeners to socket', () => {
			const provider = new IpcProvider(socketPath);
			// @ts-expect-error-next-line
			jest.spyOn(provider._socketConnection, 'on');

			// @ts-expect-error-next-line
			expect(provider._socketConnection.on).toHaveBeenCalledWith(
				'connect',
				expect.any(Function),
			);
			// @ts-expect-error-next-line
			expect(provider._socketConnection.on).toHaveBeenCalledWith('end', expect.any(Function));
			// @ts-expect-error-next-line
			expect(provider._socketConnection.on).toHaveBeenCalledWith(
				'close',
				expect.any(Function),
			);
			// @ts-expect-error-next-line
			expect(provider._socketConnection.on).toHaveBeenCalledWith(
				'data',
				expect.any(Function),
			);
		});

		it('should connect to socket path', () => {
			const provider = new IpcProvider(socketPath);
			// @ts-expect-error-next-line
			jest.spyOn(provider._socketConnection, 'connect');

			// @ts-expect-error-next-line
			expect(provider._socketConnection.connect).toHaveBeenCalledTimes(1);
			// @ts-expect-error-next-line
			expect(provider._socketConnection.connect).toHaveBeenCalledWith({
				path: socketPath,
			});
		});
	});
});
