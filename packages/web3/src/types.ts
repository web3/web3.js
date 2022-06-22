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

import { EthExecutionAPI } from 'web3-common';
import { SupportedProviders } from 'web3-core';
import Eth from 'web3-eth';
import {
	encodeFunctionSignature,
	encodeFunctionCall,
	encodeParameter,
	encodeParameters,
	decodeParameter,
	decodeParameters,
	decodeLog,
	ContractAbi,
} from 'web3-eth-abi';
import {
	create,
	privateKeyToAccount,
	recoverTransaction,
	hashMessage,
	recover,
	encrypt,
	decrypt,
	sign,
	signTransaction,
} from 'web3-eth-accounts';
import Contract, { ContractInitOptions } from 'web3-eth-contract';
import { ENS } from 'web3-eth-ens';
import { Iban } from 'web3-eth-iban';
import { Address } from 'web3-utils';

/**
 * Extended **Contract** constructor for main `web3` object.
 */
export type Web3ContractConstructor<Abi extends ContractAbi> = Omit<typeof Contract, 'new'> & {
	new (jsonInterface: Abi, address?: Address, options?: ContractInitOptions): Contract<Abi>;
	setProvider: (provider: SupportedProviders<EthExecutionAPI>) => void;
};

/**
 * The ethereum interface for main web3 object. It provides extra methods in addition to `web3-eth` interface.
 *
 * {@link web3_eth.Web3Eth} for details about the `Eth` interface.
 */
export interface Web3EthInterface extends Eth {
	Contract: Web3ContractConstructor<any>;
	Iban: typeof Iban;
	ens: ENS;
	abi: {
		encodeEventSignature: typeof encodeFunctionSignature;
		encodeFunctionCall: typeof encodeFunctionCall;
		encodeFunctionSignature: typeof encodeFunctionSignature;
		encodeParameter: typeof encodeParameter;
		encodeParameters: typeof encodeParameters;
		decodeParameter: typeof decodeParameter;
		decodeParameters: typeof decodeParameters;
		decodeLog: typeof decodeLog;
	};
	accounts: {
		create: typeof create;
		privateKeyToAccount: typeof privateKeyToAccount;
		signTransaction: typeof signTransaction;
		recoverTransaction: typeof recoverTransaction;
		hashMessage: typeof hashMessage;
		sign: typeof sign;
		recover: typeof recover;
		encrypt: typeof encrypt;
		decrypt: typeof decrypt;
	};
}
