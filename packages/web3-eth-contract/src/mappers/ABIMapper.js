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
 * @file ABIMapper.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class ABIMapper {

    /**
     * @param {ContractModuleFactory} contractPackageFactory
     * @param {ABICoder} abiCoder
     * @param {Object} utils
     *
     * @constructor
     */
    constructor(contractPackageFactory, abiCoder, utils) {
        this.utils = utils;
        this.abiCoder = abiCoder;
        this.contractPackageFactory = contractPackageFactory;
    }

    /**
     * Maps the abi to an object of methods and events as AbiItemModel
     *
     * @param {Array} abi
     *
     * @returns {ABIModel}
     */
    map(abi) {
        const self = this;
        const mappedAbiItems = {
            methods: {},
            events: {}
        };

        abi.forEach(abiItem => {
            abiItem.constant = self.isConstant(abiItem);
            abiItem.payable = self.isPayable(abiItem);

            if (abiItem.name) {
                abiItem.funcName = self.utils._jsonInterfaceMethodToString(abiItem);
            }

            let abiItemModel;

            if (abiItem.type === 'function') {
                abiItem.signature = self.abiCoder.encodeFunctionSignature(abiItem.funcName);

                abiItemModel = self.contractPackageFactory.createABIItemModel(abiItem);

                // Check if an method already exists with this name and if it exists than create an array and push this abiItem
                // into it. This will be used if there are methods with the same name but with different arguments.
                if (!mappedAbiItems.methods[abiItem.name]) {
                    mappedAbiItems.methods[abiItem.name] = abiItemModel;
                } else {
                    if (_.isArray(mappedAbiItems.methods[abiItem.name])) {
                        mappedAbiItems.methods[abiItem.name].push(abiItemModel);
                    } else {
                        mappedAbiItems.methods[abiItem.name] = [
                            mappedAbiItems.methods[abiItem.name],
                            abiItemModel
                        ];
                    }
                }

                mappedAbiItems.methods[abiItem.signature] = abiItemModel;
                mappedAbiItems.methods[abiItem.funcName] = abiItemModel;

                return;
            }

            if (abiItem.type === 'event') {
                abiItem.signature = self.abiCoder.encodeEventSignature(abiItem.funcName);

                abiItem = self.contractPackageFactory.createABIItemModel(event);

                if (!mappedAbiItems.events[abiItem.name] || mappedAbiItems.events[abiItem.name].name === 'bound ') {
                    mappedAbiItems.events[abiItem.name] = abiItemModel;
                }

                mappedAbiItems.events[abiItem.signature] = abiItemModel;
                mappedAbiItems.events[abiItem.funcName] = abiItemModel;
            }

            if (abiItem.type === 'constructor') {
                abiItem.signature = abiItem.type;
                mappedAbiItems.methods['contractConstructor'] = self.contractPackageFactory.createABIItemModel(abiItem);
            }
        });

        return this.contractPackageFactory.createABIModel(mappedAbiItems);
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
        return (abiItem.stateMutability === "view" || abiItem.stateMutability === "pure" || abiItem.constant);
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
        return (abiItem.stateMutability === "payable" || abiItem.payable);
    }
}
