import Web3 from "web3";
import { Method } from "web3-core-method";
var Method = require("web3-core-method");
var _ = require("underscore");

var Accounts = require("web3-eth-accounts");

export class TolarAccounts extends Accounts {
    methods: Method[] = [
        new Method({
            name: "create",
            call: "account_create",
            params: 1,
        }),
        new Method({
            name: "open",
            call: "account_open",
            params: 1,
        }),
        new Method({
            name: "listAddresses",
            call: "account_listAddresses",
            params: 0,
        }),

        new Method({
            name: "verifyAddress",
            call: "account_verifyAddress",
            params: 1,
        }),
        new Method({
            name: "createNewAddress",
            call: "account_createNewAddress",
            params: 3,
        }),
        new Method({
            name: "exportKeyFile",
            call: "account_exportKeyFile",
            params: 1,
        }),
        new Method({
            name: "importKeyFile",
            call: "account_importKeyFile",
            params: 4,
        }),
        new Method({
            name: "listBalancePerAddress",
            call: "account_listBalancePerAddress",
            params: 0,
        }),
        new Method({
            name: "sendRawTransaction",
            call: "account_sendRawTransaction",
            params: 8,
        }),
        new Method({
            name: "changePassword",
            call: "account_changePassword",
            params: 2,
        }),
        new Method({
            name: "changeAddressPassword",
            call: "account_changeAddressPasswords",
            params: 3,
        }),
        new Method({
            name: "sendFundTransferTransaction",
            call: "account_sendFundTransferTransaction",
            params: 7,
        }),
        new Method({
            name: "sendDeployContractTransaction",
            call: "account_sendDeployContractTransaction",
            params: 7,
        }),
        new Method({
            name: "sendExecuteFunctionTransaction",
            call: "account_sendExecuteFunctionTransaction",
            params: 8,
        }),
    ];
    constructor(private web3: Web3) {
        super(web3);
        this.extendAccounts3();
    }

    extendAccounts3() {
        _.each(this.methods, (method: any) => {
            method.attachToObject(this);
            method.setRequestManager((this.web3 as any)._requestManager);
        });
    }
}
