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


import HttpProvider, { HttpProviderOptions } from 'web3-providers-http';
import WebSocketProvider from 'web3-providers-ws';
import WebSocket from 'isomorphic-ws';

import { Web3ExternalProvider } from '../../src/web3_provider';
import { Network, SocketOptions, Transport } from '../../src/types';
import { ProviderConfigOptionsError } from '../../src/errors';

// Mock implementation so ws doesnt have openhandle after test exits as it attempts to connects at start
jest.mock('isomorphic-ws', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/ban-types 
      const eventListeners: { [key: string]: Function[] } = {};

      return {
        addEventListener: jest.fn((event, handler) => {
          if (!eventListeners[event]) {
            eventListeners[event] = [];
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
  public constructor(network: Network, transport: Transport, token: string, host?: string, providerConfigOptions?: HttpProviderOptions | SocketOptions) {
    super(network, transport, token, host ?? "", providerConfigOptions);
  }
  // eslint-disable-next-line class-methods-use-this
  public getRPCURL(_network: Network, _transport: Transport, _token: string, _host = ""): string {
    let transport = "";
    if (_transport === Transport.HTTPS)
      transport = "http://";
    else if (_transport === Transport.WebSocket)
      transport = "wss://";

    return `${transport}127.0.0.1/`;
  }
}

describe('Web3ExternalProvider', () => {
  const network: Network = Network.ETH_MAINNET;
  const transport: Transport = Transport.HTTPS;
  const token = 'test-token';
  const host = 'test-host';

  it('should initialize the provider correctly', () => {

    const provider = new MockWeb3ExternalProviderA(network, transport, token);

    expect(provider.provider).toBeInstanceOf(HttpProvider);
  });

  it('should initialize the provider with WebSocketProvider for WebSocket transport', () => {
    const transport1: Transport = Transport.WebSocket;

    const provider = new MockWeb3ExternalProviderA(network, transport1, token);
    expect(provider.provider).toBeInstanceOf(WebSocketProvider);
  });

  it('should throw ProviderConfigOptionsError for HTTP provider with missing providerOptions', () => {
    const providerConfigOptions: HttpProviderOptions | SocketOptions = { /* missing providerOptions */ };
    expect(() => new MockWeb3ExternalProviderA(network, transport, token, host, providerConfigOptions)).toThrow(ProviderConfigOptionsError);
  });

  it('should throw ProviderConfigOptionsError for HTTP provider with WS providerOptions', () => {
    const providerConfigOptions: SocketOptions = {
      socketOptions: { /* options */ },
      reconnectOptions: { /* options */ },
    };
    expect(() => new MockWeb3ExternalProviderA(network, transport, token, host, providerConfigOptions)).toThrow(ProviderConfigOptionsError);
  });

  it('should throw ProviderConfigOptionsError for WebSocket provider with missing socketOptions and reconnectOptions', () => {
    const providerConfigOptions: HttpProviderOptions | SocketOptions = { /* missing socketOptions and reconnectOptions */ };
    expect(() => new MockWeb3ExternalProviderA(network, Transport.WebSocket, token, host, providerConfigOptions)).toThrow(ProviderConfigOptionsError);
  });

  it('should throw ProviderConfigOptionsError for WebSocket provider with HTTP options', () => {
    const providerConfigOptions: HttpProviderOptions = { providerOptions: { /* options */ } };
    expect(() => new MockWeb3ExternalProviderA(network, Transport.WebSocket, token, host, providerConfigOptions)).toThrow(ProviderConfigOptionsError);
  });

  it('should create provider instance and not throw ProviderConfigOptionsError for WebSocket provider with missing reconnectOptions', () => {
    const providerConfigOptions: SocketOptions = {
      socketOptions: { /* options */ },
    };

    // Create an instance of the MockWeb3ExternalProviderA
    const provider = new MockWeb3ExternalProviderA(network, Transport.WebSocket, token, host, providerConfigOptions);

    // Expect that the provider is created successfully
    expect(provider).toBeInstanceOf(MockWeb3ExternalProviderA);
  });

  it('should create provider instance and not throw ProviderConfigOptionsError for WebSocket provider with missing socketOptions', () => {
    const providerConfigOptions: SocketOptions = {
      reconnectOptions: { /* options */ },
    };

    // Create an instance of the MockWeb3ExternalProviderA
    const provider = new MockWeb3ExternalProviderA(network, Transport.WebSocket, token, host, providerConfigOptions);

    // Expect that the provider is created successfully
    expect(provider).toBeInstanceOf(MockWeb3ExternalProviderA);
  });

  it('should create an HttpProvider with providerOptions', () => {
    const providerConfigOptions: HttpProviderOptions = { providerOptions: { /* options */ } };
    const provider = new MockWeb3ExternalProviderA(network, transport, token, host, providerConfigOptions);
    expect(provider.provider).toBeInstanceOf(HttpProvider);
  });

  it('should create a WebSocketProvider with socketOptions and reconnectOptions', () => {
    const providerConfigOptions: SocketOptions = {
      socketOptions: { /* options */ },
      reconnectOptions: { /* options */ },
    };
    const provider = new MockWeb3ExternalProviderA(network, Transport.WebSocket, token, host, providerConfigOptions);
    expect(provider.provider).toBeInstanceOf(WebSocketProvider);
  });
});

