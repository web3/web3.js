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

import {formatters} from 'conflux-web-core-helpers';
import * as Utils from 'conflux-web-utils';
import MethodFactory from './factories/MethodFactory';
import NetworkModule from './Network.js';

/**
 * Creates the Network Object
 *
 * @method Network
 *
 * @param {ConfluxWebCfxProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Net.Socket} net
 * @param {Object} options
 *
 * @returns {Network}
 */
export function Network(provider, net = null, options = {}) {
    return new NetworkModule(provider, new MethodFactory(Utils, formatters), Utils, formatters, options, null);
}
