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

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

export default class AbiMapper {
    /**
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {AbiCoder} abiCoder
     *
     * @constructor
     */
    constructor(contractModuleFactory, abiCoder) {
        this.abiCoder = abiCoder;
        this.contractModuleFactory = contractModuleFactory;
        this.hasConstructor = false;
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
                abiItem.funcName = this.jsonInterfaceMethodToString(abiItem);
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

                this.hasConstructor = true;
            }
        });

        if (!this.hasConstructor) {
            mappedAbiItems.methods['contractConstructor'] = this.contractModuleFactory.createAbiItemModel({
                inputs: [],
                payable: false,
                constant: false,
                type: 'constructor'
            });
        }

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

    /**
     * Should be used to create full function/event name from json abi
     *
     * @method jsonInterfaceMethodToString
     *
     * @param {Object} json
     *
     * @returns {String} full function/event name
     */
    jsonInterfaceMethodToString(json) {
        if (isObject(json) && json.name && json.name.includes('(')) {
            return json.name;
        }

        return `${json.name}(${this.flattenTypes(false, json.inputs).join(',')})`;
    }

    /**
     * Should be used to flatten json abi inputs/outputs into an array of type-representing-strings
     *
     * @method _flattenTypes
     *
     * @param {Boolean} includeTuple
     * @param {Object} puts
     *
     * @returns {Array} parameters as strings
     */
    flattenTypes(includeTuple, puts) {
        // console.log("entered _flattenTypes. inputs/outputs: " + puts)
        const types = [];

        puts.forEach((param) => {
            if (typeof param.components === 'object') {
                if (param.type.substring(0, 5) !== 'tuple') {
                    throw new Error('components found but type is not tuple; report on GitHub');
                }
                let suffix = '';
                const arrayBracket = param.type.indexOf('[');
                if (arrayBracket >= 0) {
                    suffix = param.type.substring(arrayBracket);
                }
                const result = this.flattenTypes(includeTuple, param.components);
                // console.log("result should have things: " + result)
                if (isArray(result) && includeTuple) {
                    // console.log("include tuple word, and its an array. joining...: " + result.types)
                    types.push(`tuple(${result.join(',')})${suffix}`);
                } else if (!includeTuple) {
                    // console.log("don't include tuple, but its an array. joining...: " + result)
                    types.push(`(${result.join(',')})${suffix}`);
                } else {
                    // console.log("its a single type within a tuple: " + result.types)
                    types.push(`(${result})`);
                }
            } else {
                // console.log("its a type and not directly in a tuple: " + param.type)
                types.push(param.type);
            }
        });

        return types;
    }
}
