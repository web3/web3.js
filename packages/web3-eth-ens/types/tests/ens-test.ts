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
 * @file ens-test.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {Accounts} from 'web3-eth-accounts';
import {Ens} from 'web3-eth-ens';

const ens = new Ens('http://localhost:7545', null, new Accounts('http://localhost:7545'));

// $ExpectType Registry
ens.registry;

// $ExpectType Promise<Contract>
ens.resolver('name');

// $ExpectType Promise<boolean>
ens.supportsInterface('name', 'interfaceId');

// $ExpectType Promise<string>
ens.getAddress('name');

// $ExpectType PromiEvent<any>
ens.setAddress('name', 'address', {});

// $ExpectType Promise<string>
ens.getPubkey('name');

// $ExpectType PromiEvent<any>
ens.setPubkey('name', 'x', 'y', {});

// $ExpectType Promise<string>
ens.getText('name', 'key');

// $ExpectType PromiEvent<any>
ens.setText('name', 'key', 'value', {});

// $ExpectType Promise<string>
ens.getContent('name');

// $ExpectType PromiEvent<any>
ens.setContent('name', 'hash', {});

// $ExpectType Promise<string>
ens.getMultihash('name');

// $ExpectType PromiEvent<any>
ens.setMultihash('name', 'hash', {});

// $ExpectType Promise<string>
ens.getContenthash('name');

// $ExpectType PromiEvent<any>
ens.setContenthash('name', 'hash', {});
