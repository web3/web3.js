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
import { AbiEventFragment, LogsInput } from 'web3-types';
import { decodeEventABI } from '../../src';
import { decodeEventABIData } from '../fixtures/decoding';

describe('decoding functions', () => {
	describe('decode', () => {
		describe('decodeEventABI', () => {
			it.each(decodeEventABIData)(
				'%s',
				(event: AbiEventFragment & { signature: string }, inputs: LogsInput, output) => {
					expect(
						decodeEventABI(event, inputs, [
							{ signature: event.signature } as unknown as AbiEventFragment & {
								signature: string;
							},
						]),
					).toStrictEqual(output);
				},
			);
		});
		// describe.only('decodeEventABI test', () => { 
		// 	const inputs :LogsInput = {

		// 		address: '0x96944673f4314c7c6dfb719ecf86d68cce9dc393',
			   
		// 		topics: [
			   
		// 		'0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
			   
		// 		'0x000000000000000000000000af853ff16d40f011a9b153a664ac5cea2f3f1a93',
			   
		// 		'0x0000000000000000000000006855e2abfb524687cb19e3cf2f33b25bf38223cc'
			   
		// 		],
			   
		// 		data: '0x0000000000000000000000000000000000000000000000000000000000000000',
			   
		// 		blockNumber: "229",
			   
		// 		transactionHash: '0x1e53f2432335b7ae65b9b194ffc04531dbd82a400000ce11be59dd6116a110af',
			   
		// 		transactionIndex: "0",
			   
		// 		blockHash: '0xc543b8156a1fcbc2f7e3049903ef4f19785bf81b3ca299a4f5a10a660d93499b',
			   
		// 		logIndex: "0"
			   
		// 		};
		// 	const event = {
		// 		anonymous: false,
		// 		inputs: [
		// 		  {
		// 			indexed: true,
		// 			internalType: 'address',
		// 			name: 'from',
		// 			type: 'address'
		// 		  },
		// 		  {
		// 			indexed: true,
		// 			internalType: 'address',
		// 			name: 'to',
		// 			type: 'address'
		// 		  },
		// 		  {
		// 			indexed: true,
		// 			internalType: 'uint256',
		// 			name: 'tokenId',
		// 			type: 'uint256'
		// 		  }
		// 		],
		// 		name: 'Transfer',
		// 		type: 'event',
		// 		signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
		// 	  };

		// 	console.log(decodeEventABI(event, inputs, [
		// 		{ signature: event.signature } as unknown as AbiEventFragment & {
		// 			signature: string;
		// 		},
		// 	])
		// 	)
		// });
	});
});
