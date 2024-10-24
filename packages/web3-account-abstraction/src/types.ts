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

import {
	Address,
	Uint256,
	HexStringBytes,
	Uint,
	HexString32Bytes,
	TransactionHash,
	LogAPI,
	TransactionReceiptAPI,
} from 'web3-types';

export type ValidInputTypes = Uint8Array | bigint | string | number | boolean;

export interface UserOperation {
	sender: Address;
	nonce: Uint256;
	initCode: HexStringBytes;
	callData: HexStringBytes;
	callGasLimit?: Uint256;
	verificationGasLimit: Uint256;
	preVerificationGas: Uint256;
	maxFeePerGas?: Uint256;
	maxPriorityFeePerGas?: Uint256;
	paymasterAndData: HexStringBytes;
	signature: HexStringBytes;
}
export interface UserOperationRequire
	extends Omit<UserOperation, 'callGasLimit' | 'maxFeePerGas' | 'maxPriorityFeePerGas'> {
	callGasLimit: Uint256;
	maxFeePerGas: Uint256;
	maxPriorityFeePerGas: Uint256;
}

export interface IUserOperation {
	readonly callData: HexStringBytes;
	readonly callGasLimit: Uint;
	readonly initCode: HexStringBytes;
	readonly maxFeePerGas: Uint;
	readonly maxPriorityFeePerGas: Uint;
	readonly nonce: Uint;
	readonly paymasterAndData: HexStringBytes;
	readonly preVerificationGas: Uint;
	readonly sender: Address;
	readonly signature: HexStringBytes;
	readonly verificationGasLimit: Uint;
}

export interface GetUserOperationByHashAPI {
	readonly blockHash: HexString32Bytes;
	readonly blockNumber: Uint;
	readonly entryPoint: Address;
	readonly transactionHash: TransactionHash;
	readonly userOperation: IUserOperation;
}

export interface EstimateUserOperationGasAPI {
	readonly preVerificationGas: Uint;
	readonly verificationGasLimit: Uint;
	readonly callGasLimit: Uint;
}

export interface GetUserOperationReceiptAPI {
	readonly userOpHash: HexString32Bytes;
	readonly entryPoint: Address;
	readonly sender: Address;
	readonly nonce: Uint;
	readonly paymaster: Address;
	readonly actualGasCost: Uint;
	readonly actualGasUsed: Uint;
	readonly success: boolean;
	readonly reason: HexStringBytes;
	readonly logs: LogAPI[];
	readonly receipt: TransactionReceiptAPI;
}

export type AARpcApi = {
	eth_sendUserOperation: (userOperation: UserOperation, entryPoint: Address) => HexString32Bytes;
	eth_estimateUserOperationGas: (
		userOperation: UserOperation,
		entryPoint: Address,
	) => EstimateUserOperationGasAPI;
	eth_getUserOperationByHash: (hash: HexStringBytes) => GetUserOperationByHashAPI;
	eth_getUserOperationReceipt: (hash: HexStringBytes) => GetUserOperationReceiptAPI;
	eth_supportedEntryPoints: () => Address[];
	generateUserOpHash: (
		userOp: UserOperationRequire,
		entryPoint: string,
		chainId: string,
	) => string;
};
