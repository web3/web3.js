import * as fs from 'fs';
import { InvalidClientError } from 'web3-common';
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
	});
});
