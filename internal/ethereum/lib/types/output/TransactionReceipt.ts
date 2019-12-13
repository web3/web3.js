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
 * @file TransactionReceipt.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import {BigNumber} from '@ethersproject/bignumber';
import {isArray} from 'lodash';
import Log from './Log';
import Address from "../input/Address";

export default class TransactionReceipt {
    /**
     * @property properties
     */
    private properties: any;

    /**
     * @param {Object} receipt
     *
     * @constructor
     */
    constructor(receipt: any) {
        this.properties = receipt;

        this.blockNumber = receipt.blockNumber;
        this.transactionIndex = receipt.transactionIndex;
        this.gas = receipt.gas;
        this.cumulativeGasUsed = receipt.cumulativeGasUsed;
        this.gasUsed = receipt.gasUsed;
        this.to = receipt.to;
        this.from = receipt.from;
        this.logs = receipt.logs;
        this.contractAddress = receipt.contractAddress;
        this.status = receipt.status;
    }

    /**
     * Getter for the blockNumber property.
     *
     * @property blockNumber
     *
     * @returns {Number}
     */
    public get blockNumber() {
        return this.properties.blockNumber;
    }

    /**
     * Setter for the blockNumber property.
     *
     * @property blockNumber
     *
     * @param {Number|null} blockNumber
     */
    public set blockNumber(blockNumber: number | null) {
        if (blockNumber || blockNumber === 0) {
            this.properties.blockNumber = BigNumber.from(blockNumber).toNumber();

            return;
        }

        this.properties.blockNumber = null;
    }

    /**
     * Getter for the transactionIndex property.
     *
     * @property transactionIndex
     *
     * @returns {Number}
     */
    public get transactionIndex() {
        return this.properties.transactionIndex;
    }

    /**
     * Setter for the transactionIndex property.
     *
     * @property transactionIndex
     *
     * @param {String|null} transactionIndex
     */
    public set transactionIndex(transactionIndex) {
        if (transactionIndex || transactionIndex === 0) {
            this.properties.transactionIndex = BigNumber.from(transactionIndex).toString();

            return;
        }

        this.properties.transactionIndex = transactionIndex;
    }

    /**
     * Getter for the gasPrice property.
     *
     * @property gasPrice
     *
     * @returns {Number}
     */
    public get gasPrice() {
        return this.properties.gasPrice;
    }

    /**
     * Getter for the gasPrice property.
     *
     * @property gasPrice
     *
     * @param {String} gasPrice
     */
    public set gasPrice(gasPrice) {
        if (gasPrice) {
            this.properties.gasPrice = BigNumber.from(gasPrice).toString();

            return;
        }

        this.properties.gasPrice = gasPrice;
    }

    /**
     * Getter for the value property.
     *
     * @property value
     *
     * @returns {String}
     */
    public get value() {
        return this.properties.value;
    }

    /**
     * Setter for the value property
     *
     * @property value
     *
     * @param {String} value
     */
    public set value(value) {
        if (value) {
            this.properties.value = BigNumber.from(value).toString();

            return;
        }

        this.properties.value = value;
    }

    /**
     * Getter for the nonce property.
     *
     * @property nonce
     *
     * @returns {Number}
     */
    public get nonce() {
        return this.properties.nonce;
    }

    /**
     * Setter for the nonce property.
     *
     * @property nonce
     *
     * @param {String} nonce
     */
    public set nonce(nonce) {
        this.properties.nonce = BigNumber.from(nonce).toString();
    }

    /**
     * Getter for the gas property.
     *
     * @property gas
     *
     * @returns {Number}
     */
    public get gas() {
        return this.properties.gas;
    }

    /**
     * Setter for the gas property.
     *
     * @property gas
     *
     * @param {String} gas
     */
    public set gas(gas) {
        if (gas) {
            this.properties.gas = BigNumber.from(gas).toString();
        }

        this.properties.gas = gas;
    }

    /**
     * Getter for the cumulativeGasUsed property.
     *
     * @property cumulativeGasUsed
     *
     * @returns {Number}
     */
    public get cumulativeGasUsed() {
        return this.properties.cumulativeGasUsed;
    }

    /**
     * Setter for the cumulativeGasUsed property.
     *
     * @property cumulativeGasUsed
     *
     * @param cumulativeGasUsed
     */
    public set cumulativeGasUsed(cumulativeGasUsed) {
        this.properties.cumulativeGasUsed = BigNumber.from(cumulativeGasUsed).toString();
    }

    /**
     * Getter for the gasUsed property.
     *
     * @property gasUsed
     *
     * @returns {Number}
     */
    public get gasUsed() {
        return this.properties.gasUsed;
    }

    /**
     * Setter for gasUsed property.
     *
     * @property gasUsed
     *
     * @param {String} gasUsed
     */
    public set gasUsed(gasUsed) {
        if (gasUsed) {
            this.properties.gasUsed = BigNumber.from(gasUsed).toString();
        }

        this.properties.gasUsed = gasUsed;
    }

    /**
     * Getter for the to property.
     *
     * @property to
     *
     * @returns {String|null}
     */
    public get to() {
        return this.properties.to;
    }

    /**
     * Setter for the to property.
     *
     * @property to
     *
     * @param {String} to
     */
    public set to(to) {
        if (to && Address.isValid(to)) {
            // tx.to could be `0x0` or `null` while contract creation
            this.properties.to = Address.toChecksum(to);

            return;
        }

        this.properties.to = null; // set to `null` if invalid address
    }

    /**
     * Getter for the from property.
     *
     * @property from
     *
     * @returns {String}
     */
    public get from() {
        return this.properties.from;
    }

    /**
     * Setter for the from property.
     *
     * @property from
     *
     * @param {String} from
     */
    public set from(from) {
        if (from) {
            this.properties.from = Address.toChecksum(from);
        }
    }

    /**
     * Getter for the logs property.
     *
     * @property logs
     *
     * @returns {Array<Log>}
     */
    public get logs() {
        return this.properties.logs;
    }

    /**
     * Setter for the logs property.
     *
     * @property logs
     *
     * @param {Log} logs
     */
    public set logs(logs) {
        if (isArray(logs)) {
            this.properties.logs = logs.map((log) => {
                return new Log(log);
            });
        }
    }

    /**
     * Getter for the contractAddress property.
     *
     * @property contractAddress
     *
     * @returns {Array<Log>}
     */
    public get contractAddress() {
        return this.properties.contractAddress;
    }

    /**
     * Setter for the contractAddress property.
     *
     * @property contractAddress
     *
     * @param {String} contractAddress
     */
    public set contractAddress(contractAddress) {
        if (contractAddress) {
            this.properties.contractAddress = Address.toChecksum(contractAddress);
        }
    }

    /**
     * Getter for the status property.
     *
     * @property status
     *
     * @returns {Array<Log>}
     */
    public get status() {
        return this.properties.status;
    }

    /**
     * Setter for the status property.
     *
     * @property status
     *
     * @param {String} status
     */
    public set status(status) {
        if (typeof status !== 'undefined' && status !== null) {
            this.properties.status = Boolean(parseInt(status));

            return;
        }

        this.properties.status = true;
    }

    /**
     * Getter for the transactionHash property.
     *
     * @method transactionHash
     *
     * @returns {String}
     */
    public get transactionHash() {
        return this.properties.transactionHash;
    }

    /**
     * Setter for the transactionHash property.
     *
     * @property transactionHash
     *
     * @param {String} transactionHash
     */
    public set transactionHash(transactionHash) {
        this.properties.transactionHash = transactionHash;
    }

    /**
     * Getter for the logsBloom property.
     *
     * @method logsBloom
     *
     * @returns {String}
     */
    public get logsBloom() {
        return this.properties.logsBloom;
    }

    /**
     * Setter for the logsBloom property.
     *
     * @property logsBloom
     *
     * @param {String} logsBloom
     */
    public set logsBloom(logsBloom) {
        this.properties.logsBloom = logsBloom;
    }

    /**
     * Setter for the root property.
     *
     * @property root
     *
     * @param {String} root
     */
    public set root(root) {
        this.properties.root = root;
    }

    /**
     * Getter for the root property.
     *
     * @property root
     *
     * @returns {String}
     */
    public get root() {
        return this.properties.root;
    }

    /**
     * Getter for the blockHash property.
     *
     * @property blockHash
     *
     * @returns {String}
     */
    public get blockHash() {
        return this.properties.blockHash;
    }

    /**
     * Setter for the blockHash property.
     *
     * @property blockHash
     *
     * @param {String} blockHash
     */
    public set blockHash(blockHash) {
        this.properties.blockHash = blockHash;
    }
}
