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
import { RequestManagerMiddleware } from "web3-core";
import { Web3APIMethod, Web3APIRequest, Web3APIReturnType, JsonRpcResponse } from "web3-types";
import { jsonRpc } from "web3-utils";

export class Web3Middleware<API> implements RequestManagerMiddleware<API> {

  // eslint-disable-next-line class-methods-use-this
  async processRequest<Method extends Web3APIMethod<API>>(
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
  async processResponse<
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