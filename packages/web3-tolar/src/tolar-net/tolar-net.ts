import Web3 from "web3";
var Net = require("web3-net");
import { Method } from "web3-core-method";
var Method = require("web3-core-method");
var _ = require("underscore");

export class TolarNet extends Net {
    methods = [
        new Method({
            name: "peerCount",
            call: "net_peerCount",
            params: 0,
        }),
        new Method({
            name: "masterNodeCount",
            call: "net_masterNodeCount",
            params: 0,
        }),
        new Method({
            name: "isMasterNode",
            call: "net_isMasterNode",
            params: 0,
        }),

        new Method({
            name: "maxPeerCount",
            call: "net_maxPeerCount",
            params: 0,
        }),
    ];
    constructor(private web3: Web3) {
        super(web3);
        this.extendNet();
    }

    extendNet() {
        _.each(this.methods, (method: any) => {
            method.attachToObject(this);
            method.setRequestManager((this.web3 as any)._requestManager);
        });
    }
}
