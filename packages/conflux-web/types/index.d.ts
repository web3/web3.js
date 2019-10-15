/*
    This file is part of confluxWeb.
    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import {AbstractConfluxWebModule, ConfluxWebModuleOptions} from 'conflux-web-core';
import {Utils} from 'conflux-web-utils';
import * as net from 'net';
import {provider} from 'conflux-web-providers';
import {Cfx} from 'conflux-web-cfx';
import {Network} from 'conflux-web-net';

export default class ConfluxWeb extends AbstractConfluxWebModule {
    constructor(
        provider: provider,
        net?: net.Socket,
        options?: ConfluxWebModuleOptions
    );

    static modules: Modules;
    static readonly givenProvider: any;

    utils: Utils;
    cfx: Cfx;
    version: string;
}

export interface Modules {
    Cfx: new (provider: provider, net: net.Socket) => Cfx;
    Net: new (provider: provider, net: net.Socket) => Network;
}
