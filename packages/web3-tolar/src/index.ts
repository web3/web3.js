import Web3 from 'web3';
//import web3 from "web3";
import { Method } from 'web3-core-method';

import { TolarAccounts } from './tolar-account/tolar-account';
import { TolarNet } from './tolar-net/tolar-net';

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
                inputFormatter: [
                    (a: any) => {
                        console.log(a);
                        return a;
                    },
                ],
                params: 1,
            }),
            new Method({
                name: "sendSignedTransaction",
                call: "tx_sendSignedTransaction",
                inputFormatter: [
                    (a: Tx) => {
                        //         /**
                        //      {body:TransactionObj,
                        //     sig_data:{
                        //         hash,
                        //         signature,
                        //         signerId:string
                        //     }}

                        //     */
                        //         //a = {};
                        //         // a.sender_address;
                        //         // a.receiver_address;
                        //         // a.value; //0
                        //         // a.gas; //21463
                        //         // a.gas_price; //1
                        //         // a.data; //''
                        //         // a.nonce; //0
                        //         // let b = JSON.parse(JSON.stringify(a));

                        //         // 1. cili obj to sha 3 hash -> bytearray -// korsiti se i pretvaranje u hex bez prefixa i u sign transaction dodati u hash field i u hex pa je to hash
                        //         // 2. to u sign metoud,
                        //         //
                        //         /* console.log(
                        //             "Hashes:\n",
                        //             //utils.sha3(a),
                        //             "\n",
                        //             utils.soliditySha3(a)
                        //         );*/
                        //         // let x = await (this as any).getHashBytes(a);
                        //         // let y = await (this as any).getHashHex(a);

                        //         // console.log(
                        //         //     "Hash:\n",
                        //         //     // x,
                        //         //     //   "\n",
                        //         //     // utils.sha3(x),
                        //         //     //   "\n",
                        //         //     //    utils.soliditySha3(x),
                        //         //     "\n",
                        //         //     y,
                        //         //     "\nEnd\n"
                        //         // );
                        //         // let privateKeyToAcc = (this
                        //         //     .account as any).privateKeyToAccount(
                        //         //     "0xd7ce009203c5d16d6b5daafa1efb1167a9e4558e88dff0bc14ebd65f3f0fc116"
                        //         // );
                        //         // console.log("pk to acc\n", privateKeyToAcc);

                        //         // const signRes = (this.account as any).sign(
                        //         //     "0x" + y,
                        //         //     "0xd7ce009203c5d16d6b5daafa1efb1167a9e4558e88dff0bc14ebd65f3f0fc116"
                        //         // );

                        //         // console.log(utils.hexToBytes(`0x${y}`));
                        //         //console.log(utils.hexToBytes(utils.bytesToHex));
                        //         // console.log(signRes);
                        //         // console.log({
                        //         //     body: b,
                        //         //     sig_data: {
                        //         //         hash: y,
                        //         //         signature: signRes.signature.substr(2),
                        //         //         signer_id: signRes.signer_id,
                        //         //     },
                        //         // });
                        console.log(a);
                        return a;
                        //         //  {
                        //         //     body: b,
                        //         //     sig_data: {
                        //         //         hash: utils.toHex(x).substr(2),
                        //         //         signature: signRes.signature.substr(2),
                        //         //         signer_id: signRes.signer_id,
                        //         //     },
                        //         // };
                    },
                ],
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
