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

export interface UserOperation {
	sender: string;
	nonce: string;
	initCode: string;
	callData: string;
	callGasLimit: string;
	verificationGasLimit: string;
	preVerificationGas: string;
	maxFeePerGas: string;
	maxPriorityFeePerGas: string;
	paymasterAndData: string;
	signature: string;
}

// Interface for UserOperation without maxFeePerGas and maxPriorityFeePerGas
export interface UserOperationOptionalFees extends Omit<UserOperation, 'maxFeePerGas' | 'maxPriorityFeePerGas'> {
	maxFeePerGas?: string;
	maxPriorityFeePerGas?: string;
}
