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
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

export class Bzz {
    constructor(provider: any);

    setProvider(provider: any): boolean;

    givenProvider: any;
    currentProvider: string | null;

    upload(data: any): Promise<string>;

    download(bzzHash: string, localPath?: string): Promise<any>;

    pick: Pick;
    BatchRequest: new () => any;
}

export interface Pick {
    file: () => Promise<any>;
    directory: () => Promise<any>;
    data: () => Promise<any>;
}
