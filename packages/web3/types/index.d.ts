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
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import * as net from 'net';
import { AbstractWeb3Module, provider } from 'web3-core';
import { Eth } from 'web3-eth';
import { Personal } from 'web3-eth-personal';
import { Network } from 'web3-net';
import { Shh } from 'web3-shh';
import { Utils } from 'web3-utils';

export default class Web3 extends AbstractWeb3Module {
    constructor(provider: provider, net?: net.Socket);

    static modules: Modules;
    static readonly givenProvider: any;

    utils: Utils;
    eth: Eth;
    shh: Shh;
    version: string;
}

export interface Modules {
    Eth: new (provider: provider, net: net.Socket) => Eth;
    Net: new (provider: provider, net: net.Socket) => Network;
    Personal: new (provider: provider, net: net.Socket) => Personal;
    Shh: new (provider: provider, net: net.Socket) => Shh;
}
