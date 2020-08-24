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
 * @file index.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethereum.org>
 *   Gav Wood <gav@parity.io>
 *   Jeffrey Wilcke <jeffrey.wilcke@ethereum.org>
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea <marian@ethereum.org>
 * @date 2017
 */

"use strict";


const version = require('../package.json').version;
const Eth = require('web3-eth');
const Net = require('web3-net');
const Personal = require('web3-eth-personal');
const Shh = require('web3-shh');
const Bzz = require('web3-bzz');
const utils = require('web3-utils');
const { Manager, BatchManager } = require("web3-core-requestmanager");

const preset = {}

class Web3 {
  // todo no catch all args
  constructor (...args) {

    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;

    this.version = version;
    this.utils = utils;



    this.eth = new Eth(this);
    this.shh = new Shh(this);
    this.bzz = new Bzz(this);


    // static values
    this.version = Web3.version;
    this.utils = Wb3.utils;
    this.modules = Web3.modules;

    // attach batch request creation
    this.BatchRequest = BatchManager.bind(null, pkg._requestManager);

    // attach extend function
    this.extend = extend(this);

  }

  setProvider (provider, net) {
    this.eth.setRequestManager(this._requestManager);
    this.shh.setRequestManager(this._requestManager);
    this.bzz.setProvider(provider);
    return true;
  }

  addProviders (pkg) {
    this.givenProvider = requestManager.Manager.givenProvider;
    this.providers = requestManager.Manager.providers;
  }

  static get providers () {
    return Manager.providers
  }

  static get givenProvider () {
    return Manager.givenProvider
  }

  static setProvider (provider, net) {
    preset.provider = provider;
    preset.net = net;
    return true;
  }

  static get utils () {
    return utils;
  }

  static get version () {
    return version;
  }

  static get modules () {
    return {
      Eth: Eth,
      Net: Net,
      Personal: Personal,
      Shh: Shh,
      Bzz: Bzz
    };
  }

};

module.exports = Web3;

