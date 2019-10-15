/*
    This file is part of conflux-web.js.

    conflux-web.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    conflux-web.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with conflux-web.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Network} from 'conflux-web-net';
import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import {ProviderResolver} from 'conflux-web-providers';
import MethodFactory from './factories/MethodFactory';
import DebugModule from './Debug.js';

/**
 * Returns the Debug object
 *
 * @method Debug
 *
 * @param {ConfluxWebCfxProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Net.Socket} net
 * @param {Object} options
 *
 * @returns {Debug}
 */
export function Debug(provider, net = null, options = {}) {
    const resolvedProvider = new ProviderResolver().resolve(provider, net);

    return new DebugModule(
        resolvedProvider,
        new MethodFactory(Utils, formatters),
        new Network(resolvedProvider, null, options),
        Utils,
        formatters,
        options,
        null
    );
}
