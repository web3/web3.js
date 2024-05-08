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

import {
	EthExecutionAPI,
	JsonRpcPayload,
	JsonRpcRequest,
	JsonRpcResponse,
	Web3APIMethod,
	Web3APIReturnType,
} from 'web3-types';
import { jsonRpc } from 'web3-utils';
import { RequestManagerMiddleware } from '../../src/types';
import { Web3RequestManager } from '../../src/web3_request_manager';

class Web3Middleware<API> implements RequestManagerMiddleware<API> {
	// eslint-disable-next-line class-methods-use-this
	public async processRequest<ParamType = unknown[]>(
		request: JsonRpcPayload<ParamType>,
	): Promise<JsonRpcPayload<ParamType>> {
		// Implement the processRequest logic here

		let requestObj = { ...request };
		if (
			(requestObj as JsonRpcRequest<ParamType>).method === 'eth_call' &&
			Array.isArray((requestObj as JsonRpcRequest<ParamType>).params)
		) {
			(requestObj as JsonRpcRequest) = {
				...(requestObj as JsonRpcRequest),
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				params: [...((requestObj as JsonRpcRequest).params ?? []), '0x0', '0x1'],
			};
		}

		return Promise.resolve(requestObj as JsonRpcPayload<ParamType>);
	}

	// eslint-disable-next-line class-methods-use-this
	public async processResponse<
		Method extends Web3APIMethod<API>,
		ResponseType = Web3APIReturnType<API, Method>,
	>(response: JsonRpcResponse<ResponseType>): Promise<JsonRpcResponse<ResponseType>> {
		let responseObj = { ...response };
		if (!jsonRpc.isBatchResponse(responseObj) && responseObj.id === 1) {
			responseObj = {
				...responseObj,
				result: '0x6a756e616964' as any,
			};
		}

		return Promise.resolve(responseObj);
	}
}

describe('Request Manager Middleware', () => {
	let requestManagerMiddleware: RequestManagerMiddleware<EthExecutionAPI>;

	beforeAll(() => {
		requestManagerMiddleware = {
			processRequest: jest.fn(
				async <ParamType = unknown[]>(request: JsonRpcPayload<ParamType>) => request,
			),
			processResponse: jest.fn(
				async <
					Method extends Web3APIMethod<EthExecutionAPI>,
					ResponseType = Web3APIReturnType<EthExecutionAPI, Method>,
				>(
					response: JsonRpcResponse<ResponseType>,
				) => response,
			),
		};
	});

	it('should set requestManagerMiddleware via constructor', () => {
		const web3RequestManager1: Web3RequestManager = new Web3RequestManager<EthExecutionAPI>(
			undefined,
			true,
			requestManagerMiddleware,
		);

		expect(web3RequestManager1.middleware).toBeDefined();
		expect(web3RequestManager1.middleware).toEqual(requestManagerMiddleware);
	});

	it('should set requestManagerMiddleware via set method', () => {
		const middleware2: RequestManagerMiddleware<EthExecutionAPI> =
			new Web3Middleware<EthExecutionAPI>();
		const web3RequestManager2: Web3RequestManager = new Web3RequestManager<EthExecutionAPI>(
			'http://localhost:8181',
		);
		web3RequestManager2.setMiddleware(middleware2);

		expect(web3RequestManager2.middleware).toBeDefined();
		expect(web3RequestManager2.middleware).toEqual(middleware2);
	});

	it('should call processRequest and processResponse functions of requestManagerMiddleware', async () => {
		const web3RequestManager3 = new Web3RequestManager<EthExecutionAPI>(
			'http://localhost:8080',
			true,
			requestManagerMiddleware,
		);

		const expectedResponse: JsonRpcResponse<string> = {
			jsonrpc: '2.0',
			id: 1,
			result: '0x0',
		};

		jest.spyOn(web3RequestManager3.provider as any, 'request').mockResolvedValue(
			expectedResponse,
		);

		const request = {
			id: 1,
			method: 'eth_call',
			params: [],
		};

		await web3RequestManager3.send(request);

		expect(requestManagerMiddleware.processRequest).toHaveBeenCalledWith({
			jsonrpc: '2.0',
			...request,
		});
		expect(requestManagerMiddleware.processResponse).toHaveBeenCalled();
	});

	it('should allow modification of request and response', async () => {
		const middleware3: RequestManagerMiddleware<EthExecutionAPI> =
			new Web3Middleware<EthExecutionAPI>();

		const web3RequestManager3 = new Web3RequestManager<EthExecutionAPI>(
			'http://localhost:8080',
			true,
			middleware3,
		);

		const expectedResponse: JsonRpcResponse<string> = {
			jsonrpc: '2.0',
			id: 1,
			result: '0x0',
		};

		const mockSendRequest = jest.spyOn(web3RequestManager3.provider as any, 'request');
		mockSendRequest.mockResolvedValue(expectedResponse);

		const request = {
			id: 1,
			method: 'eth_call',
			params: ['0x3'],
		};

		const response = await web3RequestManager3.send(request);
		expect(response).toBe('0x6a756e616964');

		expect(mockSendRequest).toHaveBeenCalledWith({
			...request,
			jsonrpc: '2.0',
			params: [...request.params, '0x0', '0x1'],
		});
	});
});
