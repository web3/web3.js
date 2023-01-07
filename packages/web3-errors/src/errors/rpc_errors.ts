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

import { JsonRpcResponseWithError, JsonRpcId, JsonRpcError } from 'web3-types';
import { Web3Error } from '../web3_error_base';
import { ERR_RPC_INTERNAL_ERROR, ERR_RPC_INVALID_INPUT, ERR_RPC_INVALID_JSON, ERR_RPC_INVALID_METHOD, ERR_RPC_INVALID_PARAMS, ERR_RPC_INVALID_REQUEST, ERR_RPC_LIMIT_EXCEEDED, ERR_RPC_MISSING_RESOURCE, ERR_RPC_NOT_SUPPORTED, ERR_RPC_TRANSACTION_REJECTED, ERR_RPC_UNAVAILABLE_RESOURCE, ERR_RPC_UNSUPPORTED_METHOD} from '../error_codes';
export const rpcErrorCodes = {
    ERR_RPC_INTERNAL_ERROR,
    ERR_RPC_INVALID_INPUT,
    ERR_RPC_INVALID_JSON,
    ERR_RPC_INVALID_METHOD,
    ERR_RPC_INVALID_PARAMS,
    ERR_RPC_INVALID_REQUEST,
    ERR_RPC_LIMIT_EXCEEDED,
    ERR_RPC_MISSING_RESOURCE,
    ERR_RPC_NOT_SUPPORTED,
    ERR_RPC_TRANSACTION_REJECTED,
    ERR_RPC_UNAVAILABLE_RESOURCE,
    ERR_RPC_UNSUPPORTED_METHOD
};



// make this a base
export class RpcError extends Web3Error {
    public code: number;
    public id: JsonRpcId;
    public jsonrpc: string;
    public jsonRpcError: JsonRpcError;
	public constructor(rpcError: JsonRpcResponseWithError, message?: string) {
		super(message ? message : "rpc error");
        this.code = rpcError.error.code;
        this.id = rpcError.id;
        this.jsonrpc = rpcError.jsonrpc;
        this.jsonRpcError = rpcError.error
	}

    public toJSON() {
		return { ...super.toJSON(), error: this.jsonRpcError, id: this.id, jsonRpc: this.jsonrpc };
	}
}

export class ParseError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Parse error");
	}
}

export class InvalidRequestError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Invalid request");
	}
}

export class MethodNotFoundError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Method not found");
	}
}

export class InvalidParamsError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Invalid request");
	}
}

export class InternalError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Internal error");
	}
}

export class InvalidInputError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Invalid input");
	}
}

export class MethodNotSupported extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Method not supported");
	}
}

export class ResourceUnavailableError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Resource unavailable");
	}
}

export class ResourcesNotFoundError extends RpcError {

	public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Resource not found");
	}
}

export class VersionNotSupportedError extends RpcError {
    public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "JSON-RPC version not supported");
	}
}

export class TransactionRejectedError extends RpcError {
    public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Transaction rejected");
	}
}

export class LimitExceededError extends RpcError {
    public constructor(rpcError: JsonRpcResponseWithError) {
		super(rpcError, "Limit exceeded");
	}
}

export const rpcErrorValues: {[k: string]: {message: string}} = {
    '-32700': {
        message: "Parse error"
    },
    '-32600': {
        message: "Invalid request"
    },
    '-32601': {
        message: "Method not found"
    },
    '-32602': {
        message: "Invalid params"
    },
    '-32603': {
        message: "Internal Error"
    },
    '-32000': {
        message: "Invalid input"
    },
    '-32001': {
        message: "Resource not found"
    },
    '-32002': {
        message: "Resource unavailable"
    },
    '-32003': {
        message: "Transaction rejected"
    },
    '-32004': {
        message: "Method not supported"
    },
    '-32005': {
        message: "Limit exceeded"
    },
    '-32006': {
        message: "JSON-RPC version not supported"
    }
    
}