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
 * @file AbiItemModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import _ from 'underscore';

export default class AbiItemModel {
    /**
     * @param {Object} abiItem
     *
     * @constructor
     */
    constructor(abiItem) {
        this.abiItem = abiItem;
        this.signature = this.abiItem.signature;
        this.name = this.abiItem.name;
        this.anonymous = this.abiItem.anonymous;
        this.contractMethodParameters = [];

        Object.defineProperty(this, 'requestType', {
            get() {
                if (abiItem.type === 'function') {
                    if (abiItem.constant === true) {
                        return 'call';
                    }

                    return 'send';
                }

                if (abiItem.type === 'constructor') {
                    return 'contract-deployment';
                }
            }
        });
    }

    /**
     * Returns the input length of the abiItem
     *
     * @method getInputLength
     *
     * @returns {Number}
     */
    getInputLength() {
        if (_.isArray(this.abiItem.inputs)) {
            return this.abiItem.inputs.length;
        }

        return 0;
    }

    /**
     * Returns all inputs of the abi item
     *
     * @method getInputs
     *
     * @returns {Array}
     */
    getInputs() {
        let inputs = [];

        if (_.isArray(this.abiItem.inputs)) {
            inputs = this.abiItem.inputs;
        }

        return inputs;
    }

    /**
     * Checks if the given parameter array length matches the abiItem inputs length
     *
     * @method givenParametersLengthIsValid
     *
     * @returns {Error|Boolean}
     */
    givenParametersLengthIsValid() {
        const inputLength = this.getInputLength();

        if (this.contractMethodParameters.length === inputLength) {
            return true;
        }

        return new Error(
            `The number of arguments is not matching the methods required number. You need to pass ${inputLength} arguments.`
        );
    }

    /**
     * Returns the indexed input of this abiItem
     *
     * @returns {Array}
     */
    getIndexedInputs() {
        return this.getInputs().filter((input) => {
            return input.indexed === true;
        });
    }

    /**
     * Checks the type of this abiItem
     *
     * @method isOfType
     *
     * @returns {Boolean}
     */
    isOfType(type) {
        return this.abiItem.type === type;
    }
}
