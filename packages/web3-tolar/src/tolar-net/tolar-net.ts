import Web3 from "web3";

var Net = require("web3-net");

export class TolarNet extends Net {
    constructor(web3: Web3) {
        super(web3);
    }
}
