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
 * @file AbiMapper.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isArray from 'lodash/isArray';

export default class AbiMapper {
    /**
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     *
     * @constructor
     */
    constructor(contractModuleFactory, abiCoder, utils) {
        this.utils = utils;
        this.abiCoder = abiCoder;
        this.contractModuleFactory = contractModuleFactory;
    }

    /**
     * Maps the abi to an object of methods and events as AbiItemModel
     *
     * @param {Array} abi
     *
     * @returns {AbiModel}
     */
    map(abi) {
        const mappedAbiItems = {
            methods: {},
            events: {}
        };

        abi.forEach((abiItem) => {
            abiItem.constant = this.isConstant(abiItem);
            abiItem.payable = this.isPayable(abiItem);

            if (abiItem.name) {
                abiItem.funcName = this.utils.jsonInterfaceMethodToString(abiItem);
            }

            let abiItemModel;

            if (abiItem.type === 'function') {
                abiItem.signature = this.abiCoder.encodeFunctionSignature(abiItem.funcName);

                abiItemModel = this.contractModuleFactory.createAbiItemModel(abiItem);

                // Check if an method already exists with this name and if it exists than create an array and push this abiItem
                // into it. This will be used if there are methods with the same name but with different arguments.
                if (!mappedAbiItems.methods[abiItem.name]) {
                    mappedAbiItems.methods[abiItem.name] = abiItemModel;
                } else {
                    if (isArray(mappedAbiItems.methods[abiItem.name])) {
                        mappedAbiItems.methods[abiItem.name].push(abiItemModel);
                    } else {
                        mappedAbiItems.methods[abiItem.name] = [mappedAbiItems.methods[abiItem.name], abiItemModel];
                    }
                }

                mappedAbiItems.methods[abiItem.signature] = abiItemModel;
                mappedAbiItems.methods[abiItem.funcName] = abiItemModel;

                return;
            }

            if (abiItem.type === 'event') {
                abiItem.signature = this.abiCoder.encodeEventSignature(abiItem.funcName);

                abiItemModel = this.contractModuleFactory.createAbiItemModel(abiItem);

                if (!mappedAbiItems.events[abiItem.name] || mappedAbiItems.events[abiItem.name].name === 'bound ') {
                    mappedAbiItems.events[abiItem.name] = abiItemModel;
                }

                mappedAbiItems.events[abiItem.signature] = abiItemModel;
                mappedAbiItems.events[abiItem.funcName] = abiItemModel;
            }

            if (abiItem.type === 'constructor') {
                abiItem.signature = abiItem.type;
                mappedAbiItems.methods['contractConstructor'] = this.contractModuleFactory.createAbiItemModel(abiItem);
            }
        });

        return this.contractModuleFactory.createAbiModel(mappedAbiItems);
    }

    /**
     * Checks if the given abiItem is a constant
     *
     * @method isConstant
     *
     * @param {Object} abiItem
     *
     * @returns {Boolean}
     */
    isConstant(abiItem) {
        return abiItem.stateMutability === 'view' || abiItem.stateMutability === 'pure' || abiItem.constant;
    }

    /**
     * Checks if the given abiItem is payable
     *
     * @method isPayable
     *
     * @param {Object} abiItem
     *
     * @returns {Boolean}
     */
    isPayable(abiItem) {
        return abiItem.stateMutability === 'payable' || abiItem.payable;
    }
}
