
import { EthExecutionAPI, JsonRpcResponse, Web3APIMethod, Web3APIRequest, Web3APIReturnType } from 'web3-types';
import { RequestManagerMiddleware } from '../../src/types';
import { Web3RequestManager } from '../../src/web3_request_manager';
import { jsonRpc } from 'web3-utils';

class Web3Middleware<API> implements RequestManagerMiddleware<API> {
  processRequest<Method extends Web3APIMethod<API>>(
    request: Web3APIRequest<API, Method>
  ): Promise<Web3APIRequest<API, Method>> {
    // Implement the processRequest logic here

    if (request.method === 'eth_call' && Array.isArray(request.params)) {
      request = {
        ...request,
        params: [...request.params, '0x0', '0x1'],
      };
    }

    return Promise.resolve(request);
  }

  processResponse<
    Method extends Web3APIMethod<API>,
    ResponseType = Web3APIReturnType<API, Method>
  >(
    response: JsonRpcResponse<ResponseType>
  ): Promise<JsonRpcResponse<ResponseType>> {
   
    if (!jsonRpc.isBatchResponse(response) && response.id === 1) {
      response = {
        ...response,
        result: '0x6a756e616964' as any,
      };
    }

    return Promise.resolve(response);
  }
}

describe('Request Manager Middleware', () => {
  let requestManagerMiddleware: RequestManagerMiddleware<EthExecutionAPI>;

  beforeAll(() => { 
    requestManagerMiddleware = {
      processRequest: jest.fn(async <Method extends Web3APIMethod<EthExecutionAPI>>(request: Web3APIRequest<EthExecutionAPI, Method>) => request),
      processResponse: jest.fn(async <Method extends Web3APIMethod<EthExecutionAPI>, ResponseType = Web3APIReturnType<EthExecutionAPI, Method>>(response: JsonRpcResponse<ResponseType>) => response),
    };

  });

  it('should set requestManagerMiddleware via constructor', () => {
    let web3RequestManager1: Web3RequestManager<EthExecutionAPI>;

    web3RequestManager1 = new Web3RequestManager<EthExecutionAPI>(undefined, true, requestManagerMiddleware);

    expect(web3RequestManager1.middleware).toBeDefined();
    expect(web3RequestManager1.middleware).toEqual(requestManagerMiddleware);
  });

  it('should set requestManagerMiddleware via set method', () => {
   
    let web3RequestManager2: Web3RequestManager<EthExecutionAPI>;

    const middleware2: RequestManagerMiddleware<EthExecutionAPI> = new Web3Middleware<EthExecutionAPI>();
    web3RequestManager2 = new Web3RequestManager<EthExecutionAPI>('http://localhost:8181');
    web3RequestManager2.setMiddleware(middleware2);

    expect(web3RequestManager2.middleware).toBeDefined();
    expect(web3RequestManager2.middleware).toEqual(middleware2);
  });

  it('should call processRequest and processResponse functions of requestManagerMiddleware', async () => {

    const web3RequestManager3 = new Web3RequestManager<EthExecutionAPI>('http://localhost:8080', true, requestManagerMiddleware as RequestManagerMiddleware<EthExecutionAPI>);
    
    const expectedResponse: JsonRpcResponse<string> = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x0',
      };

    jest.spyOn(web3RequestManager3 as any, '_sendRequest').mockResolvedValue(expectedResponse);

    const request = {
      id: 1,
      method: 'eth_call',
      params: [],
    };

    await web3RequestManager3.send(request);

    expect(requestManagerMiddleware.processRequest).toHaveBeenCalledWith(request);
    expect(requestManagerMiddleware.processResponse).toHaveBeenCalled();
  });

  it('should allow modification of request and response', async () => {

    const middleware3: RequestManagerMiddleware<EthExecutionAPI> = new Web3Middleware<EthExecutionAPI>();
  
    const web3RequestManager3 = new Web3RequestManager<EthExecutionAPI>('http://localhost:8080', true, middleware3);

    const expectedResponse: JsonRpcResponse<string> = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x0',
      };

    const mockSendRequest = jest.spyOn(web3RequestManager3 as any, '_sendRequest');
    mockSendRequest.mockResolvedValue(expectedResponse);

    const request = {
      id: 1,
      method: 'eth_call',
      params: ['0x3'],
    };

    const response = await web3RequestManager3.send(request);
    expect(response).toEqual('0x6a756e616964');

    expect(mockSendRequest).toHaveBeenCalledWith({
      ...request,
      params: [...request.params, '0x0', '0x1'],
    });

  });
});
