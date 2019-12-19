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
import HttpProvider from "../providers/HttpProvider";
import WebsocketProvider from "../providers/WebsocketProvider";

export default class JsonRpcConfiguration {
    /**
     * @property provider
     */
    public provider: AbstractProvider;

    /**
     * @property pollingInterval
     */
    public pollingInterval: number;

    /**
     * @param {Object} options
     * @param {Object} parent
     *
     * @constructor
     */
    public constructor(options: any = {}, parent?: any) {
        let host: string | undefined;
        let providerOptions;
        let provider;

        if (Array.isArray(options.provider)) {
            host = options.provider[0];
            providerOptions = options.provider[1];
        } else if (typeof options.provider === 'string') {
            host = options.provider;
        }

        if (host) {
            const ProviderConstructor = this.getProviderFromString(host);

            if (ProviderConstructor) {
                provider = new ProviderConstructor(host, providerOptions);
            }
        }

        if (parent && parent.provider instanceof Map) {
            if (host) {
                provider = parent.provider.get(host);
            } else {
                provider = parent.provider.get('default');
            }
        }

        parent = parent || {};

        this.provider = provider || options.provider || parent.provider;
        this.pollingInterval = options.pollingInterval || parent.pollingInterval || 1000;
    }

    /**
     * @method getProviderFromString
     *
     * @param {String} provider
     */
    private getProviderFromString(provider: string) {
        if (/^http(s)?:\/\//i.test(provider)) {
            return HttpProvider;
        }

        if (/^ws(s)?:\/\//i.test(provider)) {
            return WebsocketProvider;
        }

        // if (provider && net) {
        //     return IpcProvider
        // }
    }
}
