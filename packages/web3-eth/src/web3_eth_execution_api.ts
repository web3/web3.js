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

import { EthExecutionAPI, TransactionInfo } from 'web3-common';
import { Address, BlockNumberOrTag, HexString32Bytes, Uint } from 'web3-utils';

export interface StorageProof {
	readonly key: HexString32Bytes;
	readonly value: Uint;
	readonly proof: HexString32Bytes[];
}

export interface AccountObject {
	readonly balance: Uint;
	readonly codeHash: HexString32Bytes;
	readonly nonce: Uint;
	readonly storageHash: HexString32Bytes;
	readonly accountProof: HexString32Bytes[];
	readonly storageProof: StorageProof[];
}

export type Web3EthExecutionAPI = EthExecutionAPI & {
	eth_pendingTransactions: () => TransactionInfo[];

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md
	eth_requestAccounts: () => Address[];

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md
	eth_chainId: () => Uint;

	web3_clientVersion: () => string;

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1186.md
	eth_getProof: (
		address: Address,
		storageKey: HexString32Bytes,
		blockNumber: BlockNumberOrTag,
	) => AccountObject;
};
