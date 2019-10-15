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


import {AbstractConfluxWebModule} from 'conflux-web-core';
import {HttpProvider} from 'conflux-web-providers';

const httpProvider = new HttpProvider('http://localhost:8545', {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        }
    ],
    withCredentials: false
});

// $ExpectType Promise<any>
httpProvider.send('rpc_method', []);

// $ExpectType Promise<any[]>
httpProvider.sendBatch(
    [],
    new AbstractConfluxWebModule('http://localhost:7545')
);

// $ExpectType boolean
httpProvider.disconnect();
