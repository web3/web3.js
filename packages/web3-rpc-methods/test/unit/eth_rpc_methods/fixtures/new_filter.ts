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

import { Filter } from 'web3-types';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - filter
 */
type TestData = [string, [Filter]];
export const testData: TestData[] = [
	[
		'filter = fromBlock',
		[
			{
				fromBlock: '0xc0ff3',
			},
		],
	],
	[
		'filter = toBlock',
		[
			{
				toBlock: '0xc0ff3',
			},
		],
	],
	[
		'filter = address',
		[
			{
				address: '0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
			},
		],
	],
	[
		'filter = address[]',
		[
			{
				address: [
					'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
					'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
				],
			},
		],
	],
	[
		'filter = topics[]',
		[
			{
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					// Using "null" value intentionally for validation
					// eslint-disable-next-line no-null/no-null
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
		],
	],
	[
		'filter = fromBlock, toBlock, address[], topics[]',
		[
			{
				fromBlock: '0xc0ff3',
				toBlock: '0xc0ff3',
				address: [
					'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
					'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
				],
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					// Using "null" value intentionally for validation
					// eslint-disable-next-line no-null/no-null
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
		],
	],
];
