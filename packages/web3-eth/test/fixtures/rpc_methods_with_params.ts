export const rpcMethodsWithParams = [
	{
		name: 'getBalance',
		method: 'eth_getBalance',
		params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1'],
	},
	{
		name: 'getStorageAt',
		method: 'eth_getStorageAt',
		params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0x0', '0x1'],
	},
	{
		name: 'getTransactionCount',
		method: 'eth_getTransactionCount',
		params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0x2a'],
	},
	{
		name: 'getBlockTransactionCountByHash',
		method: 'eth_getBlockTransactionCountByHash',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	},
	{
		name: 'getBlockTransactionCountByNumber',
		method: 'eth_getBlockTransactionCountByNumber',
		params: ['0x1'],
	},
	{
		name: 'getUncleCountByBlockHash',
		method: 'eth_getUncleCountByBlockHash',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	},
	{
		name: 'getUncleCountByBlockNumber',
		method: 'eth_getUncleCountByBlockNumber',
		params: ['0x1'],
	},
	{
		name: 'getCode',
		method: 'eth_getCode',
		params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0x2a'],
	},
	{
		name: 'sign',
		method: 'eth_sign',
		params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0xc0ffe'],
	},
	{
		name: 'signTransaction',
		method: 'eth_signTransaction',
		params: [
			{
				from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
				to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
				gas: '0x76c0',
				gasPrice: '0x9184e72a000',
				value: '0x1',
				nonce: '0x1',
			},
		],
	},
	{
		name: 'sendTransaction',
		method: 'eth_sendTransaction',
		params: [
			{
				from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
				to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
				gas: '0x76c0',
				gasPrice: '0x9184e72a000',
				value: '0x1',
				nonce: '0x1',
			},
		],
	},
	{
		name: 'sendRawTransaction',
		method: 'eth_sendRawTransaction',
		params: [
			'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
		],
	},
	{
		name: 'call',
		method: 'eth_call',
		params: [
			{
				from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
				to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
				gas: '0x76c0',
				gasPrice: '0x9184e72a000',
				value: '0x1',
				nonce: '0x1',
			},
			'0x2a',
		],
	},
	{
		name: 'estimateGas',
		method: 'eth_estimateGas',
		params: [
			{
				from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
				to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
				gas: '0x76c0',
				gasPrice: '0x9184e72a000',
				value: '0x1',
				nonce: '0x1',
			},
			'0x2a',
		],
	},
	{
		name: 'getBlockByHash',
		method: 'eth_getBlockByHash',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', true],
	},
	{
		name: 'getBlockByNumber',
		method: 'eth_getBlockByNumber',
		params: ['0x42', true],
	},
	{
		name: 'getTransactionByHash',
		method: 'eth_getTransactionByHash',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	},
	{
		name: 'getTransactionByBlockHashAndIndex',
		method: 'eth_getTransactionByBlockHashAndIndex',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', '0x0'],
	},
	{
		name: 'getTransactionByBlockNumberAndIndex',
		method: 'eth_getTransactionByBlockNumberAndIndex',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', '0x0'],
	},
	{
		name: 'getTransactionReceipt',
		method: 'eth_getTransactionReceipt',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	},
	{
		name: 'getUncleByBlockHashAndIndex',
		method: 'eth_getUncleByBlockHashAndIndex',
		params: ['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', '0x2a'],
	},
	{
		name: 'getUncleByBlockNumberAndIndex',
		method: 'eth_getUncleByBlockNumberAndIndex',
		params: ['0x1', '0x1'],
	},
	{
		name: 'compileSolidity',
		method: 'eth_compileSolidity',
		params: [
			'contract test { function multiply(uint a) returns(uint d) {   return a * 7;   } }',
		],
	},
	{
		name: 'compileLLL',
		method: 'eth_compileLLL',
		params: ['(returnlll (suicide (caller)))'],
	},
	{
		name: 'compileSerpent',
		method: 'eth_compileSerpent',
		params: ['/* some serpent */'],
	},
	{
		name: 'newFilter',
		method: 'eth_newFilter',
		params: [
			{
				fromBlock: '0x1',
				toBlock: '0x2',
				address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
		],
	},
	{
		name: 'uninstallFilter',
		method: 'eth_uninstallFilter',
		params: ['0x1'],
	},
	{
		name: 'getFilterChanges',
		method: 'eth_getFilterChanges',
		params: ['0x1'],
	},
	{
		name: 'getFilterLogs',
		method: 'eth_getFilterLogs',
		params: ['0x1'],
	},
	{
		name: 'getLogs',
		method: 'eth_getLogs',
		params: [
			{
				fromBlock: '0x1',
				toBlock: '0x2',
				address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
		],
	},
	{
		name: 'submitWork',
		method: 'eth_submitWork',
		params: [
			'0x0000000000000001',
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			'0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
		],
	},
	{
		name: 'submitHashrate',
		method: 'eth_submitHashrate',
		params: [
			'0x0000000000000000000000000000000000000000000000000000000000500000',
			'0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c',
		],
	},
	{
		name: 'getFeeHistory',
		method: 'eth_feeHistory',
		params: ['0x1', '0x1', ['0x1']],
	},
];
