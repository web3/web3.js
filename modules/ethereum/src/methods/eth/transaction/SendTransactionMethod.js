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
/**
 * @file EthSendTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import AbstractTransactionMethod from "../../../../lib/methods/eth/transaction/AbstractTransactionMethod";
import GetTransactionCountMethod from "../account/GetTransactionCountMethod";
import ChainIdMethod from "../../net/ChainIdMethod";
import GetGasPriceMethod from "../node/GetGasPriceMethod";

export default class SendTransactionMethod extends AbstractTransactionMethod {
    /**
     * @param {Array} parameters
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    constructor(parameters, config) {
        super('eth_sendTransaction', 1, parameters, config);
    }

    /**
     * Checks if gasPrice is set, sends the request and returns a PromiEvent Object
     *
     * @method execute
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Transaction>}
     */
    async execute() {
        // TODO: Use estimate gas to set the gas value here if not defined by the consumer
        // if (!this.parameters[0].gas) {
        //     this.parameters[0]['gas'] = this.config.transaction.gas;
        // }

        if (!this.parameters[0].gasPrice && this.parameters[0].gasPrice !== 0) {
            if (!this.config.transaction.gasPrice) {
                this.parameters[0].gasPrice = await new GetGasPriceMethod(this.config).execute()
            }

            this.parameters[0].gasPrice = this.config.transaction.gasPrice;
        }

        if (this.hasAccounts() && this.isDefaultSigner()) {
            // TODO: Create new wallet. Probably a user password should get passed here to unlock the specific account.
            const account = this.config.wallet.getAccount(this.parameters[0].from);

            if (account) {
                return this.sendRawTransaction(account);
            }
        }

        if (this.hasCustomSigner()) {
            return this.sendRawTransaction();
        }

        return super.execute();
    }

    /**
     * Signs the transaction and executes the SendRawTransaction method.
     *
     * @method sendRawTransaction
     *
     * @param {Account} account
     *
     * @returns {Promise<Transaction>}
     */
    async sendRawTransaction(account = {}) {
        const response = await this.signTransaction(account);

        this.parameters = [response.rawTransaction];
        this.rpcMethod = 'eth_sendRawTransaction';

        return super.execute();
    }

    /**
     * Signs the transaction locally
     *
     * @method signTransaction
     *
     * @param {Account} account
     *
     * @returns {Promise<void>}
     */
    async signTransaction(account = {}) {
        await this.beforeExecution();

        if (!this.parameters[0].chainId) {
            this.parameters[0].chainId = await new ChainIdMethod().execute();
        }

        if (!this.parameters[0].nonce && this.parameters[0].nonce !== 0) {
            let nonce;

            if (account.nonce) {
                account.nonce = account.nonce + 1;
                nonce = account.nonce;
            }

            if (!nonce) {
                nonce = await new GetTransactionCountMethod([this.parameters[0].from, 'latest'], this.config).execute();
                account.nonce = nonce;
            }

            this.parameters[0].nonce = nonce;
        }

        let transaction = this.parameters[0];
        transaction.to = transaction.to || '0x';
        transaction.data = transaction.data || '0x';
        transaction.value = transaction.value || '0x';
        transaction.chainId = Hex.fromNumber(transaction.chainId).toString();

        delete transaction.from;

        return this.moduleInstance.transactionSigner.sign(transaction, account.privateKey);
    }

    /**
     * TODO: Find a good concept to define a custom transaction or message signer. Should this be just one Signer? Do we pass a private key to a custom signer?
     *
     * Checks if the current module has decrypted accounts
     *
     * @method isDefaultSigner
     *
     * @returns {Boolean}
     */
    isDefaultSigner() {
        return (this.config.transaction.signer instanceof Web3TransactionSigner);
    }

    /**
     * Checks if the current module has decrypted accounts
     *
     * @method hasAccounts
     *
     * @returns {Boolean}
     */
    hasAccounts() {
        return this.config.wallet && this.config.wallet.accountsCounter > 0;
    }

    /**
     * Checks if a custom signer is given.
     *
     * @method hasCustomerSigner
     *
     * @returns {Boolean}
     */
    hasCustomSigner() {
        return !(this.config.transaction.signer instanceof Web3TransactionSigner);
    }
}
