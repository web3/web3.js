import { Contract } from './contract';

const abi = [
	{
		inputs: [
			{
				internalType: 'string',
				name: '_greeting',
				type: 'string',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'greet',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_greeting',
				type: 'string',
			}
		],
		name: 'setGreeting',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const;

const run = async () => {
	const c = new Contract(abi, '0x7BB4e72DF04ddf99d02C8ff89a332D05c0f00e99', {
		provider: 'http://127.0.0.1:8545/',
		from: '0x4192504b0a6F2218189F881E9Ecc457Fd56cfEa9',
	});

	let result: any;

	const m: string = 'nazar';

	result = await c.methods[m]().call();
	console.log(result);

	result = await c.methods.greet().call();
	console.log(result);

	console.log(await c.methods.setGreeting('12').estimateGas());

	console.log(await c.methods.setGreeting('Nazar Hussain Beta').send());

	result = await c.methods.greet().call();

	console.log(result);
};

run().catch(console.error);
