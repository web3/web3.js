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

import {ClientOptions, ClientRequestArgs} from "web3-providers-ws";
import { ReconnectOptions } from 'web3-utils';

export enum Transport {
    HTTPS = "https",
    WebSocket = "wss"
};

export enum Network {
    ETH_MAINNET = "eth_mainnet",
    ETH_GOERLI = "eth_goerli",
    ETH_SEPOLIA = "eth_sepolia",
    ETH_HOLESKY = "eth_holesky",

    POLYGON_MAINNET= "polygon_mainnet",
    POLYGON_MUMBAI= "polygon_mumbai",
    POLYGON_AMONY= "polygon_amony",

    ARBITRUM_MAINNET = "arbitrum_mainnet",
    ARBITRUM_SEPOLIA = "arbitrum_sepolia",

    BASE_MAINNET = "base_mainnet",
    BASE_SEPOLIA = "base_sepolia",

    OPTIMISM_MAINNET = "optimism_mainnet",
    OPTIMISM_SEPOLIA = "optimism_sepolia",

    BNB_MAINNET = "bnb_mainnet",
    BNB_TESTNET = "bnb_testnet"
};

// Combining the ws types
export type SocketOptions = {
    socketOptions?: ClientOptions | ClientRequestArgs;
    reconnectOptions?: Partial<ReconnectOptions>;
};