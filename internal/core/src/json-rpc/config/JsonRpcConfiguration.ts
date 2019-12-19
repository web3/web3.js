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
 * @file JsonRpcConfiguration.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import AbstractProvider from "../../../lib/json-rpc/providers/AbstractProvider";

export default class JsonRpcConfiguration {
    /**
     * @property provider
     */
    public provider: AbstractProvider;

    /**
     * @property pollingInterval
     */
    public pollingInterval: number = 1000;

    /**
     * @param {Object} options
     *
     * @constructor
     */
    public constructor(options: any = {}, parent?) {
        // TODO: allow url as provider
        // // HTTP
        // if (/^http(s)?:\/\//i.test(provider)) {
        //     return this.providersModuleFactory.createHttpProvider(provider);
        // }
        // // WS
        // if (/^ws(s)?:\/\//i.test(provider)) {
        //     return this.providersModuleFactory.createWebsocketProvider(provider);
        // }
        //
        // // IPC
        // if (provider && isObject(net) && isFunction(net.connect)) {
        //     return this.providersModuleFactory.createIpcProvider(provider, net);
        // }

        if (!options.provider) {
            throw new Error('No JSON-RPC Provider given!');
        }

        this.provider = options.provider;
        this.pollingInterval = options.pollingInterval;
    }
}
