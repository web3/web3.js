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

import { Web3Context, Web3RequestManager, isSupportedProvider } from 'web3-core';
import { Address, HexStringBytes, SupportedProviders } from 'web3-types';

import { AARpcApi, UserOperation, UserOperationRequire } from './types.js';
import { convertValuesToHex, generateUserOpHash, isUserOperationAllHex } from './utils.js';

/**
 * Account Abstraction feature allows enhancing user experience and security by allowing smart contracts to manage user accounts and transactions more flexibly.
 *
 * For using account abstraction functions, install `web3-account-abstraction` packages using: `npm i web3-account-abstraction` or `yarn add web3-account-abstraction`.
 *
 * ```ts
 *  import {AccountAbstraction} from 'web3-account-abstraction';
 *
 *  const aa = new AccountAbstraction('https://bundler-provider');
 *  aa.supportedEntryPoints().then(console.log);
 * ```
 */
export class AccountAbstraction<API extends AARpcApi> extends Web3Context {
	// local package level request manager
	private readonly bundlerRequestManager!: Web3RequestManager<API>;

	public constructor(provider?: SupportedProviders<API> | string) {
		super();

		// If "provider" is provided as "string" or an objects matching "SupportedProviders" interface
		if (
			(typeof provider === 'string' && provider.trim() !== '') ||
			isSupportedProvider(provider as SupportedProviders<API>)
		) {
			this.bundlerRequestManager = new Web3RequestManager<API>(provider);
		}
	}
	/**
	 * Sends a UserOperation to the bundler. If accepted, the bundler will add it to the UserOperation mempool and return a userOpHash.
	 *
	 * @param UserOperation - represents the structure of a transaction initiated by the user. It contains the sender, receiver, call data, maximum fee per unit of Gas, maximum priority fee, signature, nonce, and other specific elements.
	 * @param entryPoint - a singleton contract to execute bundles of UserOperations. Bundlers/Clients whitelist the supported entrypoint.
	 * @returns userOperation hash or throws error instead of balance.
	 * @example
	 * ```ts
	 * 	sendUserOperation({
	 *		sender: "0x9fd042a18e90ce326073fa70f111dc9d798d9a52",
	 *		nonce: "123",
	 *		initCode: "0x68656c6c6f",
	 *		callData: "0x776F726C64",
	 *		callGasLimit: "1000",
	 *		verificationGasLimit: "2300",
	 *		preVerificationGas: "3100",
	 *		maxFeePerGas: "8500",
	 *		maxPriorityFeePerGas: "1",
	 *		paymasterAndData: "0x626c6f63746f",
	 *		signature: "0x636c656d656e74"
	 *	},"0x636c656d656e74").then(console.log);
	 * > 0xe554d0701f7fdc734f84927d109537f1ac4ee4ebfa3670c71d224a4fa15dbcd1
	 * ```
	 */
	public async sendUserOperation(userOperation: UserOperation, entryPoint: Address) {
		let userOp = { ...userOperation };
		const validator = isUserOperationAllHex(userOp);
		if (!validator) {
			userOp = convertValuesToHex(userOperation) as UserOperation;
		}
		return (this.bundlerRequestManager ?? this.requestManager).send({
			method: 'eth_sendUserOperation',
			params: [userOp, entryPoint],
		});
	}
	/**
	 * Estimate the gas values for a UserOperation. Given UserOperation optionally without gas limits and gas prices, return the needed gas limits. The signature field is ignored by the wallet, so that the operation will not require user's approval. Still, it might require putting a "semi-valid" signature (e.g. a signature in the right length)
	 *
	 * @param UserOperation - represents the structure of a transaction initiated by the user. It contains the sender, receiver, call data, maximum fee per unit of Gas, maximum priority fee, signature, nonce, and other specific elements.
	 * @param entryPoint - a singleton contract to execute bundles of UserOperations. Bundlers/Clients whitelist the supported entrypoint.
	 * @returns - `preVerificationGas` gas overhead of this UserOperation
	 * - `verificationGasLimit` actual gas used by the validation of this UserOperation
	 * - `callGasLimit` value used by inner account execution
	 * @example
	 * ```ts
	 * 	estimateUserOperationGas({
	 *		sender: "0x9fd042a18e90ce326073fa70f111dc9d798d9a52",
	 *		nonce: "123",
	 *		initCode: "0x68656c6c6f",
	 *		callData: "0x776F726C64",
	 *		callGasLimit: "1000",
	 *		verificationGasLimit: "2300",
	 *		preVerificationGas: "3100",
	 *		maxFeePerGas: "0",
	 *		maxPriorityFeePerGas: "0",
	 *		paymasterAndData: "0x626c6f63746f",
	 *		signature: "0x636c656d656e74"
	 *	},"0x636c656d656e74").then(console.log);
	 * > {
	 * 		callGasLimit : "0x18b33",
	 *		preVerificationGas: "0xdf17",
	 *		verificationGasLimit:"0x128c4"
	 *	 }
	 * ```
	 */
	public async estimateUserOperationGas(userOperation: UserOperation, entryPoint: Address) {
		const userOp = { ...userOperation };
		if (userOperation?.maxFeePerGas === undefined) {
			userOp.maxFeePerGas = '0';
		}
		if (userOperation?.maxPriorityFeePerGas === undefined) {
			userOp.maxPriorityFeePerGas = '0';
		}
		return (this.bundlerRequestManager ?? this.requestManager).send({
			method: 'eth_estimateUserOperationGas',
			params: [userOp, entryPoint],
		});
	}
	/**
	 * Return a UserOperation based on a hash (userOpHash) returned by eth_sendUserOperation
	 *
	 * @param hash - a userOpHash value returned by `eth_sendUserOperation`
	 * @returns null in case the UserOperation is not yet included in a block, or a full UserOperation, with the addition of entryPoint, blockNumber, blockHash and transactionHash
	 * @example
	 * ```ts
	 * 	getUserOperationByHash("0xxxxx").then(console.log);
	 * > {
	 *  userOperation: {
	 *		sender: "xxxx",
	 *		nonce: "xxxx",
	 *		initCode: "0xxxxxxxxxxxxxxx",
	 *		callData: "0xxxxxxxxxxxxxxx",
	 *		callGasLimit: "xxxx",
	 *		verificationGasLimit: "xxxx",
	 *		preVerificationGas: "xxxx",
	 *		maxFeePerGas: "0",
	 *		maxPriorityFeePerGas: "0",
	 *		paymasterAndData: "0xxxxxxxxxxxxxxx",
	 *		signature: "0xxxxxxxxxxxxxxx"
	 *	},
	 *	entryPoint: '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789',
	 *	blockNumber: 39642225,
	 *	blockHash: '0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f',
	 *	transactionHash: '0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4',
	 * }
	 * ```
	 */

	public async getUserOperationByHash(hash: HexStringBytes) {
		return (this.bundlerRequestManager ?? this.requestManager).send({
			method: 'eth_getUserOperationByHash',
			params: [hash],
		});
	}
	/**
	 * Return null in case the UserOperation is not yet included in a block, or
	 *  - userOpHash the request hash
	 *  - entryPoint
	 *  - sender
	 *	- nonce
	 *	- paymaster the paymaster used for this userOp (or empty)
	 *	- actualGasCost - actual amount paid (by account or paymaster) for this UserOperation
	 *	- actualGasUsed - total gas used by this UserOperation (including preVerification, creation, validation and execution)
	 *	- success boolean - did this execution completed without revert
	 *	- reason in case of revert, this is the revert reason
	 *	- logs the logs generated by this UserOperation (not including logs of other UserOperations in the same bundle)
	 *	- receipt the TransactionReceipt object. Note that the returned TransactionReceipt is for the entire bundle, not only for this UserOperation.
	 *
	 * @param hash - hash a userOpHash value returned by `eth_sendUserOperation`
	 * @returns null in case the UserOperation is not yet included in a block, or UserOperation
	 * @example
	 * ```ts
	 * 	getUserOperationReceipt("0xa890d7c0dccfd6cebc025919f4857ab97953ae218e82f5e24c297f02ceea5b21").then(console.log);
	 * >"userOpHash": "0xa890d7c0dccfd6cebc025919f4857ab97953ae218e82f5e24c297f02ceea5b21",
		"entryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
		"sender": "0x026B37A09aF3ceB346c39999c5738F86A1a48f4d",
		"nonce": "0x7",
		"paymaster": "0xa312d8D37Be746BD09cBD9e9ba2ef16bc7Da48FF",
		"actualGasCost": "0x1a036c1638be0",
		"actualGasUsed": "0x2e8d8",
		"success": true,
		"reason": "",
		"logs": [
			{
				"address": "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
				"topics": [
					"0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972"
				],
				"data": "0x",
				"blockHash": "0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f",
				"blockNumber": "0x25ce471",
				"transactionHash": "0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4",
				"transactionIndex": "0x44",
				"logIndex": "0x12d",
				"removed": false
			},
			{
				"address": "0xfd8ec18d48ac1f46b600e231da07d1da8209ceef",
				"topics": [
					"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
					"0x0000000000000000000000000000000000000000000000000000000000000000",
					"0x000000000000000000000000026b37a09af3ceb346c39999c5738f86a1a48f4d",
					"0x000000000000000000000000000000000000000000000000000000000000007f"
				],
				"data": "0x",
				"blockHash": "0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f",
				"blockNumber": "0x25ce471",
				"transactionHash": "0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4",
				"transactionIndex": "0x44",
				"logIndex": "0x12e",
				"removed": false
			},
			{
				"address": "0x00005ea00ac477b1030ce78506496e8c2de24bf5",
				"topics": [
					"0xe90cf9cc0a552cf52ea6ff74ece0f1c8ae8cc9ad630d3181f55ac43ca076b7d6",
					"0x000000000000000000000000fd8ec18d48ac1f46b600e231da07d1da8209ceef",
					"0x000000000000000000000000026b37a09af3ceb346c39999c5738f86a1a48f4d",
					"0x0000000000000000000000000000a26b00c1f0df003000390027140000faa719"
				],
				"data": "0x000000000000000000000000026b37a09af3ceb346c39999c5738f86a1a48f4d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000000",
				"blockHash": "0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f",
				"blockNumber": "0x25ce471",
				"transactionHash": "0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4",
				"transactionIndex": "0x44",
				"logIndex": "0x12f",
				"removed": false
			},
			{
				"address": "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
				"topics": [
					"0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f",
					"0xa890d7c0dccfd6cebc025919f4857ab97953ae218e82f5e24c297f02ceea5b21",
					"0x000000000000000000000000026b37a09af3ceb346c39999c5738f86a1a48f4d",
					"0x000000000000000000000000a312d8d37be746bd09cbd9e9ba2ef16bc7da48ff"
				],
				"data": "0x000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000001a036c1638be0000000000000000000000000000000000000000000000000000000000002e8d8",
				"blockHash": "0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f",
				"blockNumber": "0x25ce471",
				"transactionHash": "0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4",
				"transactionIndex": "0x44",
				"logIndex": "0x130",
				"removed": false
			}
		],
		"receipt": {
			"transactionHash": "0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4",
			"transactionIndex": "0x44",
			"blockHash": "0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f",
			"blockNumber": "0x25ce471",
			"from": "0x1e6754b227c6ae4b0ca61d82f79d60660737554a",
			"to": "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
			"cumulativeGasUsed": "0x1716d3b",
			"gasUsed": "0x2b6c6",
			"contractAddress": null,
			"logs": [
				{
					"address": "0xfd8ec18d48ac1f46b600e231da07d1da8209ceef",
					"topics": [
						"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
						"0x0000000000000000000000000000000000000000000000000000000000000000",
						"0x000000000000000000000000026b37a09af3ceb346c39999c5738f86a1a48f4d",
						"0x000000000000000000000000000000000000000000000000000000000000007f"
					],
					"data": "0x",
					"blockHash": "0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f",
					"blockNumber": "0x25ce471",
					"transactionHash": "0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4",
					"transactionIndex": "0x44",
					"logIndex": "0x12e",
					"removed": false
				},
			],
			"status": "0x1",
			"logsBloom": "0x000000000000000000000000000000000008000000000000000000000000000000080000000000000002001108040020001080000000000000000200004000000000000000000000000800080000008000000000000000000001000208400040000000000a0008000000000000000800000000000000004080800010020100040000000000000000100000000000010000000000200080000000000000000000210000000000000000400080000000000000000000000000108002000004004008000002000000000001001000800000000001000000800000148040020020000000000000000000000001000000000100000000000000000000002000100000",
			"type": "0x2",
			"effectiveGasPrice": "0x59682f2e"
		}
	 * ```
	 */
	public async getUserOperationReceipt(hash: HexStringBytes) {
		return (this.bundlerRequestManager ?? this.requestManager).send({
			method: 'eth_getUserOperationReceipt',
			params: [hash],
		});
	}
	/**
	 * Returns an array of the entryPoint addresses supported by the client. The first element of the array SHOULD be the entryPoint addressed preferred by the client.
	 * @returns an array of the entryPoint addresses supported by the client. The first element of the array SHOULD be the entryPoint addressed preferred by the client.
	 * @example
	 * ```ts
	 * 	supportedEntryPoints().then(console.log);
	 * > ["0xcd01C8aa8995A59eB7B2627E69b40e0524B5ecf8", "0x7A0A0d159218E6a2f407B99173A2b12A6DDfC2a6"]
	 * ```
	 */
	public async supportedEntryPoints() {
		return (this.bundlerRequestManager ?? this.requestManager).send({
			method: 'eth_supportedEntryPoints',
			params: [],
		});
	}

	/**
	 * calculate UserOperationHash
	 * @param userOp - a structure that describes a transaction to be sent on behalf of a user.
	 * @param entryPoint -  a singleton contract to execute bundles of UserOperations. Bundlers/Clients whitelist the supported entrypoint.
	 * @returns an array of the entryPoint addresses supported by the client. The first element of the array SHOULD be the entryPoint addressed preferred by the client.
	 * @example
	 * ```ts
	 * generateUserOpHash({
	 *		sender: "0x9fd042a18e90ce326073fa70f111dc9d798d9a52",
	 *		nonce: "123",
	 *		initCode: "0x68656c6c6f",
	 *		callData: "0x776F726C64",
	 *		callGasLimit: "1000",
	 *		verificationGasLimit: "2300",
	 *		preVerificationGas: "3100",
	 *		maxFeePerGas: "0",
	 *		maxPriorityFeePerGas: "0",
	 *		paymasterAndData: "0x626c6f63746f",
	 *		signature: "0x636c656d656e74"
	 *	},"0x636c656d656e74", '0x1').then(console.log);
	 * > 0xxxx
	 * ```
	 */
	// eslint-disable-next-line class-methods-use-this
	public generateUserOpHash(userOp: UserOperationRequire, entryPoint: string, chainId: string) {
		return generateUserOpHash(userOp, entryPoint, chainId);
	}
}
