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
/* eslint-disable max-classes-per-file */

import HttpProvider from 'web3-providers-http';
import WebSocketProvider from 'web3-providers-ws';
import WebSocket from 'isomorphic-ws';

import { Web3ExternalProvider } from '../../src/web3_provider';
import { Network, Transport } from '../../src/types';

// Mock implementation so ws doesnt have openhandle after test exits as it attempts to connects at start
jest.mock('isomorphic-ws', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      const eventListeners: { [key: string]: Function[] } = {};

      return {
        addEventListener: jest.fn((event, handler) => {
          if (!eventListeners[event]) {
            eventListeners[event] = [];
          }
          eventListeners[event].push(handler);
        }),
        removeEventListener: jest.fn((event, handler) => {
          if (eventListeners[event]) {
            eventListeners[event] = eventListeners[event].filter(h => h !== handler);
          }
        }),
        dispatchEvent: jest.fn((event) => {
          const eventType = event.type;
          if (eventListeners[eventType]) {
            eventListeners[eventType].forEach(handler => handler(event));
          }
        }),
        close: jest.fn(),
        send: jest.fn(),
        readyState: WebSocket.OPEN,
      };
    }),
  };
});

class MockWeb3ExternalProviderA extends Web3ExternalProvider {
  public constructor(network: Network, transport: Transport, token: string){
    super(network, transport, token, "");
  }
  // eslint-disable-next-line class-methods-use-this
  public getRPCURL(_network: Network, _transport: Transport, _token: string, _host=""): string {
    let transport = "";
    if (_transport === Transport.HTTPS)
      transport = "http://";
    else if (_transport === Transport.WebSocket)
      transport = "wss://";

    return `${transport}127.0.0.1/`;
  }
}

describe('Web3ExternalProvider', () => {
  it('should initialize the provider correctly', () => {
    const network: Network = Network.ETH_MAINNET;
    const transport: Transport = Transport.HTTPS;
    const token = 'your-token';

    const provider = new MockWeb3ExternalProviderA(network, transport, token);

    expect(provider.provider).toBeInstanceOf(HttpProvider);
  });

  it('should initialize the provider with WebSocketProvider for WebSocket transport', () => {
    const network: Network = Network.ETH_MAINNET;
    const transport: Transport = Transport.WebSocket;
    const token = 'your-token';

    const provider = new MockWeb3ExternalProviderA(network, transport, token);
    expect(provider.provider).toBeInstanceOf(WebSocketProvider);
  });

});
/* eslint-enable max-classes-per-file */