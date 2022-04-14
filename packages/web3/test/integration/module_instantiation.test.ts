import Contract from 'web3-eth-contract';
import { ENS } from 'web3-eth-ens';
import Web3Eth from 'web3-eth';
import { erc20Abi } from '../fixtures/erc20';
import { httpStringProvider } from '../fixtures/config';
import { Web3 } from '../../src/index';

describe('Module instantiations', () => {
	// todo need to expose expect in browser and not call jasmine
	const objectContaining = expect.objectContaining ?? jasmine.objectContaining;
	const any = expect.any ?? jasmine.any;

	it('should create module instances', () => {
		const web3 = new Web3(httpStringProvider);

		expect(web3.eth).toBeInstanceOf(Web3Eth);
		expect(web3.eth.ens).toBeInstanceOf(ENS);
		expect(web3.eth.abi).toEqual(
			objectContaining({
				encodeEventSignature: any(Function),
				encodeFunctionCall: any(Function),
				encodeFunctionSignature: any(Function),
				encodeParameter: any(Function),
				encodeParameters: any(Function),
				decodeParameter: any(Function),
				decodeParameters: any(Function),
				decodeLog: any(Function),
			}),
		);
		expect(web3.eth.accounts).toEqual(
			objectContaining({
				create: any(Function),
				privateKeyToAccount: any(Function),
				signTransaction: any(Function),
				recoverTransaction: any(Function),
				hashMessage: any(Function),
				sign: any(Function),
				recover: any(Function),
				encrypt: any(Function),
				decrypt: any(Function),
			}),
		);
		const erc20Contract = new web3.eth.Contract(erc20Abi);
		expect(erc20Contract).toBeInstanceOf(Contract);
		// expect(web3.eth.accounts).toBeInstanceOf();
		// expect(web3.eth.abi).toBeInstanceOf();
	});
	// it.skip('able to query via eth pacakge', async () => {
	// 	const web3 = new Web3(httpStringProvider);
	// 	const defaultAccount = accounts[0];

	// 	const acc = web3.eth.accounts.privateKeyToAccount(defaultAccount.privateKey);
	// 	// const nonce = await web3.eth.getTransactionCount(acc.address, 'latest'); // nonce starts counting from 0

	// 	// const common = Common.custom({ chainId: 15 });
	// 	const rawTx = {
	// 		// from: acc.address,
	// 		// to: accounts[1].address,
	// 		// value: toHex(toWei(1, 'ether')),
	// 		// gasLimit: toHex(21000),
	// 		// nonce,
	// 		/// //
	// 		to: '0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
	// 		value: '0x186A0',
	// 		gasLimit: 20e9,
	// 		gasPrice: 25e6,
	// 		data: '',
	// 		chainId: 15,
	// 		nonce: 0,
	// 	};

	// 	// const txOptions: TxOptions = {};
	// 	// const tx = new Transaction(rawTx, { common });
	// 	// tx.sign(Buffer.from(acc.privateKey.slice(2), 'hex'));

	// 	// const serializedTx = tx.serialize();

	// 	// const res = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);
	// 	const signedTx: signTransactionResult = acc.signTransaction(rawTx);

	// 	const res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	// 	console.warn(res);
	// });
});
