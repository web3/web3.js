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
import { Web3Context } from 'web3-core';
import { getAccounts, sendTransaction } from 'web3-eth';
import { create, decrypt, Wallet, privateKeyToAccount } from 'web3-eth-accounts';
import { Address, Web3AccountProvider } from 'web3-types';
import { DEFAULT_RETURN_FORMAT } from 'web3-utils';

import { getTestClient, getTestProvider } from './get_env';

export const createAccount = () => {
    const newAccount = create();
    return { address: newAccount.address, privateKey: newAccount.privateKey };
}

const fundGethAccount = async (fundeeAddress: Address, fundAmount: BigInt) => {
    const web3Context = new Web3Context(getTestProvider());
    const [mainAccount] = await getAccounts(web3Context);
    await sendTransaction(
        web3Context,
        {
            from: mainAccount,
            to: fundeeAddress,
            value: fundAmount.toString(16)
        },
        DEFAULT_RETURN_FORMAT
    );
}

export const fundAccount = async (fundeeAddress: Address, fundAmount: BigInt) => {
    switch (getTestClient()) {
        case 'geth':
            await fundGethAccount(fundeeAddress, fundAmount);
            break;
        case 'ganache':
            throw new Error('Not implemented');
        case 'infura':
            throw new Error('Not implemented');
        default:
            // TODO Replace errors
            throw new Error(`Test client: ${getTestClient()} not supported`);
    }
};

export const createAndFundNewAccount = async (fundAmount: BigInt) => {
    const newAccount = createAccount();
    await fundAccount(newAccount.address, fundAmount);
    return newAccount
};

export const createFundAndAddNewAccountToLocalWallet = async (fundAmount: BigInt) => {
    // TODO Function signature of decrypt may be incorrect,
    // hence the as Web3AccountProvider<any>
    const newWallet = new Wallet({
        privateKeyToAccount,
        create,
        decrypt
    } as Web3AccountProvider<any>);
    newWallet.create(1);
    // TODO wallet.get(1) should work, the method is being reported as available
    // via TypeScript, but the method isn't actually apart for newWallet
    await fundAccount(newWallet[0].address, fundAmount);
    return newWallet
};
