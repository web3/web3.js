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

import * as web3Utils from '../../src';

import * as converters from '../../src/converters.js';
import * as eventEmitter from '../../src/event_emitter.js';
import * as validation from '../../src/validation.js';
import * as formatter from '../../src/formatter.js';
import * as hash from '../../src/hash.js';
import * as random from '../../src/random.js';
import * as stringManipulation from '../../src/string_manipulation.js';
import * as objects from '../../src/objects.js';
import * as promiseHelpers from '../../src/promise_helpers.js';
import * as jsonRpc from '../../src/json_rpc.js';
import * as web3DeferredPromise from '../../src/web3_deferred_promise.js';
import * as ChunkResponseParser from '../../src/chunk_response_parser.js';
import * as uuid from '../../src/uuid.js';
import * as web3Eip1193Provider from '../../src/web3_eip1193_provider.js';
import * as socketProvider from '../../src/socket_provider.js';
import * as uint8array from '../../src/uint8array.js';

describe('web3-utils exports', () => {
	it('should export all modules', () => {
		const modules = [
			converters,
			eventEmitter,
			validation,
			formatter,
			hash,
			random,
			stringManipulation,
			objects,
			promiseHelpers,
			jsonRpc,
			web3DeferredPromise,
			ChunkResponseParser,
			uuid,
			web3Eip1193Provider,
			socketProvider,
			uint8array,
		];

		modules.forEach(module => {
			Object.keys(module).forEach((property: string | any[]) => {
				expect(web3Utils).toHaveProperty(property);
			});
		});
	});
});
