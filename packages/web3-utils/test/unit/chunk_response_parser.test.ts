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

import { EventEmitter } from 'eventemitter3';
import { InvalidResponseError } from 'web3-errors';
import { ChunkResponseParser } from '../../src/chunk_response_parser';
import { hugeData } from '../fixtures/hugeData';

jest.setTimeout(20000);
describe('chunk_response_parser', () => {
	let parser: ChunkResponseParser;
	let eventEmiter: EventEmitter;
	beforeEach(() => {
		eventEmiter = new EventEmitter();
		parser = new ChunkResponseParser(eventEmiter, false);
	});
	it('clearQueue', () => {
		const clearQueue = jest.fn();
		parser.onError(clearQueue);
		// @ts-expect-error call private method
		parser.clearQueues();
		expect(clearQueue).toHaveBeenCalled();
	});
	it('parse response', () => {
		const res = parser.parseResponse(hugeData.data);
		expect(res).toEqual(hugeData.result);
	});

	it('parse response with last chunk mechanism', () => {
		parser.parseResponse(
			'{"jsonrpc":"2.0","id":"96aa3f13-077c-4c82-a64a-64b8626f8192","result":"0x141414141',
		);
		parser.parseResponse('123');
		const res = parser.parseResponse('14141"}\n');
		expect(res[0]).toEqual({
			jsonrpc: '2.0',
			id: '96aa3f13-077c-4c82-a64a-64b8626f8192',
			result: '0x14141414112314141',
		});
	});

	it('lastChunkTimeout error', async () => {
		// @ts-expect-error set private property
		parser.chunkTimeout = 10;
		parser.parseResponse(
			'{"jsonrpc":"2.0","id":"96aa3f13-077c-4c82-a64a-64b8626f8192","result":"0x141414141',
		);
		const onError = jest.fn();
		eventEmiter.on('error', onError);
		// eslint-disable-next-line no-promise-executor-return
		await new Promise(resolve => setTimeout(resolve, 1000));
		expect(onError).toHaveBeenCalledWith(
			new InvalidResponseError({
				id: 1,
				jsonrpc: '2.0',
				error: { code: 2, message: 'Chunk timeout' },
			}),
		);
	});

	it('lastChunkTimeout return empty when auto reconnect true', async () => {
		const p = new ChunkResponseParser(eventEmiter, true);
		// @ts-expect-error set private property
		p.chunkTimeout = 10;
		const result = p.parseResponse(
			'{"jsonrpc":"2.0","id":"96aa3f13-077c-4c82-a64a-64b8626f8192","result":"0x141414141',
		);
		const onError = jest.fn();
		eventEmiter.on('error', onError);
		// eslint-disable-next-line no-promise-executor-return
		await new Promise(resolve => setTimeout(resolve, 1000));
		expect(result).toEqual([]);
	});
});
