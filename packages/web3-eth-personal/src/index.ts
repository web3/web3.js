import { Web3Context } from 'web3-core';
import {
	Address,
	HexString,
	isHexStrict,
	toChecksumAddress,
	utf8ToHex,
	ValidTypes,
} from 'web3-utils';
import { Transaction, formatTransaction } from 'web3-eth';
import { validator } from 'web3-validator';
import { EthPersonalAPI } from './personal_api';

class EthPersonal extends Web3Context<EthPersonalAPI> {
	public async getAccounts() {
		const result = await this.requestManager.send({
			method: 'personal_listAccounts',
			params: [],
		});

		return result.map(toChecksumAddress);
	}

	public async newAccount(password: string) {
		validator.validate(['string'], [password]);

		const result = await this.requestManager.send({
			method: 'personal_newAccount',
			params: [password],
		});

		return toChecksumAddress(result);
	}

	public async unlockAccount(address: Address, password: string, unlockDuration: number) {
		validator.validate(['address', 'string', 'uint'], [address, password, unlockDuration]);

		const result = await this.requestManager.send({
			method: 'personal_unlockAccount',
			params: [address, password, unlockDuration],
		});

		return result;
	}

	public async lockAccount(address: Address) {
		validator.validate(['address'], [address]);

		const result = await this.requestManager.send({
			method: 'personal_lockAccount',
			params: [address],
		});

		return result;
	}

	public async importRawKey(keyData: HexString, passphrase: string) {
		validator.validate(['bytes', 'string'], [keyData, passphrase]);

		const result = await this.requestManager.send({
			method: 'personal_importRawKey',
			params: [keyData, passphrase],
		});

		return result;
	}

	public async sendTransaction(tx: Transaction, passphrase: string) {
		const result = await this.requestManager.send({
			method: 'personal_sendTransaction',
			params: [formatTransaction(tx, ValidTypes.HexString), passphrase],
		});

		return result;
	}

	public async signTransaction(tx: Transaction, passphrase: string) {
		const result = await this.requestManager.send({
			method: 'personal_signTransaction',
			params: [formatTransaction(tx, ValidTypes.HexString), passphrase],
		});

		return result;
	}

	public async sign(data: HexString, address: Address, passphrase: string) {
		validator.validate(['bytes', 'address', 'string'], [data, address, passphrase]);

		const dataToSign = isHexStrict(data) ? data : utf8ToHex(data);

		const result = await this.requestManager.send({
			method: 'personal_sign',
			params: [dataToSign, address, passphrase],
		});

		return result;
	}

	public async ecRecover(signedData: HexString, passphrase: string) {
		validator.validate(['bytes', 'string'], [signedData, passphrase]);

		const signedDataString = isHexStrict(signedData) ? signedData : utf8ToHex(signedData);

		const result = await this.requestManager.send({
			method: 'personal_ecRecover',
			params: [signedDataString, passphrase],
		});

		return result;
	}
}

export default EthPersonal;
