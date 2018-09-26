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

"use strict";

/**
 * @param {ContractPackageFactory} contractPackageFactory
 * @param {ABICoder} abiCoder
 * @param {Utils} utils
 *
 * @constructor
 */
function ABIMapper(contractPackageFactory, abiCoder, utils) {
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
ABIMapper.prototype.map = function (abi) {
    var self = this;
    var mappedAbiItem = {
        methods: {},
        events: {}
    };

    abi.forEach(function (abiItem) {
        abiItem.constant = self.isConstant(abiItem);
        abiItem.payable = self.isPayable(abiItem);

        if (abiItem.name) {
            abiItem.funcName = self.utils._jsonInterfaceMethodToString(abiItem);
        }

        var abiItemModel;

        if (abiItem.type === 'function') {
            abiItem.signature = self.abiCoder.encodeFunctionSignature(abiItem.funcName);

            abiItemModel = self.contractPackageFactory.createAbiItemModel(abiItem);

            // Check if an method already exists with this name and if it exists than create an array and push this abiItem
            // into it. This will be used if there are methods with the same name but with different arguments.
            if (!mappedAbiItem.methods[abiItem.name]) {
                mappedAbiItem.methods[abiItem.name] = abiItemModel;
            } else {
                if (_.isArray(mappedAbiItem.methods[abiItem.name])) {
                    mappedAbiItem.methods[abiItem.name].push(abiItemModel);
                } else {
                    mappedAbiItem.methods[abiItem.name] = [
                        mappedAbiItem.methods[abiItem.name],
                        abiItemModel
                    ];
                }
            }

            mappedAbiItem.methods[abiItem.signature] = abiItemModel;
            mappedAbiItem.methods[abiItem.funcName] = abiItemModel;

            return abiItem;
        }

        if (abiItem.type === 'event') {
            abiItem.signature = self.abiCoder.encodeEventSignature(abiItem.funcName);

            abiItem = self.contractPackageFactory.createAbiItemModel(event);

            if (!mappedAbiItem.events[abiItem.name] || mappedAbiItem.events[abiItem.name].name === 'bound ') {
                mappedAbiItem.events[abiItem.name] = abiItemModel;
            }

            mappedAbiItem.events[abiItem.signature] = abiItemModel;
            mappedAbiItem.events[abiItem.funcName] = abiItemModel;

            return method;
        }
    });

    return this.contractPackageFactory.createAbiModel(mappedAbiItem);
};

/**
 * Checks if the given abiItem is a constant
 *
 * @method isConstant
 *
 * @param {Object} abiItem
 *
 * @returns {Boolean}
 */
ABIMapper.prototype.isConstant = function (abiItem) {
    return (abiItem.stateMutability === "view" || abiItem.stateMutability === "pure" || abiItem.constant);
};

/**
 * Checks if the given abiItem is payable
 *
 * @method isPayable
 *
 * @param {Object} abiItem
 *
 * @returns {Boolean}
 */
ABIMapper.prototype.isPayable = function (abiItem) {
    return (abiItem.stateMutability === "payable" || abiItem.payable);
};

module.exports = ABIMapper;
