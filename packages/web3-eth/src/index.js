'use strict';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.');
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y['return']
                                    : op[0]
                                    ? y['throw'] ||
                                      ((t = y['return']) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys),
                                (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (
                                op[0] === 3 &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                            ) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
exports.__esModule = true;
var web3_core_requestmanager_1 = require('web3-core-requestmanager');
var Web3Eth = /** @class */ (function () {
    function Web3Eth(options) {
        this._DEFAULT_JSON_RPC_VERSION = '2.0';
        this._requestManager = new web3_core_requestmanager_1['default']({
            providerUrl: options.providerUrl,
        });
    }
    /**
     * Returns the current client version
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Client version
     */
    Web3Eth.prototype.getClientVersion = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'web3_clientVersion',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw Error(
                            'Error getting client version: ' + error_1.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns Keccak-256 (not the standardized SHA3-256) of the given data
     * @param {string} data Data to convert into SHA3 hash
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} SHA3 hash of {data}
     */
    Web3Eth.prototype.getSha3 = function (data, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'web3_sha3',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [data],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw Error(
                            'Error getting sha3 hash: ' + error_2.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the current network version
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Current network version
     */
    Web3Eth.prototype.getNetworkVersion = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'net_version',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw Error(
                            'Error getting network version: ' + error_3.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns true if client is actively listening for network connections
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} true if currently listening, otherwise false
     */
    Web3Eth.prototype.getNetworkListening = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'net_listening',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        throw Error(
                            'Error getting network listening: ' +
                                error_4.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns number of peers currently connected to the client
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} true if currently listening, otherwise false
     */
    Web3Eth.prototype.getNetworkPeerCount = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'net_peerCount',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        throw Error(
                            'Error getting network peer count: ' +
                                error_5.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the current ethereum protocol version
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} The current ethereum protocol version
     */
    Web3Eth.prototype.getProtocolVersion = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_protocolVersion',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw Error(
                            'Error getting protocol version: ' + error_6.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns an object with data about the sync status or false when not syncing
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Object with sync status data or false when not syncing
     */
    Web3Eth.prototype.getSyncing = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_syncing',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw Error(
                            'Error getting syncing status: ' + error_7.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the client's coinbase address
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} The current coinbase address
     */
    Web3Eth.prototype.getCoinbase = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_coinbase',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        throw Error(
                            'Error getting coinbase address: ' + error_8.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns true if client is actively mining new blocks
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} true if the client is mining, otherwise false
     */
    Web3Eth.prototype.getMining = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_mining',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        throw Error(
                            'Error getting mining status: ' + error_9.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of hashes per second that the node is mining with
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Number of hashes per second
     */
    Web3Eth.prototype.getHashRate = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_hashrate',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        throw Error(
                            'Error getting hash rate: ' + error_10.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the current price per gas in wei
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing current gas price in wei
     */
    Web3Eth.prototype.getGasPrice = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_gasPrice',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_11 = _a.sent();
                        throw Error(
                            'Error getting gas price: ' + error_11.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns a list of addresses owned by client.
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of addresses owned by the client
     */
    Web3Eth.prototype.getAccounts = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_accounts',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        throw Error(
                            'Error getting accounts: ' + error_12.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of most recent block
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing current block number client is on
     */
    Web3Eth.prototype.getBlockNumber = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_blockNumber',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        throw Error(
                            'Error getting block number: ' + error_13.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the balance of the account of given address
     * @param {string} address Address to get balance of
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing current balance in wei
     */
    Web3Eth.prototype.getBalance = function (
        address,
        blockIdentifier,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getBalance',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [address, blockIdentifier],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_14 = _a.sent();
                        throw Error(
                            'Error getting balance: ' + error_14.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the value from a storage position at a given address
     * @param {string} address Address of storage to query
     * @param {string} storagePosition Hex string representing position in storage to retrieve
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing value at {storagePosition}
     */
    Web3Eth.prototype.getStorageAt = function (
        address,
        storagePosition,
        blockIdentifier,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getStorageAt',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [
                                        address,
                                        storagePosition,
                                        blockIdentifier,
                                    ],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_15 = _a.sent();
                        throw Error(
                            'Error getting storage value: ' + error_15.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of transactions sent from an address
     * @param {string} address Address to get transaction count of
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of transactions sent by {address}
     */
    Web3Eth.prototype.getTransactionCount = function (
        address,
        blockIdentifier,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getTransactionCount',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [address, blockIdentifier],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_16 = _a.sent();
                        throw Error(
                            'Error getting transaction count: ' +
                                error_16.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of transactions in a block from a block matching the given block hash
     * @param {string} blockHash Hash of block to query transaction count of
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of transactions in block
     */
    Web3Eth.prototype.getBlockTransactionCountByHash = function (
        blockHash,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getBlockTransactionCountByHash',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockHash],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_17 = _a.sent();
                        throw Error(
                            'Error getting transaction count for block by hash: ' +
                                error_17.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of transactions in a block from a block matching the given block number
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of transactions in block
     */
    Web3Eth.prototype.getBlockTransactionCountByNumber = function (
        blockIdentifier,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getBlockTransactionCountByNumber',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockIdentifier],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_18 = _a.sent();
                        throw Error(
                            'Error getting transaction count for block by number: ' +
                                error_18.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of uncles in a block from a block matching the given block hash
     * @param {string} blockHash Hash of block to query
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of uncles in block
     */
    Web3Eth.prototype.getUncleCountByBlockHash = function (
        blockHash,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getUncleCountByBlockHash',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockHash],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_19 = _a.sent();
                        throw Error(
                            'Error getting uncle count for block by hash: ' +
                                error_19.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of uncles in a block from a block matching the given block number
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of uncles in block
     */
    Web3Eth.prototype.getUncleCountByBlockNumber = function (
        blockIdentifier,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getUncleCountByBlockNumber',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockIdentifier],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_20 = _a.sent();
                        throw Error(
                            'Error getting uncle count for block by number: ' +
                                error_20.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns code at a given address
     * @param {string} address Address to get code at
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing the code at {address}
     */
    Web3Eth.prototype.getCode = function (
        address,
        blockIdentifier,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getCode',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [address, blockIdentifier],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_21 = _a.sent();
                        throw Error(
                            'Error getting code at address: ' + error_21.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculates an Ethereum specific signature
     * @param {string} address Address to use to sign {data}
     * @param {string} message Message to sign
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing signed message
     */
    Web3Eth.prototype.sign = function (address, message, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_sign',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [address, message],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_22 = _a.sent();
                        throw Error(
                            'Error signing message: ' + error_22.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Signs a transaction that can be submitted to the network at a later time using with sendRawTransaction
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from
     * @param {string} transaction.to Address transaction is directed towards (optional when creating new contract)
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to}
     * @param {string} transaction.data Hex string representing compiled code of a contract or the hash of the invoked method signature and encoded parameters
     * @param {string} transaction.nonce Can be used to overwrite pending transactions that use the same nonce
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing signed message
     */
    Web3Eth.prototype.signTransaction = function (transaction, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_signTransaction',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [__assign({}, transaction)],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_23 = _a.sent();
                        throw Error(
                            'Error signing transaction: ' + error_23.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Submits a transaction object to the provider to be sign and sent to the network
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from
     * @param {string} transaction.to Address transaction is directed towards (optional when creating new contract)
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to}
     * @param {string} transaction.data Hex string representing compiled code of a contract or the hash of the invoked method signature and encoded parameters
     * @param {string} transaction.nonce Can be used to overwrite pending transactions that use the same nonce
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
     */
    Web3Eth.prototype.sendTransaction = function (transaction, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_sendTransaction',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [__assign({}, transaction)],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_24 = _a.sent();
                        throw Error(
                            'Error sending transaction: ' + error_24.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Submits a previously signed transaction object to the network
     * @param {string} rawTransaction Hex string representing previously signed transaction
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
     */
    Web3Eth.prototype.sendRawTransaction = function (
        rawTransaction,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_sendRawTransaction',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [rawTransaction],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_25 = _a.sent();
                        throw Error(
                            'Error sending raw transaction: ' + error_25.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * TODO Result is probably more than hex string, or perhpas should be decoded
     *
     * Executes a new message call immediately without creating a transaction on the block chain
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from
     * @param {string} transaction.to Address transaction is directed towards
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to}
     * @param {string} transaction.data Hash of the method signature and encoded parameters
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing return value of executed contract
     */
    Web3Eth.prototype.call = function (transaction, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_call',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [transaction],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_26 = _a.sent();
                        throw Error(
                            'Error sending call transaction: ' +
                                error_26.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from (optional)
     * @param {string} transaction.to Address transaction is directed towards (optional)
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to} (optional)
     * @param {string} transaction.data Hash of the method signature and encoded parameters (optional)
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing estimated amount of gas to be used
     */
    Web3Eth.prototype.estimateGas = function (transaction, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_estimateGas',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [transaction],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_27 = _a.sent();
                        throw Error(
                            'Error getting gas estimate: ' + error_27.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns information about a block by hash
     * @param {string} blockHash Hash of block to get information for
     * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    Web3Eth.prototype.getBlockByHash = function (
        blockHash,
        returnFullTxs,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getBlockByHash',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockHash, returnFullTxs],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_28 = _a.sent();
                        throw Error(
                            'Error getting block by hash: ' + error_28.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns information about a block by number
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    Web3Eth.prototype.getBlockByNumber = function (
        blockIdentifier,
        returnFullTxs,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getBlockByNumber',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockIdentifier, returnFullTxs],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_29 = _a.sent();
                        throw Error(
                            'Error getting block by number: ' + error_29.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the information about a transaction requested by transaction hash
     * @param {string} txHash Hash of transaction to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    Web3Eth.prototype.getTransactionByHash = function (txHash, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getTransactionByHash',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [txHash],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_30 = _a.sent();
                        throw Error(
                            'Error getting transaction by hash: ' +
                                error_30.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns information about a transaction by block hash and transaction index position
     * @param {string} blockHash Hash of block to get transactions of
     * @param {string} transactionIndex Hex string representing index of transaction to return
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    Web3Eth.prototype.getTransactionByBlockHashAndIndex = function (
        blockHash,
        transactionIndex,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getTransactionByBlockHashAndIndex',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockHash, transactionIndex],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_31 = _a.sent();
                        throw Error(
                            'Error getting transaction by block hash and index: ' +
                                error_31.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns information about a transaction by block number and transaction index position
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {string} transactionIndex Hex string representing index of transaction to return
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    Web3Eth.prototype.getTransactionByBlockNumberAndIndex = function (
        blockIdentifier,
        transactionIndex,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getTransactionByBlockNumberAndIndex',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockIdentifier, transactionIndex],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_32 = _a.sent();
                        throw Error(
                            'Error getting transaction by block number and index: ' +
                                error_32.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the receipt of a transaction by transaction hash
     * @param {string} txHash Hash of transaction to get receipt of
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no receipt was found
     */
    Web3Eth.prototype.getTransactionReceipt = function (txHash, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getTransactionReceipt',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [txHash],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_33 = _a.sent();
                        throw Error(
                            'Error getting transaction reciept: ' +
                                error_33.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns information about a uncle of a block by hash and uncle index position
     * @param {string} blockHash Hash of block to get uncles of
     * @param {string} uncleIndex Index of uncle to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    Web3Eth.prototype.getUncleByBlockHashAndIndex = function (
        blockHash,
        uncleIndex,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getUncleByBlockHashAndIndex',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockHash, uncleIndex],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_34 = _a.sent();
                        throw Error(
                            'Error getting uncle by block hash and index: ' +
                                error_34.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns information about a uncle of a block by number and uncle index position
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {string} uncleIndex Index of uncle to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    Web3Eth.prototype.getUncleByBlockNumberAndIndex = function (
        blockIdentifier,
        uncleIndex,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getUncleByBlockNumberAndIndex',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [blockIdentifier, uncleIndex],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_35 = _a.sent();
                        throw Error(
                            'Error getting uncle by block number and index: ' +
                                error_35.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns a list of available compilers in the client
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A list of available compilers
     */
    Web3Eth.prototype.getCompilers = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getCompilers',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_36 = _a.sent();
                        throw Error(
                            'Error getting compilers: ' + error_36.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns compiled solidity code
     * @param {string} sourceCode Solidity code to be compiled
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} compiled {sourceCode}
     */
    Web3Eth.prototype.compileSolidity = function (sourceCode, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_compileSolidity',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [sourceCode],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_37 = _a.sent();
                        throw Error(
                            'Error getting compiling solidity code: ' +
                                error_37.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns compiled LLL code
     * @param {string} sourceCode LLL code to be compiled
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} compiled {sourceCode}
     */
    Web3Eth.prototype.compileLLL = function (sourceCode, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_compileLLL',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [sourceCode],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_38 = _a.sent();
                        throw Error(
                            'Error getting compiling LLL code: ' +
                                error_38.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns compiled serpent code
     * @param {string} sourceCode Serpent code to be compiled
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} compiled {sourceCode}
     */
    Web3Eth.prototype.compileSerpent = function (sourceCode, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_39;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_compileSerpent',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [sourceCode],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_39 = _a.sent();
                        throw Error(
                            'Error getting compiling serpent code: ' +
                                error_39.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a filter object, based on filter options, to notify when the state changes (logs)
     * @param {object} filter Filter to be created
     * @param {string|number} filter.fromBlock Start filter at integer block number or "latest", "earliest", "pending"
     * @param {string|number} filter.toBlock End filter at integer block number or "latest", "earliest", "pending"
     * @param {string|string[]} filter.address: Contract address or list of addresses from which logs should originate
     * @param {string[]} filter.topics Topics to use for filtering (optional)
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Filter id
     */
    Web3Eth.prototype.newFilter = function (filter, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_newFilter',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [filter],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_40 = _a.sent();
                        throw Error(
                            'Error creating filter: ' + error_40.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a filter in the node, to notify when a new block arrives
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Filter id
     */
    Web3Eth.prototype.newBlockFilter = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_41;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_newBlockFilter',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_41 = _a.sent();
                        throw Error(
                            'Error creating block filter: ' + error_41.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a filter in the node, to notify when new pending transactions arrive
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Filter id
     */
    Web3Eth.prototype.newPendingTransactionFilter = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_newPendingTransactionFilter',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_42 = _a.sent();
                        throw Error(
                            'Error creating pending transaction filter: ' +
                                error_42.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Uninstalls a filter with given id. Should always be called when watch is no longer needed
     * @param {string} filterId Id of filter to uninstall from node
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Returns true if filter was successfully uninstalled, otherwise false
     */
    Web3Eth.prototype.uninstallFilter = function (filterId, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_43;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_uninstallFilter',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [filterId],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_43 = _a.sent();
                        throw Error(
                            'Error uninstalling filter: ' + error_43.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Polling method for a filter, which returns an array of logs which occurred since last poll
     * @param {string} filterid Id of filter to retrieve changes from
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    Web3Eth.prototype.getFilterChanges = function (filterId, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_44;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getFilterChanges',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [filterId],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_44 = _a.sent();
                        throw Error(
                            'Error getting filter changes: ' + error_44.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns an array of all logs matching filter with given id
     * @param {string} filterid Id of filter to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    Web3Eth.prototype.getFilterLogs = function (filterId, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_45;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getFilterLogs',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [filterId],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_45 = _a.sent();
                        throw Error(
                            'Error getting filter changes: ' + error_45.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns an array of all logs matching a given filter object
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    Web3Eth.prototype.getLogs = function (filter, rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_46;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getLogs',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [filter],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_46 = _a.sent();
                        throw Error('Error getting logs: ' + error_46.message);
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the hash of the current block, the seedHash, and the boundary condition to be met (“target”)
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of work info (in order: current block header pow-hash, seed hash used for the DAG, and boundary condition (“target”), 2^256 / difficulty)
     */
    Web3Eth.prototype.getWork = function (rpcOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var error_47;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_getWork',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_47 = _a.sent();
                        throw Error('Error getting work: ' + error_47.message);
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Used for submitting a proof-of-work solution
     * @param {string} nonce Hex string representing found nonce (64 bits)
     * @param {string} powHash Hex string representing POW hash (256 bits)
     * @param {string} digest Hex string representing mix digest (256 bits)
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Returns true if the provided solution is valid, otherwise false
     */
    Web3Eth.prototype.submitWork = function (
        nonce,
        powHash,
        digest,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_48;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_submitWork',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [nonce, powHash, digest],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_48 = _a.sent();
                        throw Error(
                            'Error submitting work: ' + error_48.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Used for submitting mining hashrate
     * @param {string} hashRate Hex string representing desired hash rate (32 bytes)
     * @param {string} clientId Hex string representing ID identifying the client
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Returns true if the provided solution is valid, otherwise false
     */
    Web3Eth.prototype.submitHashRate = function (
        hashRate,
        clientId,
        rpcOptions
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var error_49;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [
                            4 /*yield*/,
                            this._requestManager.send(
                                __assign(__assign({}, rpcOptions), {
                                    method: 'eth_submitHashRate',
                                    jsonrpc:
                                        (rpcOptions === null ||
                                        rpcOptions === void 0
                                            ? void 0
                                            : rpcOptions.jsonrpc) ||
                                        this._DEFAULT_JSON_RPC_VERSION,
                                    params: [hashRate, clientId],
                                })
                            ),
                        ];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        error_49 = _a.sent();
                        throw Error(
                            'Error submitting hash rate: ' + error_49.message
                        );
                    case 3:
                        return [2 /*return*/];
                }
            });
        });
    };
    return Web3Eth;
})();
exports['default'] = Web3Eth;
