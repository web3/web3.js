import Web3 from 'web3';
//import web3 from "web3";
import { Method } from 'web3-core-method';

import { TolarAccounts } from './tolar-account/tolar-account';
import { TolarNet } from './tolar-net/tolar-net';

var _ = require("underscore");

var Method = require("web3-core-method");

export class Tolar {
    defaultAccount: string | number = null;
    defaultBlock: string | number = "latest";

    public net = new TolarNet(this.web3);
    public account = new TolarAccounts(this.web3);
    methods: Method[];
    constructor(private web3: Web3) {
        this.registerMethods();
    }

    extendTolar() {
        _.each(this.methods, (method: any) => {
            method.attachToObject(this);
            method.setRequestManager((this.web3 as any)._requestManager);
        });
    }
    setMethods() {
        this.methods = [
            new Method({
                name: "getBlockCount",
                call: "tol_getBlockCount",
                params: 0,
            }),
            new Method({
                name: "getBlockByHash",
                call: "tol_getBlockByHash",
                params: 1,
            }),
            new Method({
                name: "getBlockByIndex",
                call: "tol_getBlockByIndex",
                params: 1,
            }),
            new Method({
                name: "getTransaction",
                call: "tol_getTransaction",
                params: 1,
            }),
            new Method({
                name: "getBlockchainInfo",
                call: "tol_getBlockchainInfo",
                params: 0,
            }),
            new Method({
                name: "getTransactionList",
                call: "tol_getTransactionList",
                params: 3,
            }),
            new Method({
                name: "getNonce",
                call: "tol_getNonce",
                params: 1,
            }),
            new Method({
                name: "getBalance",
                call: "tol_getBalance",
                params: 2,
            }),
            new Method({
                name: "getLatestBalance",
                call: "tol_getLatestBalance",
                params: 1,
            }),

            new Method({
                name: "tryCallTransaction",
                call: "tol_tryCallTransaction",
                params: 7,
            }),
            new Method({
                name: "getTransactionReceipt",
                call: "tol_getTransactionReceipt",
                params: 1,
            }),
            new Method({
                name: "getGasEstimate",
                call: "tol_getGasEstimate",
                params: 1,
            }),
            new Method({
                name: "getHashBytes",
                call: "util_getHashBytes",
                params: 1,
            }),
            new Method({
                name: "getHashHex",
                call: "util_getHashHex",
                params: 1,
            }),
            new Method({
                name: "sendSignedTransaction",
                call: "tx_sendSignedTransaction",
                params: 1,
            }),
        ];
    }

    addDefaults() {
        this.methods.forEach((method: any) => {
            method.defaultBlock = this.defaultBlock;
            method.defaultAccount = this.defaultAccount;
        });
    }

    registerMethods() {
        this.setMethods();
        this.addDefaults();
        this.extendTolar();
    }
}
interface Tx {
    sender_address: string;
    receiver_address: string;
    value: number;
    gas: number;
    gas_price: number;
    data: string;
    nonce: number;
}
module.exports = Tolar;
