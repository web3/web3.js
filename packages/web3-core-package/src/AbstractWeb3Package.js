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
 * @file AbstractWeb3Package.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {Object} connectionModel
 * @constructor
 */
function AbstractWeb3Package(connectionModel) {
    this.connectionModel = connectionModel;
    this.givenProvider = connectionModel.givenProvider;
    this.currentProvider = this.connectionModel.provider;
    this.BatchRequest = '';
}

AbstractWeb3Package.prototype.setProvider = function (provider) {
    this.connectionModel.setProvider(provider);
};

AbstractWeb3Package.prototype.extend = function () {
    // TODO: Implement extend in a readable way

    // var extend = function (pckg) {
    //     /* jshint maxcomplexity:5 */
    //     var ex = function (extension) {
    //
    //         var extendedObject;
    //         if (extension.property) {
    //             if (!pckg[extension.property]) {
    //                 pckg[extension.property] = {};
    //             }
    //             extendedObject = pckg[extension.property];
    //         } else {
    //             extendedObject = pckg;
    //         }
    //
    //         if (extension.methods) {
    //             extension.methods.forEach(function (method) {
    //                 if(!(method instanceof Method)) {
    //                     method = new Method(method);
    //                 }
    //
    //                 method.attachToObject(extendedObject);
    //                 method.setRequestManager(pckg._requestManager);
    //             });
    //         }
    //
    //         return pckg;
    //     };
    //
    //     ex.formatters = formatters;
    //     ex.utils = utils;
    //     ex.Method = Method;
    //
    //     return ex;
    // };
};
