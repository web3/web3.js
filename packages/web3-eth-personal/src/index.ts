import { Web3Context } from 'web3-core';
import { Transaction } from 'web3-eth';
import { Address, HexString } from 'web3-utils';
import { EthPersonalAPI } from './eth_personal_api';
import * as rpcWrappers from './rpc_method_wrappers';

export class EthPersonal extends Web3Context<EthPersonalAPI> {
	public async getAccounts() {
		return rpcWrappers.getAccounts(this.requestManager);
	}

	public async newAccount(password: string) {
		return rpcWrappers.newAccount(this.requestManager, password);
	}

	public async unlockAccount(address: Address, password: string, unlockDuration: number) {
		return rpcWrappers.unlockAccount(this.requestManager, address, password, unlockDuration);
	}

	public async lockAccount(address: Address) {
		return rpcWrappers.lockAccount(this.requestManager, address);
	}

	public async importRawKey(keyData: HexString, passphrase: string) {
		return rpcWrappers.importRawKey(this.requestManager, keyData, passphrase);
	}

	public async sendTransaction(tx: Transaction, passphrase: string) {
		return rpcWrappers.sendTransaction(this.requestManager, tx, passphrase);
	}

	public async signTransaction(tx: Transaction, passphrase: string) {
		return rpcWrappers.signTransaction(this.requestManager, tx, passphrase);
	}

	public async sign(data: HexString, address: Address, passphrase: string) {
		return rpcWrappers.sign(this.requestManager, data, address, passphrase);
	}

	public async ecRecover(signedData: HexString, signature: string) {
		return rpcWrappers.ecRecover(this.requestManager, signedData, signature);
	}
}

export default EthPersonal;
