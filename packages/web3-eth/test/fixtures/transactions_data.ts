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

export const blockMockResult = {
	jsonrpc: '2.0',
	id: 'a40a81fa-1f8b-4bb2-a0ad-eef9b6d4636f',
	result: {
		baseFeePerGas: '0x44dab2983',
		blobGasUsed: '0x20000',
		difficulty: '0x0',
		excessBlobGas: '0x1c0000',
		extraData: '0x407273796e636275696c646572',
		gasLimit: '0x1c9c380',
		gasUsed: '0xb7a086',
		hash: '0xf2b1729965179032b17165678a1a212fa31cb008e30f4011ffe8ebdddbd02b95',
		logsBloom:
			'0xc3a70590c1c62524173d1892e33888067101934dc0891c2c9a898252b6f320215084a48906452960820188d32bba6fb82ec989018a0268603a00a4c6432a11276c9a038c676938eb68bc436c9905a9a1b08d238fb4458f48498215808bec81112e2a3a54869ff22422a8e491093da8a40f601d198417041cd22f799f9048865006e0b069ab049b852442b310396248088145e2810f230f9a44000c6868bc73e9afa8832a8ac92fd609007ac53c0a9cba0645ce298080184624e8040831dbc331f5e618072407050250021b3210e542781183a612d4618c1244000d421a6ca9c01a57e86a085402c55ab413f840a001e7117894d0469e20c2304a9655e344f60d',
		miner: '0x1f9090aae28b8a3dceadf281b0f12828e676c326',
		mixHash: '0x787ab1d511b72df60a705bb4cfc4e92e2f9d203e3e007ae3a0f757425951ca24',
		nonce: '0x0000000000000000',
		number: '0x131ad16',
		parentBeaconBlockRoot: '0x03bbca9fd0c7a0a020de04287f489112c79bc268220e9ff8e18957cd0d5c3cad',
		parentHash: '0xb1d8fa7b8346421d373a6d4c28575155516cea17c12a3df7201170c9e561b38c',
		receiptsRoot: '0x4ec500bdcd761ad505b2a989156c9a9628058d415acc93d800487c7c76308c59',
		sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
		size: '0xcb90',
		stateRoot: '0xafbb8743c0a5f4740e322217cb1f2780ee5c57c32bcd04e9256b09efc1a70568',
		timestamp: '0x6661ab8b',
		totalDifficulty: '0xc70d815d562d3cfa955',
		transactions: [
			'0x589956b75d19dbaf9911f246c23d4b3327ef234872ec1931c419041b23eb5b41',
			'0x4d3793f20c25979bd329cafdd889ba6be015cfc999acce8642d6e757b5192e93',
			'0x5ba5618ca5a14bab50862255dc69726a498346f9832bd0fd1394e8834e56790b',
			'0x6df9678f350db7e30afc930b7246bf1c144b9acb7fd1d25d7e107d550ed5a061',
			'0xb8f48ff2876cc393725ea4162421754dfb74ff2364a12d4d3de2c6269f1958c7',
			'0x2e5cf7c0607025038b6ccd871dc9ce85af686fd5fa2c82e605198af9afa92cca',
			'0x307fb855836feff5d8d0969fa4a44d3c6ae31d335da6577f48f9496d6fe9e0b9',
			'0x1362bed1aa8a30d28b7b76c35c2a8601b257058beffa9490dcb20de12bcb15b2',
			'0x234c7cc346c204022b2e5ead6d2e8c02317aeb0ec5ca82bd97c2b5d5e59a280b',
		],
		transactionsRoot: '0xc21a4d667b5f841538430b1e2c002c598f2178628ad1d61ea2fda462d1216607',
		uncles: [],
		withdrawals: [
			{
				address: '0xea97dc2523c0479484076660f150833e264c41e9',
				amount: '0x11b6d8c',
				index: '0x2dbe454',
				validatorIndex: '0x10f646',
			},
			{
				address: '0xb3e84b6c6409826dc45432b655d8c9489a14a0d7',
				amount: '0x11b4ce2',
				index: '0x2dbe455',
				validatorIndex: '0x10f647',
			},
			{
				address: '0x7e2a2fa2a064f693f0a55c5639476d913ff12d05',
				amount: '0x11ad733',
				index: '0x2dbe456',
				validatorIndex: '0x10f648',
			},
		],
		withdrawalsRoot: '0x2914fa2f5ed93880ed45b58e8f6d14f20c645988400d83c59109964e2053fe1a',
	},
};

export const receiptMockResult = {
	jsonrpc: '2.0',
	id: 1,
	result: {
		blockHash: '0xf4ad699b98241caf3930779b7d919a77f1727e67cef6ed1ce2a4c655ba812d54',
		blockNumber: '0x131ad35',
		// eslint-disable-next-line no-null/no-null
		contractAddress: null,
		cumulativeGasUsed: '0x8cae7a',
		effectiveGasPrice: '0x4c9bc2d65',
		from: '0xab6fd3a7c6ce9db945889cd018e028e055f3bc2e',
		gasUsed: '0xa145',
		logs: [
			{
				address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
				blockHash: '0xf4ad699b98241caf3930779b7d919a77f1727e67cef6ed1ce2a4c655ba812d54',
				blockNumber: '0x131ad35',
				data: '0x000000000000000000000000000000000000000000000000000000000016e360',
				logIndex: '0xdf',
				removed: false,
				topics: [
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
					'0x000000000000000000000000ab6fd3a7c6ce9db945889cd018e028e055f3bc2e',
					'0x00000000000000000000000051112f9f08a2174fe3fc96aad8f07e82d1cccd00',
				],
				transactionHash:
					'0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
				transactionIndex: '0x82',
			},
		],
		logsBloom:
			'0x00000000000000000000000002000000000000000000000000000000004000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000400000000000100000000000000000000000000080000000000000000000040000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000400000000000000000000000',
		status: '0x1',
		to: '0xdac17f958d2ee523a2206206994597c13d831ec7',
		transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
		transactionIndex: '0x82',
		type: '0x2',
	},
};
