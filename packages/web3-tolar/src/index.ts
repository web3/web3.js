import web3 from "web3";
import { Method } from "web3-core-method";
import { TolarNet } from "./tolar-net/tolar-net";
import { TolarAccounts } from "./tolar-account/tolar-account";
import Web3 from "web3";
var _ = require("underscore");

var helpers = require("web3-core-helpers");
var Subscriptions = require("web3-core-subscriptions").subscriptions;
var Method = require("web3-core-method");
var utils = require("web3-utils");
var Net = require("web3-net");
var formatter = helpers.formatters;

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
                name: "netPeerCount",
                call: "net_peerCount",
                params: 0,
            }),
            new Method({
                name: "netMasterNodeCount",
                call: "net_masterNodeCount",
                params: 0,
            }),
            new Method({
                name: "netIsMasterNode",
                call: "net_isMasterNode",
                params: 0,
            }),

            new Method({
                name: "netMaxPeerCount",
                call: "net_maxPeerCount",
                params: 0,
            }),
            new Method({
                name: "tolGetBlockCount",
                call: "tol_getBlockCount",
                params: 0,
            }),
            new Method({
                name: "tolGetBlockByHash",
                call: "tol_getBlockByHash",
                params: 1,
            }),
            new Method({
                name: "tolGetBlockByIndex",
                call: "tol_getBlockByIndex",
                params: 1,
            }),
            new Method({
                name: "tolGetTransaction",
                call: "tol_getTransaction",
                params: 1,
            }),
            new Method({
                name: "tolGetBlockchainInfo",
                call: "tol_getBlockchainInfo",
                params: 0,
            }),
            new Method({
                name: "tolGetTransactionList",
                call: "tol_getTransactionList",
                params: 3,
            }),
            new Method({
                name: "tolGetNonce",
                call: "tol_getNonce",
                params: 1,
            }),
            new Method({
                name: "tolGetBalance",
                call: "tol_getBalance",
                params: 2,
            }),
            new Method({
                name: "tolGetLatestBalance",
                call: "tol_getLatestBalance",
                params: 1,
            }),

            new Method({
                name: "tolTryCallTransaction",
                call: "tol_tryCallTransaction",
                params: 7,
            }),
            new Method({
                name: "tolGetTransactionReceipt",
                call: "tol_getTransactionReceipt",
                params: 1,
            }),
            new Method({
                name: "tolGetGasEstimate",
                call: "tol_getGasEstimate",
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

module.exports = Tolar;
