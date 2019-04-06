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
 * @file admin-tests.ts
 * @author Prince Sinha  <sinhaprince013@gmail.com>
 * @date 2019
 */
import {Admin} from 'web3-eth-admin';

const admin = new Admin('http://localhost:8545');

// $ExpectType Promise<boolean>
admin.addAdminPeer('enode://486cbdc847079d423515a76add04f706f3b76c52120ec195b7dacbe3ad9164cf58bd389e3fc6075457b11a132d3627a625d8b14e0f0b73a86e5a3415fa4c6042@127.0.0.1:30303');

// $ExpectType Promise<boolean>
admin.addAdminPeer(
    'enode://486cbdc847079d423515a76add04f706f3b76c52120ec195b7dacbe3ad9164cf58bd389e3fc6075457b11a132d3627a625d8b14e0f0b73a86e5a3415fa4c6042@127.0.0.1:30303',
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<string>
admin.getadminDataDirectory();

// $ExpectType Promise<string>
admin.getadminDataDirectory(
    (error: Error, result: string) => {}
);

// $ExpectType Promise<any>
admin.getAdminNodeInfo();

// $ExpectType Promise<any>
admin.getAdminNodeInfo(
    (error: Error, result: ArrayBuffer) => {}
);

// $ExpectType Promise<any>
admin.getAdminPeers();

// $ExpectType Promise<any>
admin.getAdminPeers(
    (error: Error, result: ArrayBuffer) => {}
);

// $ExpectType Promise<string>
admin.setAdminSolc('/usr/bin/solc');

// $ExpectType Promise<string>
admin.setAdminSolc(
    '/usr/bin/solc',
    (error: Error, result: string) => {}
)

// $ExpectType Promise<boolean>
admin.startRPC("127.0.0.1", 8545);

// $ExpectType Promise<boolean>
admin.startRPC("127.0.0.1", 8545, "");

// $ExpectType Promise<boolean>
admin.startRPC("127.0.0.1", 8545, "", "eth,net,web3");

// $ExpectType Promise<boolean>
admin.startRPC(
    "127.0.0.1", 8545, "", "eth,net,web3",
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<boolean>
admin.startWS("127.0.0.1", 8546);

// $ExpectType Promise<boolean>
admin.startWS("127.0.0.1", 8546, "");

// $ExpectType Promise<boolean>
admin.startWS("127.0.0.1", 8546, "", "eth,net,web3");

// $ExpectType Promise<boolean>
admin.startWS(
    "127.0.0.1", 8546, "", "eth,net,web3",
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<boolean>
admin.stopRPC();

// $ExpectType Promise<boolean>
admin.stopRPC(
    (error: Error, result: boolean) => {}
)

// $ExpectType Promise<boolean>
admin.stopWS();

// $ExpectType Promise<boolean>
admin.stopWS(
    (error: Error, result: boolean) => {}
)