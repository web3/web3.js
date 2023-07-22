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

import { encodeParameters } from 'web3-eth-abi';
import { AbiInput, UserOperation } from 'web3-types';
import { sha3 } from 'web3-utils';

const sha3Checked = (data: string): string => {
	const result = sha3(data);
	if (result === undefined) {
		throw new Error(`sha3 returned undefined for data: ${data}`);
	}
	return result;
};

export const generateUserOpHash = (userOp: UserOperation, entryPoint: string, chainId: string): string => {
	try {
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

		const values: (string | number)[] = [
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
	} catch (error) {
		console.error(error);
		throw error;
	}
};