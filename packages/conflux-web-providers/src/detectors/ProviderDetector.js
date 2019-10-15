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

const global =
    (function() {
        return this || (typeof self === 'object' && self);
        // eslint-disable-next-line no-new-func
    })() || new Function('return this')();

// TODO: Remove the detector because of window/global.cfx
export default class ProviderDetector {
    /**
     * Detects which provider is given in the current environment
     *
     * @method detect
     *
     * @returns {Object|null} provider
     */
    static detect() {
        if (
            typeof global.confluxProvider !== 'undefined' &&
            global.confluxProvider.constructor.name === 'CfxProvider'
        ) {
            return global.confluxProvider;
        }

        if (typeof global.confluxWeb !== 'undefined' && global.confluxWeb.currentProvider) {
            return global.confluxWeb.currentProvider;
        }

        return null;
    }
}
