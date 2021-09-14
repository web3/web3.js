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
 * @file accounts.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

'use strict';

var core = require('web3-core');
var Method = require('web3-core-method');
var Account = require('eth-lib/lib/account');
var Hash = require('eth-lib/lib/hash');
var cryp = (typeof global === 'undefined') ? require('crypto-browserify') : require('crypto');
var scrypt = require('scrypt-js');
var uuid = require('uuid');
var utils = require('web3-utils');
var helpers = require('web3-core-helpers');
var {TransactionFactory} = require('@ethereumjs/tx');
var Common = require('@ethereumjs/common').default;
var HardForks = require('@ethereumjs/common').Hardfork;

var isNot = function(value) {
    return (typeof value === 'undefined') || value === null;
};

var Accounts = function Accounts() {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);

    // remove unecessary core functions
    delete this.BatchRequest;
    delete this.extend;

    var _ethereumCall = [
        new Method({
            name: 'getNetworkId',
            call: 'net_version',
            params: 0,
            outputFormatter: parseInt
        }),
        new Method({
            name: 'getChainId',
            call: 'eth_chainId',
            params: 0,
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'getGasPrice',
            call: 'eth_gasPrice',
            params: 0
        }),
        new Method({
            name: 'getTransactionCount',
            call: 'eth_getTransactionCount',
            params: 2,
            inputFormatter: [function(address) {
                if (utils.isAddress(address)) {
                    return address;
                } else {
                    throw new Error('Address ' + address + ' is not a valid address to get the "transactionCount".');
                }
            }, function() {
                return 'latest';
            }]
        }),
        new Method({
            name: 'getBlockByNumber',
            call: 'eth_getBlockByNumber',
            params: 2,
            inputFormatter: [function(blockNumber) {
                return blockNumber ? utils.toHex(blockNumber) : 'latest'
            }, function() {
                return false
            }]
        }),
    ];
    // attach methods to this._ethereumCall
    this._ethereumCall = {};
    _ethereumCall.forEach( (method) => {
        method.attachToObject(_this._ethereumCall);
        method.setRequestManager(_this._requestManager);
    });


    this.wallet = new Wallet(this);
};

Accounts.prototype._addAccountFunctions = function(account) {
    var _this = this;

    // add sign functions
    account.signTransaction = function signTransaction(tx, callback) {
        return _this.signTransaction(tx, account.privateKey, callback);
    };
    account.sign = function sign(data) {
        return _this.sign(data, account.privateKey);
    };

    account.encrypt = function encrypt(password, options) {
        return _this.encrypt(account.privateKey, password, options);
    };


    return account;
};

Accounts.prototype.create = function create(entropy) {
    return this._addAccountFunctions(Account.create(entropy || utils.randomHex(32)));
};

Accounts.prototype.privateKeyToAccount = function privateKeyToAccount(privateKey, ignoreLength) {
    if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
    }

    // 64 hex characters + hex-prefix
    if (!ignoreLength && privateKey.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }

    return this._addAccountFunctions(Account.fromPrivate(privateKey));
};

Accounts.prototype.signTransaction = function signTransaction(tx, privateKey, callback) {
    var _this = this,
        error = false,
        transactionOptions = {},
        hasTxSigningOptions = !!(tx && ((tx.chain && tx.hardfork) || tx.common));

    callback = callback || function() {};

    if (!tx) {
        error = new Error('No transaction object given!');

        callback(error);
        return Promise.reject(error);
    }

    function signed(tx) {
        const error = _validateTransactionForSigning(tx);

        if (error) {
            callback(error);
            return Promise.reject(error);
        }

        try {
            var transaction = helpers.formatters.inputCallFormatter(Object.assign({},tx));
            transaction.data = transaction.data || '0x';
            transaction.value = transaction.value || '0x';
            transaction.gasLimit = transaction.gasLimit || transaction.gas;
            if (transaction.type === '0x1' && transaction.accessList === undefined) transaction.accessList = []
            
            // Because tx has no @ethereumjs/tx signing options we use fetched vals.
            if (!hasTxSigningOptions) {
                transactionOptions.common = Common.forCustomChain(
                    'mainnet',
                    {
                        name: 'custom-network',
                        networkId: transaction.networkId,
                        chainId: transaction.chainId
                    },
                    transaction.hardfork || HardForks.London
                );

                delete transaction.networkId;
            } else {
                if (transaction.common) {
                    transactionOptions.common = Common.forCustomChain(
                        transaction.common.baseChain || 'mainnet',
                        {
                            name: transaction.common.customChain.name || 'custom-network',
                            networkId: transaction.common.customChain.networkId,
                            chainId: transaction.common.customChain.chainId
                        },
                        transaction.common.hardfork || HardForks.London,
                    );

                    delete transaction.common;
                }

                if (transaction.chain) {
                    transactionOptions.chain = transaction.chain;
                    delete transaction.chain;
                }

                if (transaction.hardfork) {
                    transactionOptions.hardfork = transaction.hardfork;
                    delete transaction.hardfork;
                }
            }
            if (privateKey.startsWith('0x')) {
                privateKey = privateKey.substring(2);
            }
            var ethTx = TransactionFactory.fromTxData(transaction, transactionOptions);
            var signedTx = ethTx.sign(Buffer.from(privateKey, 'hex'));
            var validationErrors = signedTx.validate(true);

            if (validationErrors.length > 0) {
                let errorString = 'Signer Error: '
                for(const validationError of validationErrors) {
                    errorString += `${errorString} ${validationError}.`
                }
                throw new Error(errorString);
            }

            var rlpEncoded = signedTx.serialize().toString('hex');
            var rawTransaction = '0x' + rlpEncoded;
            var transactionHash = utils.keccak256(rawTransaction);

            var result = {
                messageHash: '0x' + Buffer.from(signedTx.getMessageToSign(true)).toString('hex'),
                v: '0x' + signedTx.v.toString('hex'),
                r: '0x' + signedTx.r.toString('hex'),
                s: '0x' + signedTx.s.toString('hex'),
                rawTransaction: rawTransaction,
                transactionHash: transactionHash
            };

            callback(null, result);
            return result;

        } catch (e) {
            callback(e);
            return Promise.reject(e);
        }
    }

    tx.type = _handleTxType(tx);

    // Resolve immediately if nonce, chainId, price and signing options are provided
    if (
        tx.nonce !== undefined &&
        tx.chainId !== undefined &&
        (
            tx.gasPrice !== undefined ||
            (
                tx.maxFeePerGas !== undefined &&
                tx.maxPriorityFeePerGas !== undefined
            )
        ) &&
        hasTxSigningOptions
    ) {
        return Promise.resolve(signed(tx));
    }

    // Otherwise, get the missing info from the Ethereum Node
    return Promise.all([
        isNot(tx.chainId) ? _this._ethereumCall.getChainId() : tx.chainId,
        isNot(tx.nonce) ? _this._ethereumCall.getTransactionCount(_this.privateKeyToAccount(privateKey).address) : tx.nonce,
        isNot(hasTxSigningOptions) ? _this._ethereumCall.getNetworkId() : 1,
        _handleTxPricing(_this, tx)
    ]).then(function(args) {
        if (isNot(args[0]) || isNot(args[1]) || isNot(args[2]) || isNot(args[3])) {
            throw new Error('One of the values "chainId", "networkId", "gasPrice", or "nonce" couldn\'t be fetched: ' + JSON.stringify(args));
        }
    
    return signed({
            ...tx,
            chainId: args[0],
            nonce: args[1],
            networkId: args[2],
            ...args[3] // Will either be gasPrice or maxFeePerGas and maxPriorityFeePerGas
        });
    });
};

function _validateTransactionForSigning(tx) {
    if (tx.common && (tx.chain && tx.hardfork)) {
        return new Error(
            'Please provide the @ethereumjs/common object or the chain and hardfork property but not all together.'
        );
    }

    if ((tx.chain && !tx.hardfork) || (tx.hardfork && !tx.chain)) {
        return new Error(
            'When specifying chain and hardfork, both values must be defined. ' +
            'Received "chain": ' + tx.chain + ', "hardfork": ' + tx.hardfork
        );
    }

    if (
        (!tx.gas && !tx.gasLimit) &&
        (!tx.maxPriorityFeePerGas && !tx.maxFeePerGas)
    ) {
        return new Error('"gas" is missing');
    }

    if (tx.gas && tx.gasPrice) {
        if (tx.gas < 0 || tx.gasPrice < 0) {
            return new Error('Gas or gasPrice is lower than 0');
        }
    } else {
        if (tx.maxPriorityFeePerGas < 0 || tx.maxFeePerGas < 0) {
            return new Error('maxPriorityFeePerGas or maxFeePerGas is lower than 0');
        }
    }

    if (tx.nonce < 0 || tx.chainId < 0) {
        return new Error('Nonce or chainId is lower than 0');
    }

    return;
}

function _handleTxType(tx) {
    // Taken from https://github.com/ethers-io/ethers.js/blob/2a7ce0e72a1e0c9469e10392b0329e75e341cf18/packages/abstract-signer/src.ts/index.ts#L215
    const hasEip1559 = (tx.maxFeePerGas !== undefined || tx.maxPriorityFeePerGas !== undefined);

    let txType;

    if (tx.type !== undefined) {
        txType = utils.toHex(tx.type)
    } else if (tx.type === undefined && hasEip1559) {
        txType = '0x2'
    }

    if (tx.gasPrice !== undefined && (txType === '0x2' || hasEip1559))
        throw Error("eip-1559 transactions don't support gasPrice");
    if ((txType === '0x1' || txType === '0x0') && hasEip1559)
        throw Error("pre-eip-1559 transaction don't support maxFeePerGas/maxPriorityFeePerGas");
    
    if (
        hasEip1559 ||
        (
            (tx.common && tx.common.hardfork && tx.common.hardfork.toLowerCase() === HardForks.London) ||
            (tx.hardfork && tx.hardfork.toLowerCase() === HardForks.London)
        )
    ) {
        txType = '0x2';
    } else if (
        tx.accessList ||
        (
            (tx.common && tx.common.hardfork && tx.common.hardfork.toLowerCase() === HardForks.Berlin) ||
            (tx.hardfork && tx.hardfork.toLowerCase() === HardForks.Berlin)
        )
    ) {
        txType = '0x1';
    }
    
    return txType
}

function _handleTxPricing(_this, tx) {
    return new Promise((resolve, reject) => {
        try {
            if (
                (tx.type === undefined || tx.type < '0x2')
                && tx.gasPrice !== undefined
            ) {
                // Legacy transaction, return provided gasPrice
                resolve({ gasPrice: tx.gasPrice })
            } else {
                Promise.all([
                    _this._ethereumCall.getBlockByNumber(),
                    _this._ethereumCall.getGasPrice()
                ]).then(responses => {
                    const [block, gasPrice] = responses;
                    if (
                        (tx.type === '0x2') &&
                        block && block.baseFeePerGas
                    ) {
                        // The network supports EIP-1559
    
                        // Taken from https://github.com/ethers-io/ethers.js/blob/ba6854bdd5a912fe873d5da494cb5c62c190adde/packages/abstract-provider/src.ts/index.ts#L230
                        let maxPriorityFeePerGas, maxFeePerGas;
    
                        if (tx.gasPrice) {
                            // Using legacy gasPrice property on an eip-1559 network,
                            // so use gasPrice as both fee properties
                            maxPriorityFeePerGas = tx.gasPrice;
                            maxFeePerGas = tx.gasPrice;
                            delete tx.gasPrice;
                        } else {
                            maxPriorityFeePerGas = tx.maxPriorityFeePerGas || '0x9502F900'; // 2.5 Gwei
                            maxFeePerGas = tx.maxFeePerGas ||
                                utils.toHex(
                                    utils.toBN(block.baseFeePerGas)
                                        .mul(utils.toBN(2))
                                        .add(utils.toBN(maxPriorityFeePerGas))
                                );
                        }
                        resolve({ maxFeePerGas, maxPriorityFeePerGas });
                    } else {
                        if (tx.maxPriorityFeePerGas || tx.maxFeePerGas)
                            throw Error("Network doesn't support eip-1559")
                        resolve({ gasPrice });
                    }
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

/* jshint ignore:start */
Accounts.prototype.recoverTransaction = function recoverTransaction(rawTx, txOptions = {}) {
    // Rely on EthereumJs/tx to determine the type of transaction
    const data = Buffer.from(rawTx.slice(2), "hex")
    const tx = TransactionFactory.fromSerializedData(data);
    //update checksum
    return utils.toChecksumAddress(tx.getSenderAddress().toString("hex"));
};
/* jshint ignore:end */

Accounts.prototype.hashMessage = function hashMessage(data) {
    var messageHex = utils.isHexStrict(data) ? data : utils.utf8ToHex(data);
    var messageBytes = utils.hexToBytes(messageHex);
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x19Ethereum Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    return Hash.keccak256s(ethMessage);
};

Accounts.prototype.sign = function sign(data, privateKey) {
    if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
    }

    // 64 hex characters + hex-prefix
    if (privateKey.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }

    var hash = this.hashMessage(data);
    var signature = Account.sign(hash, privateKey);
    var vrs = Account.decodeSignature(signature);
    return {
        message: data,
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
};

Accounts.prototype.recover = function recover(message, signature, preFixed) {
    var args = [].slice.apply(arguments);


    if (!!message && typeof message === 'object') {
        return this.recover(message.messageHash, Account.encodeSignature([message.v, message.r, message.s]), true);
    }

    if (!preFixed) {
        message = this.hashMessage(message);
    }

    if (args.length >= 4) {
        preFixed = args.slice(-1)[0];
        preFixed = typeof preFixed === 'boolean' ? !!preFixed : false;

        return this.recover(message, Account.encodeSignature(args.slice(1, 4)), preFixed); // v, r, s
    }
    return Account.recover(message, signature);
};

// Taken from https://github.com/ethereumjs/ethereumjs-wallet
Accounts.prototype.decrypt = function(v3Keystore, password, nonStrict) {
    /* jshint maxcomplexity: 10 */

    if (!(typeof password === 'string')) {
        throw new Error('No password given.');
    }

    var json = (!!v3Keystore && typeof v3Keystore === 'object') ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

    if (json.version !== 3) {
        throw new Error('Not a valid V3 wallet');
    }

    var derivedKey;
    var kdfparams;
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams;

        // FIXME: support progress reporting callback
        derivedKey = scrypt.syncScrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams;

        if (kdfparams.prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2');
        }

        derivedKey = cryp.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
        throw new Error('Unsupported key derivation scheme');
    }

    var ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

    var mac = utils.sha3(Buffer.from([...derivedKey.slice(16, 32), ...ciphertext])).replace('0x', '');
    if (mac !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong password');
    }

    var decipher = cryp.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));
    var seed = '0x' + Buffer.from([...decipher.update(ciphertext), ...decipher.final()]).toString('hex');

    return this.privateKeyToAccount(seed, true);
};

Accounts.prototype.encrypt = function(privateKey, password, options) {
    /* jshint maxcomplexity: 20 */
    var account = this.privateKeyToAccount(privateKey, true);

    options = options || {};
    var salt = options.salt || cryp.randomBytes(32);
    var iv = options.iv || cryp.randomBytes(16);

    var derivedKey;
    var kdf = options.kdf || 'scrypt';
    var kdfparams = {
        dklen: options.dklen || 32,
        salt: salt.toString('hex')
    };

    if (kdf === 'pbkdf2') {
        kdfparams.c = options.c || 262144;
        kdfparams.prf = 'hmac-sha256';
        derivedKey = cryp.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = options.n || 8192; // 2048 4096 8192 16384
        kdfparams.r = options.r || 8;
        kdfparams.p = options.p || 1;
        derivedKey = scrypt.syncScrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else {
        throw new Error('Unsupported kdf');
    }

    var cipher = cryp.createCipheriv(options.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
    if (!cipher) {
        throw new Error('Unsupported cipher');
    }


    var ciphertext = Buffer.from([
        ...cipher.update(Buffer.from(account.privateKey.replace('0x', ''), 'hex')),
        ...cipher.final()]
    );

    var mac = utils.sha3(Buffer.from([...derivedKey.slice(16, 32), ...ciphertext])).replace('0x', '');

    return {
        version: 3,
        id: uuid.v4({random: options.uuid || cryp.randomBytes(16)}),
        address: account.address.toLowerCase().replace('0x', ''),
        crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: options.cipher || 'aes-128-ctr',
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString('hex')
        }
    };
};


// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

function Wallet(accounts) {
    this._accounts = accounts;
    this.length = 0;
    this.defaultKeyName = 'web3js_wallet';
}

Wallet.prototype._findSafeIndex = function(pointer) {
    pointer = pointer || 0;
    if (this.hasOwnProperty(pointer)) {
        return this._findSafeIndex(pointer + 1);
    } else {
        return pointer;
    }
};

Wallet.prototype._currentIndexes = function() {
    var keys = Object.keys(this);
    var indexes = keys
        .map(function(key) {
            return parseInt(key);
        })
        .filter(function(n) {
            return (n < 9e20);
        });

    return indexes;
};

Wallet.prototype.create = function(numberOfAccounts, entropy) {
    for (var i = 0; i < numberOfAccounts; ++i) {
        this.add(this._accounts.create(entropy).privateKey);
    }
    return this;
};

Wallet.prototype.add = function(account) {

    if (typeof account === 'string') {
        account = this._accounts.privateKeyToAccount(account);
    }
    if (!this[account.address]) {
        account = this._accounts.privateKeyToAccount(account.privateKey);
        account.index = this._findSafeIndex();

        this[account.index] = account;
        this[account.address] = account;
        this[account.address.toLowerCase()] = account;

        this.length++;

        return account;
    } else {
        return this[account.address];
    }
};

Wallet.prototype.remove = function(addressOrIndex) {
    var account = this[addressOrIndex];

    if (account && account.address) {
        // address
        this[account.address].privateKey = null;
        delete this[account.address];
        // address lowercase
        this[account.address.toLowerCase()].privateKey = null;
        delete this[account.address.toLowerCase()];
        // index
        this[account.index].privateKey = null;
        delete this[account.index];

        this.length--;

        return true;
    } else {
        return false;
    }
};

Wallet.prototype.clear = function() {
    var _this = this;
    var indexes = this._currentIndexes();

    indexes.forEach(function(index) {
        _this.remove(index);
    });

    return this;
};

Wallet.prototype.encrypt = function(password, options) {
    var _this = this;
    var indexes = this._currentIndexes();

    var accounts = indexes.map(function(index) {
        return _this[index].encrypt(password, options);
    });

    return accounts;
};


Wallet.prototype.decrypt = function(encryptedWallet, password) {
    var _this = this;

    encryptedWallet.forEach(function(keystore) {
        var account = _this._accounts.decrypt(keystore, password);

        if (account) {
            _this.add(account);
        } else {
            throw new Error('Couldn\'t decrypt accounts. Password wrong?');
        }
    });

    return this;
};

Wallet.prototype.save = function(password, keyName) {
    localStorage.setItem(keyName || this.defaultKeyName, JSON.stringify(this.encrypt(password)));

    return true;
};

Wallet.prototype.load = function(password, keyName) {
    var keystore = localStorage.getItem(keyName || this.defaultKeyName);

    if (keystore) {
        try {
            keystore = JSON.parse(keystore);
        } catch (e) {

        }
    }

    return this.decrypt(keystore || [], password);
};

if (!storageAvailable('localStorage')) {
    delete Wallet.prototype.save;
    delete Wallet.prototype.load;
}

/**
 * Checks whether a storage type is available or not
 * For more info on how this works, please refer to MDN documentation
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
 *
 * @method storageAvailable
 * @param {String} type the type of storage ('localStorage', 'sessionStorage')
 * @returns {Boolean} a boolean indicating whether the specified storage is available or not
 */
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

module.exports = Accounts;
