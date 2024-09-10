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
import { RequestManagerMiddleware } from 'web3-core';
import {
	Web3APIMethod,
	Web3APIReturnType,
	JsonRpcResponse,
	JsonRpcPayload,
	JsonRpcRequest,
} from 'web3-types';
import { jsonRpc } from 'web3-utils';

export class Web3Middleware<API> implements RequestManagerMiddleware<API> {
	// eslint-disable-next-line class-methods-use-this
	public async processRequest<ParamType = unknown[]>(
		request: JsonRpcPayload<ParamType>,
	): Promise<JsonRpcPayload<ParamType>> {
		// add your custom logic here for processing requests
		let reqObj = { ...request } as JsonRpcPayload;
		if (Array.isArray(reqObj)) {
			reqObj = reqObj.map((req: JsonRpcRequest) => {
				if (req.method === 'eth_call' && Array.isArray(req.params)) {
					return {
						...req,
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						params: [...req.params, '0x0', '0x1'],
					};
				}
				return req;
			});
		} else if (reqObj.method === 'eth_call' && Array.isArray(reqObj.params)) {
			reqObj = {
				...reqObj,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				params: [...(reqObj.params ?? []), '0x0', '0x1'],
			};
		}

		return Promise.resolve(reqObj as JsonRpcPayload<ParamType>);
	}

	// eslint-disable-next-line class-methods-use-this
	public async processResponse<
		Method extends Web3APIMethod<API>,
		ResponseType = Web3APIReturnType<API, Method>,
	>(response: JsonRpcResponse<ResponseType>): Promise<JsonRpcResponse<ResponseType>> {
		// add your custom logic here for processing responses, following is just a demo
		let resObj = { ...response };
		if (!jsonRpc.isBatchResponse(resObj) && resObj.id === 1) {
			resObj = {
				...resObj,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				result: '0x6a756e616964' as any,
			};
		}

		return Promise.resolve(resObj);
	}
}
