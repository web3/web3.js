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
import { Buffer } from 'buffer';
import { RLP } from '@ethereumjs/rlp';
import { Chain, Common, Hardfork } from '../../../src/common';
import {
	arrToBufArr,
	bufferToBigInt,
	bufferToHex,
	intToBuffer,
	toBuffer,
	unpadBuffer,
} from '../../../src/common/utils';

import { Transaction } from '../../../src';
import type { TxData } from '../../../src';
import txFixturesEip155 from '../../fixtures/json/ttTransactionTestEip155VitaliksTests.json';
import txFixtures from '../../fixtures/json/txs.json';

describe('[Transaction]', () => {
	const transactions: Transaction[] = [];

	it('cannot input decimal or negative values', () => {
		const values = ['gasPrice', 'gasLimit', 'nonce', 'value', 'v', 'r', 's'];
		const cases = [
			10.1,
			'10.1',
			'0xaa.1',
			-10.1,
			-1,
			BigInt(-10),
			'-100',
			'-10.1',
			'-0xaa',
			Infinity,
			-Infinity,
			NaN,
			{},
			true,
			false,
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			() => {},
			Number.MAX_SAFE_INTEGER + 1,
		];
		for (const value of values) {
			const txData: any = {};
			for (const testCase of cases) {
				txData[value] = testCase;
				expect(() => {
					Transaction.fromTxData(txData);
				}).toThrow();
			}
		}
	});

	it('Initialization', () => {
		const nonEIP2930Common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul });
		expect(Transaction.fromTxData({}, { common: nonEIP2930Common })).toBeTruthy();

		const txData = txFixtures[3].raw.map(toBuffer);
		txData[6] = intToBuffer(45); // v with 0-parity and chain ID 5
		let tx = Transaction.fromValuesArray(txData);
		expect(tx.common.chainId() === BigInt(5)).toBe(true);

		txData[6] = intToBuffer(46); // v with 1-parity and chain ID 5
		tx = Transaction.fromValuesArray(txData);
		expect(tx.common.chainId() === BigInt(5)).toBe(true);

		txData[6] = intToBuffer(2033); // v with 0-parity and chain ID 999
		tx = Transaction.fromValuesArray(txData);
		expect(tx.common.chainId()).toEqual(BigInt(999));

		txData[6] = intToBuffer(2034); // v with 1-parity and chain ID 999
		tx = Transaction.fromValuesArray(txData);
		expect(tx.common.chainId()).toEqual(BigInt(999));
	});

	it('Initialization -> decode with fromValuesArray()', () => {
		for (const tx of txFixtures.slice(0, 4)) {
			const txData = tx.raw.map(toBuffer);
			const pt = Transaction.fromValuesArray(txData);

			expect(bufferToHex(unpadBuffer(toBuffer(pt.nonce)))).toEqual(tx.raw[0]);
			expect(bufferToHex(toBuffer(pt.gasPrice))).toEqual(tx.raw[1]);
			expect(bufferToHex(toBuffer(pt.gasLimit))).toEqual(tx.raw[2]);
			expect(pt.to?.toString()).toEqual(tx.raw[3]);
			expect(bufferToHex(unpadBuffer(toBuffer(pt.value)))).toEqual(tx.raw[4]);
			expect(`0x${pt.data.toString('hex')}`).toEqual(tx.raw[5]);
			expect(bufferToHex(toBuffer(pt.v))).toEqual(tx.raw[6]);
			expect(bufferToHex(toBuffer(pt.r))).toEqual(tx.raw[7]);
			expect(bufferToHex(toBuffer(pt.s))).toEqual(tx.raw[8]);

			transactions.push(pt);
		}
	});

	it('Initialization -> should accept lesser r values', () => {
		const tx = Transaction.fromTxData({ r: bufferToBigInt(toBuffer('0x0005')) });
		expect(tx.r!.toString(16)).toBe('5');
	});

	it('Initialization -> throws when creating a a transaction with incompatible chainid and v value', () => {
		let common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Petersburg });
		let tx = Transaction.fromTxData({}, { common });
		expect(tx.common.chainId()).toEqual(BigInt(5));
		const privKey = Buffer.from(txFixtures[0].privateKey, 'hex');
		tx = tx.sign(privKey);
		const serialized = tx.serialize();
		common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg });
		expect(() => Transaction.fromSerializedTx(serialized, { common })).toThrow();
	});

	it('Initialization -> throws if v is set to an EIP155-encoded value incompatible with the chain id', () => {
		expect(() => {
			const common = new Common({ chain: 42, hardfork: Hardfork.Petersburg });
			Transaction.fromTxData({ v: BigInt(1) }, { common });
		}).toThrow();
	});

	it('validate() -> should validate with string option', () => {
		for (const tx of transactions) {
			expect(typeof tx.validate(true)[0]).toBe('string');
		}
	});

	it('getBaseFee() -> should return base fee', () => {
		const tx = Transaction.fromTxData({});
		expect(tx.getBaseFee()).toEqual(BigInt(53000));
	});

	it('getDataFee() -> should return data fee', () => {
		let tx = Transaction.fromTxData({});
		expect(tx.getDataFee()).toEqual(BigInt(0));

		tx = Transaction.fromValuesArray(txFixtures[3].raw.map(toBuffer));
		expect(tx.getDataFee()).toEqual(BigInt(1716));

		tx = Transaction.fromValuesArray(txFixtures[3].raw.map(toBuffer), { freeze: false });
		expect(tx.getDataFee()).toEqual(BigInt(1716));
	});

	it('getDataFee() -> should return correct data fee for istanbul', () => {
		const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul });
		let tx = Transaction.fromTxData({}, { common });
		expect(tx.getDataFee()).toEqual(BigInt(0));

		tx = Transaction.fromValuesArray(txFixtures[3].raw.map(toBuffer), {
			common,
		});
		expect(tx.getDataFee()).toEqual(BigInt(1716));
	});

	it('getDataFee() -> should invalidate cached value on hardfork change', () => {
		const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium });
		const tx = Transaction.fromValuesArray(txFixtures[0].raw.map(toBuffer), {
			common,
		});
		expect(tx.getDataFee()).toEqual(BigInt(656));
		tx.common.setHardfork(Hardfork.Istanbul);
		expect(tx.getDataFee()).toEqual(BigInt(240));
	});

	it('getUpfrontCost() -> should return upfront cost', () => {
		const tx = Transaction.fromTxData({
			gasPrice: 1000,
			gasLimit: 10000000,
			value: 42,
		});
		expect(tx.getUpfrontCost()).toEqual(BigInt(10000000042));
	});

	it('serialize()', () => {
		for (const [i, tx] of transactions.entries()) {
			const s1 = tx.serialize();
			const s2 = Buffer.from(RLP.encode(txFixtures[i].raw));
			expect(s1.equals(s2)).toBe(true);
		}
	});

	it('serialize() -> should round trip decode a tx', () => {
		const tx = Transaction.fromTxData({ value: 5000 });
		const s1 = tx.serialize();

		const s1Rlp = toBuffer(`0x${s1.toString('hex')}`);
		const tx2 = Transaction.fromSerializedTx(s1Rlp);
		const s2 = tx2.serialize();

		expect(s1.equals(s2)).toBe(true);
	});

	it('hash() / getMessageToSign(true) / getMessageToSign(false)', () => {
		const common = new Common({
			chain: Chain.Mainnet,
			hardfork: Hardfork.TangerineWhistle,
		});

		let tx = Transaction.fromValuesArray(txFixtures[3].raw.slice(0, 6).map(toBuffer), {
			common,
		});
		expect(() => {
			tx.hash();
		}).toThrow();
		tx = Transaction.fromValuesArray(txFixtures[3].raw.map(toBuffer), {
			common,
		});
		expect(tx.hash()).toEqual(
			Buffer.from('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa', 'hex'),
		);
		expect(tx.getMessageToSign()).toEqual(
			Buffer.from('61e1ec33764304dddb55348e7883d4437426f44ab3ef65e6da1e025734c03ff0', 'hex'),
		);
		expect(tx.getMessageToSign(false)).toHaveLength(6);
		expect(tx.hash()).toEqual(
			Buffer.from('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa', 'hex'),
		);
	});

	it('hash() -> with defined chainId', () => {
		const tx = Transaction.fromValuesArray(txFixtures[4].raw.map(toBuffer));
		expect(tx.hash().toString('hex')).toBe(
			'0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4',
		);
		expect(tx.hash().toString('hex')).toBe(
			'0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4',
		);
		expect(tx.getMessageToSign().toString('hex')).toBe(
			'f97c73fdca079da7652dbc61a46cd5aeef804008e057be3e712c43eac389aaf0',
		);
	});

	it("getMessageToSign(), getSenderPublicKey() (implicit call) -> verify EIP155 signature based on Vitalik's tests", () => {
		for (const tx of txFixturesEip155) {
			const pt = Transaction.fromSerializedTx(toBuffer(tx.rlp));
			expect(pt.getMessageToSign().toString('hex')).toEqual(tx.hash);
			expect(`0x${pt.serialize().toString('hex')}`).toEqual(tx.rlp);
			expect(pt.getSenderAddress().toString()).toBe(`0x${tx.sender}`);
		}
	});

	it('getMessageToSign(), sign(), getSenderPublicKey() (implicit call) -> verify EIP155 signature before and after signing', () => {
		// Inputs and expected results for this test are taken directly from the example in https://eips.ethereum.org/EIPS/eip-155
		const txRaw = [
			'0x09',
			'0x4a817c800',
			'0x5208',
			'0x3535353535353535353535353535353535353535',
			'0x0de0b6b3a7640000',
			'0x',
		];
		const privateKey = Buffer.from(
			'4646464646464646464646464646464646464646464646464646464646464646',
			'hex',
		);
		const pt = Transaction.fromValuesArray(txRaw.map(toBuffer));

		// Note that Vitalik's example has a very similar value denoted "signing data".
		// It's not the output of `serialize()`, but the pre-image of the hash returned by `tx.hash(false)`.
		// We don't have a getter for such a value in Transaction.
		expect(pt.serialize().toString('hex')).toBe(
			'ec098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a764000080808080',
		);
		const signedTx = pt.sign(privateKey);
		expect(signedTx.getMessageToSign().toString('hex')).toBe(
			'daf5a779ae972f972197303d7b574746c7ef83eadac0f2791ad23db92e4c8e53',
		);
		expect(signedTx.serialize().toString('hex')).toBe(
			'f86c098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a028ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276a067cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83',
		);
	});

	it('sign(), getSenderPublicKey() (implicit call) -> EIP155 hashing when singing', () => {
		const common = new Common({ chain: 1, hardfork: Hardfork.Petersburg });
		for (const txData of txFixtures.slice(0, 3)) {
			const tx = Transaction.fromValuesArray(txData.raw.slice(0, 6).map(toBuffer), {
				common,
			});

			const privKey = Buffer.from(txData.privateKey, 'hex');
			const txSigned = tx.sign(privKey);

			expect(txSigned.getSenderAddress().toString()).toBe(`0x${txData.sendersAddress}`);
		}
	});

	it('sign(), serialize(): serialize correctly after being signed with EIP155 Signature for tx created on ropsten', () => {
		const txRaw = [
			'0x1',
			'0x02540be400',
			'0x5208',
			'0xd7250824390ec5c8b71d856b5de895e271170d9d',
			'0x0de0b6b3a7640000',
			'0x',
		];
		const privateKey = Buffer.from(
			'DE3128752F183E8930D7F00A2AAA302DCB5E700B2CBA2D8CA5795660F07DEFD5',
			'hex',
		);
		const common = new Common({ chain: 1 });
		const tx = Transaction.fromValuesArray(txRaw.map(toBuffer), { common });
		const signedTx = tx.sign(privateKey);
		expect(signedTx.serialize().toString('hex')).toBe(
			'f86c018502540be40082520894d7250824390ec5c8b71d856b5de895e271170d9d880de0b6b3a76400008026a05e5c85a426b11e1ba5d9b567e904818a33975962942f538d247cd7391f5fb27aa00c8ec23ca4a3cdc2515916e4adc89676ce124fd7d0ddbb3ddd37c441dd584c21',
		);
	});

	it('sign(), verifySignature(): should ignore any previous signature when decided if EIP155 should be used in a new one', () => {
		const txData: TxData = {
			data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
			gasLimit: '0x15f90',
			gasPrice: '0x1',
			nonce: '0x01',
			to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
			value: '0x0',
		};

		const privateKey = Buffer.from(
			'4646464646464646464646464646464646464646464646464646464646464646',
			'hex',
		);

		const common = new Common({
			chain: Chain.Mainnet,
			hardfork: Hardfork.TangerineWhistle,
		});

		const fixtureTxSignedWithoutEIP155 = Transaction.fromTxData(txData, {
			common,
		}).sign(privateKey);
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		let signedWithEIP155 = Transaction.fromTxData(<any>txData).sign(privateKey);

		expect(signedWithEIP155.verifySignature()).toBe(true);
		expect(signedWithEIP155.v?.toString(16)).not.toBe('1c');
		expect(signedWithEIP155.v?.toString(16)).not.toBe('1b');
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		signedWithEIP155 = Transaction.fromTxData(<any>fixtureTxSignedWithoutEIP155.toJSON()).sign(
			privateKey,
		);

		expect(signedWithEIP155.verifySignature()).toBe(true);
		expect(signedWithEIP155.v?.toString(16)).not.toBe('1c');
		expect(signedWithEIP155.v?.toString(16)).not.toBe('1b');
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		let signedWithoutEIP155 = Transaction.fromTxData(<any>txData, {
			common,
		}).sign(privateKey);

		expect(signedWithoutEIP155.verifySignature()).toBe(true);
		expect(
			signedWithoutEIP155.v?.toString(16) === '1c' ||
				signedWithoutEIP155.v?.toString(16) === '1b',
		).toBe(true);
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		signedWithoutEIP155 = Transaction.fromTxData(<any>txData, {
			common,
		}).sign(privateKey);

		expect(signedWithoutEIP155.verifySignature()).toBe(true);
		expect(
			signedWithoutEIP155.v?.toString(16) === '1c' ||
				signedWithoutEIP155.v?.toString(16) === '1b',
		).toBe(true);
	});

	it('constructor: throw on legacy transactions which have v !== 27 and v !== 28 and v < 37', () => {
		function getTxData(v: number) {
			return {
				v,
			};
		}
		for (let n = 0; n < 27; n += 1) {
			expect(() => Transaction.fromTxData(getTxData(n))).toThrow();
		}
		expect(() => Transaction.fromTxData(getTxData(29))).toThrow();
		expect(() => Transaction.fromTxData(getTxData(36))).toThrow();

		expect(() => Transaction.fromTxData(getTxData(27))).not.toThrow();
		expect(() => Transaction.fromTxData(getTxData(28))).not.toThrow();
		expect(() => Transaction.fromTxData(getTxData(37))).not.toThrow();
	});

	it('sign(), verifySignature(): sign tx with chainId specified in params', () => {
		const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Petersburg });
		let tx = Transaction.fromTxData({}, { common });
		expect(tx.common.chainId()).toEqual(BigInt(5));

		const privKey = Buffer.from(txFixtures[0].privateKey, 'hex');
		tx = tx.sign(privKey);

		const serialized = tx.serialize();

		const reTx = Transaction.fromSerializedTx(serialized, { common });
		expect(reTx.verifySignature()).toBe(true);
		expect(reTx.common.chainId()).toEqual(BigInt(5));
	});

	it('freeze property propagates from unsigned tx to signed tx', () => {
		const tx = Transaction.fromTxData({}, { freeze: false });
		expect(Object.isFrozen(tx)).toBe(false);
		const privKey = Buffer.from(txFixtures[0].privateKey, 'hex');
		const signedTxn = tx.sign(privKey);
		expect(Object.isFrozen(signedTxn)).toBe(false);
	});

	it('common propagates from the common of tx, not the common in TxOptions', () => {
		const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.London });
		const pkey = Buffer.from(txFixtures[0].privateKey, 'hex');
		const txn = Transaction.fromTxData({}, { common, freeze: false });
		const newCommon = new Common({
			chain: Chain.Goerli,
			hardfork: Hardfork.London,
			eips: [2537],
		});
		expect(newCommon).not.toEqual(common);
		Object.defineProperty(txn, 'common', {
			get() {
				return newCommon;
			},
		});
		const signedTxn = txn.sign(pkey);
		expect(signedTxn.common.eips()).toContain(2537);
	});

	it('isSigned() -> returns correct values', () => {
		let tx = Transaction.fromTxData({});
		expect(tx.isSigned()).toBe(false);

		const txData: TxData = {
			data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
			gasLimit: '0x15f90',
			gasPrice: '0x1',
			nonce: '0x01',
			to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
			value: '0x0',
		};
		const privateKey = Buffer.from(
			'4646464646464646464646464646464646464646464646464646464646464646',
			'hex',
		);
		tx = Transaction.fromTxData(txData);
		expect(tx.isSigned()).toBe(false);
		tx = tx.sign(privateKey);
		expect(tx.isSigned()).toBe(true);

		tx = Transaction.fromTxData(txData);
		expect(tx.isSigned()).toBe(false);
		const rawUnsigned = tx.serialize();
		tx = tx.sign(privateKey);
		const rawSigned = tx.serialize();
		expect(tx.isSigned()).toBe(true);

		tx = Transaction.fromSerializedTx(rawUnsigned);
		expect(tx.isSigned()).toBe(false);
		tx = tx.sign(privateKey);
		expect(tx.isSigned()).toBe(true);
		tx = Transaction.fromSerializedTx(rawSigned);
		expect(tx.isSigned()).toBe(true);

		const signedValues = arrToBufArr(RLP.decode(Uint8Array.from(rawSigned))) as Buffer[];
		tx = Transaction.fromValuesArray(signedValues);
		expect(tx.isSigned()).toBe(true);
		tx = Transaction.fromValuesArray(signedValues.slice(0, 6));
		expect(tx.isSigned()).toBe(false);
	});
});
