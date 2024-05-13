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
    getRPCURL(_network: Network, _transport: Transport, _token: string): string {
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