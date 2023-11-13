const { Web3 } = require('../../lib/commonjs');
const { IpcProvider } = require('../../../web3-providers-ipc/lib/commonjs');
const accounts = require('../../../../scripts/accounts.json');
const contractData = require('../../../../fixtures/build/Basic.json');

const DATA_AMOUNT = 50 * 1024; // 50 kB

const sendAndGetData = async (web3, i) => {
	const sendOptions = { from: accounts[i].address };
	const deployOptions = {
		data: contractData.evm.bytecode.object,
		arguments: [123, ''],
		gasPrice: await web3.eth.getGasPrice(),
		gas: BigInt(9000000000000),
		gasLimit: BigInt(9000000000000),
		type: BigInt(0),
	};
	const c = new web3.eth.Contract(contractData.abi);
	const contract = await c.deploy(deployOptions).send(sendOptions);

	console.time(`Send huge data [${i}]`);
	const receipt = await contract.methods
		.setValues(1, 'A'.repeat(DATA_AMOUNT), true)
		.send({ from: accounts[i].address });
	console.timeLog(`Send huge data [${i}]`, receipt.transactionHash);

	console.time(`Get huge data [${i}]`);
	await contract.methods.getStringValue().call();
	console.timeLog(`Get huge data [${i}]`);
};

const test = async () => {
	const providerString = process.env.WEB3_SYSTEM_TEST_PROVIDER;
	console.log(`Start test with provider: ${providerString}`);
	const provider = providerString.includes('ipc')
		? new IpcProvider(providerString)
		: new Web3.providers.WebsocketProvider(providerString);
	const web3 = new Web3(provider);

	for (const a of accounts) {
		const acc = web3.eth.accounts.privateKeyToAccount(a.privateKey);
		web3.eth.accounts.wallet.add(acc);
	}

	const prs = [];
	for (let i = 0; i < 15; i++) {
		prs.push(sendAndGetData(web3, i));
	}
	await Promise.all(prs);
	web3.provider.disconnect();
};

test().catch(console.error);
