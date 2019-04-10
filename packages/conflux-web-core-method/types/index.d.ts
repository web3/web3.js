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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {Utils} from 'conflux-web-utils';
import {AbstractConfluxWebModule, PromiEvent} from 'conflux-web-core';
import {formatters} from 'conflux-web-core-helpers';

export class AbstractMethod {
    constructor(
        rpcMethod: string,
        parametersAmount: number,
        utils: Utils,
        formatters: formatters,
        moduleInstance: AbstractConfluxWebModule
    );

    utils: Utils;
    formatters: formatters;
    promiEvent: PromiEvent<any>;
    rpcMethod: string;
    parametersAmount: number;
    parameters: any[];

    getArguments(): any;

    setArguments(args: any[]): void;

    isHash(parameter: string): boolean;

    hasWallets(): boolean;

    callback(error: string | Error, response: any): void;

    beforeExecution(moduleInstance: AbstractConfluxWebModule): void;

    afterExecution(response: any): any;

    execute(): Promise<any> | PromiEvent<any> | string;

    clearSubscriptions(unsubscribeMethod: string): Promise<boolean | Error>;
}

export class AbstractMethodFactory {
    constructor(utils: Utils, formatters: formatters);

    methods: null | object;
    hasMethod: boolean;

    createMethod(name: string, moduleInstance: AbstractConfluxWebModule): AbstractMethod;
}
