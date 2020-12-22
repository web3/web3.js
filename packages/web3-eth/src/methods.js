const abi = require('web3-eth-abi');
const utils = require('web3-utils');
const formatter = require('web3-core-helpers').formatters;

function blockCall (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? "eth_getBlockByHash" : "eth_getBlockByNumber";
};

function transactionFromBlockCall (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
};

function uncleCall (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex';
};

function getBlockTransactionCountCall (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockTransactionCountByHash' : 'eth_getBlockTransactionCountByNumber';
};

function uncleCountCall (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber';
};



module.exports = [    {
        name: 'getNodeInfo',
        call: 'web3_clientVersion'
    },
    {
        name: 'getProtocolVersion',
        call: 'eth_protocolVersion',
        params: 0
    },
    {
        name: 'getCoinbase',
        call: 'eth_coinbase',
        params: 0
    },
    {
        name: 'isMining',
        call: 'eth_mining',
        params: 0
    },
    {
        name: 'getHashrate',
        call: 'eth_hashrate',
        params: 0,
        outputFormatter: utils.hexToNumber
    },
    {
        name: 'isSyncing',
        call: 'eth_syncing',
        params: 0,
        outputFormatter: formatter.outputSyncingFormatter
    },
    {
        name: 'getGasPrice',
        call: 'eth_gasPrice',
        params: 0,
        outputFormatter: formatter.outputBigNumberFormatter
    },
    {
        name: 'getAccounts',
        call: 'eth_accounts',
        params: 0,
        outputFormatter: utils.toChecksumAddress
    },
    {
        name: 'getBlockNumber',
        call: 'eth_blockNumber',
        params: 0,
        outputFormatter: utils.hexToNumber
    },
    {
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFormatter: [formatter.inputAddressFormatter, formatter.inputDefaultBlockNumberFormatter],
        outputFormatter: formatter.outputBigNumberFormatter
    },
    {
        name: 'getStorageAt',
        call: 'eth_getStorageAt',
        params: 3,
        inputFormatter: [formatter.inputAddressFormatter, utils.numberToHex, formatter.inputDefaultBlockNumberFormatter]
    },
    {
        name: 'getCode',
        call: 'eth_getCode',
        params: 2,
        inputFormatter: [formatter.inputAddressFormatter, formatter.inputDefaultBlockNumberFormatter]
    },
    {
        name: 'getBlock',
        call: blockCall,
        params: 2,
        inputFormatter: [formatter.inputBlockNumberFormatter, function (val) { return !!val; }],
        outputFormatter: formatter.outputBlockFormatter
    },
    {
        name: 'getUncle',
        call: uncleCall,
        params: 2,
        inputFormatter: [formatter.inputBlockNumberFormatter, utils.numberToHex],
        outputFormatter: formatter.outputBlockFormatter,

    },
    {
        name: 'getBlockTransactionCount',
        call: getBlockTransactionCountCall,
        params: 1,
        inputFormatter: [formatter.inputBlockNumberFormatter],
        outputFormatter: utils.hexToNumber
    },
    {
        name: 'getBlockUncleCount',
        call: uncleCountCall,
        params: 1,
        inputFormatter: [formatter.inputBlockNumberFormatter],
        outputFormatter: utils.hexToNumber
    },
    {
        name: 'getTransaction',
        call: 'eth_getTransactionByHash',
        params: 1,
        inputFormatter: [null],
        outputFormatter: formatter.outputTransactionFormatter
    },
    {
        name: 'getTransactionFromBlock',
        call: transactionFromBlockCall,
        params: 2,
        inputFormatter: [formatter.inputBlockNumberFormatter, utils.numberToHex],
        outputFormatter: formatter.outputTransactionFormatter
    },
    {
        name: 'getTransactionReceipt',
        call: 'eth_getTransactionReceipt',
        params: 1,
        inputFormatter: [null],
        outputFormatter: formatter.outputTransactionReceiptFormatter
    },
    {
        name: 'getTransactionCount',
        call: 'eth_getTransactionCount',
        params: 2,
        inputFormatter: [formatter.inputAddressFormatter, formatter.inputDefaultBlockNumberFormatter],
        outputFormatter: utils.hexToNumber
    },
    {
        name: 'sendSignedTransaction',
        call: 'eth_sendRawTransaction',
        params: 1,
        inputFormatter: [null],
        abiCoder: abi
    },
    {
        name: 'signTransaction',
        call: 'eth_signTransaction',
        params: 1,
        inputFormatter: [formatter.inputTransactionFormatter]
    },
    {
        name: 'sendTransaction',
        call: 'eth_sendTransaction',
        params: 1,
        inputFormatter: [formatter.inputTransactionFormatter],
        abiCoder: abi
    },
    {
        name: 'sign',
        call: 'eth_sign',
        params: 2,
        inputFormatter: [formatter.inputSignFormatter, formatter.inputAddressFormatter],
        transformPayload: function (payload) {
            payload.params.reverse();
            return payload;
        }
    },
    {
        name: 'call',
        call: 'eth_call',
        params: 2,
        inputFormatter: [formatter.inputCallFormatter, formatter.inputDefaultBlockNumberFormatter],
        abiCoder: abi
    },
    {
        name: 'estimateGas',
        call: 'eth_estimateGas',
        params: 1,
        inputFormatter: [formatter.inputCallFormatter],
        outputFormatter: utils.hexToNumber
    },
    {
        name: 'submitWork',
        call: 'eth_submitWork',
        params: 3
    },
    {
        name: 'getWork',
        call: 'eth_getWork',
        params: 0
    },
    {
        name: 'getPastLogs',
        call: 'eth_getLogs',
        params: 1,
        inputFormatter: [formatter.inputLogFormatter],
        outputFormatter: formatter.outputLogFormatter
    },
    {
        name: 'getChainId',
        call: 'eth_chainId',
        params: 0,
        outputFormatter: utils.hexToNumber
    },
    {
        name: 'requestAccounts',
        call: 'eth_requestAccounts',
        params: 0,
        outputFormatter: utils.toChecksumAddress
    },
    {
        name: 'getProof',
        call: 'eth_getProof',
        params: 3,
        inputFormatter: [formatter.inputAddressFormatter, formatter.inputStorageKeysFormatter, formatter.inputDefaultBlockNumberFormatter],
        outputFormatter: formatter.outputProofFormatter
    },
    {
        name: 'getPendingTransactions',
        call: 'eth_pendingTransactions',
        params: 0,
        outputFormatter: formatter.outputTransactionFormatter
    },
]