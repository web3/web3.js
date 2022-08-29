const { Personal } = require('web3-eth-personal');
const { Web3Eth } = require('web3-eth');
const tempAccountList = require('./accounts.json');

const getEnvVar = name => (global.Cypress ? Cypress.env(name) : process.env[name]);

const DEFAULT_SYSTEM_PROVIDER = 'http://localhost:8545';

const getSystemTestProvider = () => DEFAULT_SYSTEM_PROVIDER;

const getSystemTestBackend = () => getEnvVar('WEB3_SYSTEM_TEST_BACKEND') ?? '';

let mainAcc;
let accountList = [];
const addAccount = async (address, privateKey) => {
	let clientUrl = getSystemTestProvider();

	const web3Personal = new Personal(clientUrl);
	if (accountList.length === 0) {
		accountList = await web3Personal.getAccounts();
		mainAcc = accountList[0];
	}
	const web3Eth = new Web3Eth(clientUrl);

	if (!accountList.find(acc => acc.address === address)) {
		await web3Personal.importRawKey(
			getSystemTestBackend() === 'geth' ? privateKey.slice(2) : privateKey,
			'123456',
		);
	}

	await web3Eth.sendTransaction({
		from: mainAcc,
		to: address,
		gas: 1500000,
		value: '1000000000000000000',
	});
};

const createWallets = () =>
	new Promise(async resolve => {
		for (const acc of tempAccountList) {
			try {
				await addAccount(acc.address, acc.privateKey);
			} catch (e) {
				console.log('error', e);
			}
		}
		resolve();
	});

createWallets().catch(console.error);
