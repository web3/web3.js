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

import { EthExecutionAPI } from "web3-types";
import { Transport, Network } from "./types.js";
import { Web3ExternalProvider } from "./web3_provider.js";

export class QuickNodeProvider extends Web3ExternalProvider<EthExecutionAPI> {

    constructor(
        network: Network = Network.ETH_MAINNET,
        transport: Transport = Transport.HTTPS,
        token: String = "") {

        super(network, transport, token);

    }

    getRPCURL(network: Network,
        transport: Transport,
        token: String) {

        let host: string;

        switch (network) {
            case Network.ETH_MAINNET:
                host = "web3.quiknode.pro";
                break;
            case Network.ETH_GOERLI:
                host = "web3.ethereum-goerli.quiknode.pro";
                break;
            case Network.ETH_SEPOLIA:
                host = "web3.ethereum-sepolia.quiknode.pro";
                break
            case Network.ETH_HOLESKY:
                host = "web3.ethereum-holesky.quiknode.pro";
                break;
            default:
                throw new Error("Network info not avalible.");
        }

        return `${transport}://${host}/${token}`;
    }
}
