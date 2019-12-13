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
 * @file JsonRpcError.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

export default class JsonRpcError extends Error {
    /**
     * @property prefix
     */
    protected prefix: string = '';

    /**
     * @property host
     */
    public host: string;

    /**
     * TODO: Create payload interface
     *
     * @property payload
     */
    public payload: object | undefined;

    /**
     * @property response
     */
    public response: any;

    /**
     * @param {String} message
     * @param {String} host
     * @param {Object} payload
     * @param {any} response
     *
     * @constructor
     */
    public constructor(message: string, host: string, payload?: object, response?: any) {
        super();
        this.message = this.prefix + message;
        this.host = host;
        this.payload = payload;
        this.response = response;
    }
}
