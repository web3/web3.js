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
import { Block, FMT_NUMBER, Web3PromiEvent } from 'web3-common';
import { AbiEventFragment } from 'web3-eth-abi';
import { ReceiptInfo, SendTransactionEvents, TransactionInfo, Web3Eth } from '../../src';
import { BasicAbi } from '../shared_fixtures/build/Basic';

type SendFewTxParams = {
	web3Eth: Web3Eth;
	to: string;
	from: string;
	value: string;
	times?: number;
};
export type Resolve = (value?: ReceiptInfo) => void;
export const sendFewTxes = async ({
	web3Eth,
	to,
	value,
	from,
	times = 3,
}: SendFewTxParams): Promise<ReceiptInfo[]> => {
	const res = [];
	for (let i = 0; i < times; i += 1) {
		const tx: Web3PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
			to,
			value,
			from,
		});
		res.push(
			// eslint-disable-next-line no-await-in-loop
			(await new Promise((resolve: Resolve) => {
				// tx promise is handled separately
				// eslint-disable-next-line no-void
				void tx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe(BigInt(1));
					resolve(params);
				});
			})) as ReceiptInfo,
		);
	}
	return res;
};

const checkHex = (hash: string, length = 64) => {
	expect(String(hash)).toBeDefined();
	expect(String(hash)).toHaveLength(length + 2);
	expect(new RegExp(`0x[abcdef0-9]{${length}}`, 'i').test(hash)).toBe(true);
};

type ExpectOptions = {
	type?: number;
};
export const validateTransaction = (
	tx: TransactionInfo,
	expectOptions: ExpectOptions = { type: 0 },
) => {
	expect(tx.nonce).toBeDefined();
	checkHex(String(tx.hash));
	expect(Number(tx.type)).toBe(expectOptions.type);
	checkHex(String(tx.blockHash));
	expect(Number(tx.blockNumber)).toBeGreaterThan(0);
	expect(tx.transactionIndex).toBeDefined();
	checkHex(tx.from, 40);
	checkHex(String(tx.to), 40);
	expect(Number(tx.value)).toBe(1);
	expect(tx.input).toBe('0x');
	expect(tx.r).toBeDefined();
	expect(tx.s).toBeDefined();
	expect(Number(tx.gas)).toBeGreaterThan(0);
};
export const validateBlock = (b: Block) => {
	expect(b.nonce).toBeDefined();
	expect(Number(b.baseFeePerGas)).toBeGreaterThan(0);
	expect(b.number).toBeDefined();
	checkHex(String(b.hash));
	checkHex(b.parentHash);
	checkHex(b.sha3Uncles);
	checkHex(b.transactionsRoot);
	checkHex(b.receiptsRoot);
	expect(b.logsBloom).toBeDefined();
	checkHex(b.miner, 40);
	expect(b.difficulty).toBeDefined();
	checkHex(b.stateRoot);
	expect(b.gasLimit).toBeDefined();
	expect(b.gasUsed).toBeDefined();
	expect(b.timestamp).toBeDefined();
	expect(b.extraData).toBeDefined();
	checkHex(String(b.mixHash));
	expect(b.totalDifficulty).toBeDefined();
	expect(b.baseFeePerGas).toBeDefined();
	expect(b.size).toBeDefined();
	expect(Array.isArray(b.transactions)).toBe(true);
	expect(Array.isArray(b.uncles)).toBe(true);
};
export const validateReceipt = (r: ReceiptInfo) => {
	checkHex(String(r.transactionHash));
	expect(r.transactionIndex).toBeDefined();
	checkHex(String(r.blockHash));
	expect(r.blockNumber).toBeDefined();
	checkHex(String(r.from), 40);
	checkHex(String(r.to), 40);
	expect(r.cumulativeGasUsed).toBeDefined();
	expect(r.gasUsed).toBeDefined();
	expect(r.effectiveGasPrice).toBeDefined();
	expect(r.logs).toBeDefined();
	expect(r.logsBloom).toBeDefined();
	expect(r.status).toBeDefined();
	checkHex(String(r.transactionHash));
	expect(Number(r.gasUsed)).toBeGreaterThan(0);
};

export const mapFormatToType: { [key: string]: string } = {
	[FMT_NUMBER.NUMBER]: 'number',
	[FMT_NUMBER.HEX]: 'string',
	[FMT_NUMBER.STR]: 'string',
	[FMT_NUMBER.BIGINT]: 'bigint',
};
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const eventAbi: AbiEventFragment = BasicAbi.find((e: any) => {
	return e.name === 'StringEvent' && (e as AbiEventFragment).type === 'event';
})! as AbiEventFragment;
