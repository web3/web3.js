import { RequestManagerMiddleware } from "web3-core";
import { Web3APIMethod, Web3APIRequest, Web3APIReturnType, JsonRpcResponse } from "web3-types";
import { jsonRpc } from "web3-utils";

export class Web3Middleware<API> implements RequestManagerMiddleware<API> {

  // eslint-disable-next-line class-methods-use-this
  processRequest<Method extends Web3APIMethod<API>>(
    request: Web3APIRequest<API, Method>
  ): Promise<Web3APIRequest<API, Method>> {
    
    // add your custom logic here for processing requests
    if (request.method === 'eth_call' && Array.isArray(request.params)) {
      request = {
        ...request,
        params: [...request.params, '0x0', '0x1'],
      };
    }

    return Promise.resolve(request);
  }

  // eslint-disable-next-line class-methods-use-this
  processResponse<
    Method extends Web3APIMethod<API>,
    ResponseType = Web3APIReturnType<API, Method>
  >(
    response: JsonRpcResponse<ResponseType>
  ): Promise<JsonRpcResponse<ResponseType>> {

    // add your custom logic here for processing responses
    if (!jsonRpc.isBatchResponse(response) && response.id === 1) {
      response = {
        ...response,
        result: '0x6a756e616964' as any,
      };
    }

    return Promise.resolve(response);
  }
}