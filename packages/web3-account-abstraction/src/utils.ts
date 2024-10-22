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

import { Address, AbiInput, Uint256, HexStringBytes } from 'web3-types';
import { encodeParameters } from 'web3-eth-abi';
import { sha3 } from 'web3-utils';
import { isHexStrict } from 'web3-validator';
import { UserOperation, UserOperationRequire } from './types.js';

export const convertValuesToHex = (obj: Record<string, any>): Record<string, any> => {
	const hexObj: Record<string, any> = {};

	Object.entries(obj).forEach(([key, value]) => {
		if (typeof value === 'string') {
			hexObj[key] = value.startsWith('0x') ? value : `0x${value}`;
		} else if (typeof value === 'number' || typeof value === 'bigint') {
			hexObj[key] = `0x${value.toString(16)}`;
		} else if (typeof value === 'boolean') {
			hexObj[key] = value ? '0x1' : '0x0';
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			hexObj[key] = value;
		}
	});

	return hexObj;
};

const sha3Checked = (data: string): string => {
	const result = sha3(data);
	if (result === undefined) {
		throw new Error('sha3 returned undefined');
	}
	return result;
};

export const generateUserOpHash = (
	userOp: UserOperationRequire,
	entryPoint: string,
	chainId: string,
): string => {
	const types: AbiInput[] = [
		'address',
		'uint256',
		'bytes32',
		'bytes32',
		'uint256',
		'uint256',
		'uint256',
		'uint256',
		'uint256',
		'bytes32',
	];

	const values: (Address | Uint256 | HexStringBytes)[] = [
		userOp.sender,
		userOp.nonce,
		sha3Checked(userOp.initCode),
		sha3Checked(userOp.callData),
		userOp.callGasLimit,
		userOp.verificationGasLimit,
		userOp.preVerificationGas,
		userOp.maxFeePerGas,
		userOp.maxPriorityFeePerGas,
		sha3Checked(userOp.paymasterAndData),
	];

	const packed: string = encodeParameters(types, values);

	const enctype: AbiInput[] = ['bytes32', 'address', 'uint256'];
	const encValues: string[] = [sha3Checked(packed), entryPoint, chainId];
	const enc: string = encodeParameters(enctype, encValues);

	return sha3Checked(enc);
};

/**
 * UserOperation a full user-operation struct. All fields MUST be set as hex values. empty bytes block (e.g. empty initCode) MUST be set to "0x"
 * @param userOperation - represents the structure of a transaction initiated by the user. It contains the sender, receiver, call data, maximum fee per unit of Gas, maximum priority fee, signature, nonce, and other specific elements.
 * @returns boolean
 */
export const isUserOperationAllHex = (userOperation: UserOperation): boolean =>
	Object.values(userOperation).every(isHexStrict);
