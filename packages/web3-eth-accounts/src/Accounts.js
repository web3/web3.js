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
 * @file Accounts.js
 * @author Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import {encodeSignature, recover} from 'eth-lib/lib/account'; // TODO: Remove this dependency
import {AbstractWeb3Module} from 'web3-core';
import Account from './models/Account';
import Wallet from './models/Wallet';

// TODO: Rename Accounts module to Wallet and move the Wallet class to the eth module.
export default class Accounts extends AbstractWeb3Module {
    /**
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {Object} formatters
     * @param {Utils} utils
     * @param {MethodFactory} methodFactory
     * @param {Object} options
     * @param {Net.Socket} net
     *
     * @constructor
     */
    constructor(provider, utils, formatters, methodFactory, options, net) {
        super(provider, options, methodFactory, net);

        this.utils = utils;
        this.formatters = formatters;
        this.transactionSigner = options.transactionSigner;
        this.defaultKeyName = 'web3js_wallet';
        this.accounts = {};
        this.accountsIndex = 0;
        this.wallet = new Wallet(utils, this);
    }

    /**
     * Creates an account with a given entropy
     *
     * @method create
     *
     * @param {String} entropy
     *
     * @returns {Account}
     */
    create(entropy) {
        return Account.from(entropy, this);
    }

    /**
     * Creates an Account object from a privateKey
     *
     * @method privateKeyToAccount
     *
     * @param {String} privateKey
     *
     * @returns {Account}
     */
    privateKeyToAccount(privateKey) {
        return Account.fromPrivateKey(privateKey, this);
    }

    /**
     * Hashes a given message
     *
     * @method hashMessage
     *
     * @param {String} data
     *
     * @returns {String}
     */
    hashMessage(data) {
        if (this.utils.isHexStrict(data)) {
            data = this.utils.hexToBytes(data);
        }

        const messageBuffer = Buffer.from(data);
        const preambleBuffer = Buffer.from(`\u0019Ethereum Signed Message:\n${data.length}`);
        const ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);

        return Hash.keccak256s(ethMessage);
    }

    /**
     * TODO: Add deprecation message and extend the signTransaction method in the eth module
     *
     * Signs a transaction object with the given privateKey
     *
     * @method signTransaction
     *
     * @param {Object} tx
     * @param {String} privateKey
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object>}
     */
    async signTransaction(tx, privateKey, callback) {
        try {
            const account = Account.fromPrivateKey(privateKey, this);

            if (!tx.chainId) {
                tx.chainId = await this.getChainId();
            }

            if (!tx.gasPrice) {
                tx.gasPrice = await this.getGasPrice();
            }

            if (!tx.nonce) {
                tx.nonce = await this.getTransactionCount(account.address);
            }

            tx = this.formatters.inputCallFormatter(tx, this.moduleInstance);

            const signedTransaction = await this.transactionSigner.sign(tx, account.privateKey);

            if (isFunction(callback)) {
                callback(false, signedTransaction);
            }

            return signedTransaction;
        } catch (error) {
            if (isFunction(callback)) {
                callback(error, null);

                return;
            }

            throw error;
        }
    }

    /**
     * Recovers transaction
     *
     * @method recoverTransaction
     *
     * @param {String} rawTx
     *
     * @returns {String}
     */
    recoverTransaction(rawTx) {
        const values = RLP.decode(rawTx);
        const signature = encodeSignature(values.slice(6, 9));
        const recovery = Bytes.toNumber(values[6]);
        const extraData = recovery < 35 ? [] : [Bytes.fromNumber((recovery - 35) >> 1), '0x', '0x'];
        const signingData = values.slice(0, 6).concat(extraData);
        const signingDataHex = RLP.encode(signingData);

        return recover(Hash.keccak256(signingDataHex), signature);
    }

    /**
     * Signs a string with the given privateKey
     *
     * @method sign
     *
     * @param {String} data
     * @param {String} privateKey
     *
     * @returns {Object}
     */
    sign(data, privateKey) {
        if (this.utils.isHexStrict(data)) {
            data = this.utils.hexToBytes(data);
        }

        return Account.fromPrivateKey(privateKey, this).sign(data);
    }

    /**
     * Recovers the Ethereum address which was used to sign the given data.
     *
     * @method recover
     *
     * @param {String|Object} message
     * @param {String} signature
     * @param {Boolean} preFixed
     *
     * @returns {String}
     */
    recover(message, signature, preFixed) {
        if (isObject(message)) {
            return this.recover(message.messageHash, encodeSignature([message.v, message.r, message.s]), true);
        }

        if (!preFixed) {
            message = this.hashMessage(message);
        }

        if (arguments.length >= 4) {
            // v, r, s
            return this.recover(
                arguments[0],
                encodeSignature([arguments[1], arguments[2], arguments[3]]),
                !!arguments[4]
            );
        }

        return recover(message, signature);
    }

    /**
     * Decrypts account
     *
     * Note: Taken from https://github.com/ethereumjs/ethereumjs-wallet
     *
     * @method decrypt
     *
     * @param {Object|String} v3Keystore
     * @param {String} password
     * @param {Boolean} nonStrict
     *
     * @returns {Account}
     */
    decrypt(v3Keystore, password, nonStrict) {
        return Account.fromV3Keystore(v3Keystore, password, nonStrict, this);
    }

    /**
     * Encrypts the account
     *
     * @method encrypt
     *
     * @param {String} privateKey
     * @param {String} password
     * @param {Object} options
     *
     * @returns {Object}
     */
    encrypt(privateKey, password, options) {
        return Account.fromPrivateKey(privateKey, this).toV3Keystore(password, options);
    }
}
