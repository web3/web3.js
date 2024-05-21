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
import { Web3APIPayload, EthExecutionAPI, Web3APIMethod } from "web3-types";
import { Network, Transport } from "../../src/types";
import { Web3ExternalProvider } from "../../src/web3_provider";

jest.mock('web3-providers-ws', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      request: jest.fn().mockResolvedValue({ result: 'mock-result' }),
    })),
  };
});

class MockWeb3ExternalProvider extends Web3ExternalProvider {
  public constructor(network: Network, transport: Transport, token: string){
    super(network, transport, token, "");
  }
    // eslint-disable-next-line class-methods-use-this
    public getRPCURL(_network: Network, _transport: Transport, _token: string): string {
      return 'https://example.com/';
    }
  }

describe('Web3ExternalProvider', () => {
  it('should make a request using the HTTPS provider', async () => {
    const network: Network = Network.ETH_MAINNET;
    const transport: Transport = Transport.HTTPS;
    const token = 'your-token';

    const mockHttpProvider = {
      request: jest.fn(),
    };

    const mockResponse = { result: 'mock-result' };
    mockHttpProvider.request.mockResolvedValue(mockResponse);

    const provider = new MockWeb3ExternalProvider(network, transport, token);
    (provider as any).provider = mockHttpProvider; 

    const payload: Web3APIPayload<EthExecutionAPI, Web3APIMethod<EthExecutionAPI>> = {
      method: 'eth_getBalance',
      params: ['0x0123456789012345678901234567890123456789', 'latest'],
    };

    const result = await provider.request(payload);
    expect(result).toEqual(mockResponse);
  });

  it('should make a request using the WebSocket provider', async () => {
    const network: Network = Network.ETH_MAINNET;
    const transport: Transport = Transport.WebSocket;
    const token = 'your-token';

    const provider = new MockWeb3ExternalProvider(network, transport, token);
    (provider as any).getRPCURL = jest.fn().mockReturnValue('ws://mock-rpc-url.com');

    const payload: Web3APIPayload<EthExecutionAPI, Web3APIMethod<EthExecutionAPI>> = {
      method: 'eth_getBalance',
      params: ['0x0123456789012345678901234567890123456789', 'latest'],
    };

    const result = await provider.request(payload);
    expect(result).toEqual({ result: 'mock-result' });
  });
});