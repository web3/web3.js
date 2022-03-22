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

// Response error
export const ERR_RESPONSE = 100;
export const ERR_INVALID_RESPONSE = 101;

// Generic errors
export const ERR_PARAM = 200;
export const ERR_FORMATTERS = 201;
export const ERR_METHOD_NOT_IMPLEMENTED = 202;
export const ERR_OPERATION_TIMEOUT = 203;
export const ERR_OPERATION_ABORT = 204;
export const ERR_ABI_ENCODING = 205;

// Contract error codes
export const ERR_CONTRACT = 300;
export const ERR_CONTRACT_RESOLVER_MISSING = 301;
export const ERR_CONTRACT_ABI_MISSING = 302;
export const ERR_CONTRACT_REQUIRED_CALLBACK = 303;
export const ERR_CONTRACT_EVENT_NOT_EXISTS = 304;
export const ERR_CONTRACT_RESERVED_EVENT = 305;
export const ERR_CONTRACT_MISSING_DEPLOY_DATA = 306;
export const ERR_CONTRACT_MISSING_ADDRESS = 307;
export const ERR_CONTRACT_MISSING_FROM_ADDRESS = 308;

// Transaction error codes
export const ERR_TX = 400;
export const ERR_TX_REVERT_INSTRUCTION = 401;
export const ERR_TX_REVERT_TRANSACTION = 402;
export const ERR_TX_NO_CONTRACT_ADDRESS = 403;
export const ERR_TX_CONTRACT_NOT_STORED = 404;
export const ERR_TX_REVERT_WITHOUT_REASON = 405;
export const ERR_TX_OUT_OF_GAS = 406;
export const ERR_RAW_TX_UNDEFINED = 407;

export const ERR_TX_INVALID_SENDER = 408;
export const ERR_TX_INVALID_CALL = 409;
export const ERR_TX_MISSING_CUSTOM_CHAIN = 410;
export const ERR_TX_MISSING_CUSTOM_CHAIN_ID = 411;
export const ERR_TX_CHAIN_ID_MISMATCH = 412;
export const ERR_TX_INVALID_CHAIN_INFO = 413;
export const ERR_TX_MISSING_CHAIN_INFO = 414;
export const ERR_TX_MISSING_GAS = 415;
export const ERR_TX_INVALID_LEGACY_GAS = 416;
export const ERR_TX_INVALID_FEE_MARKET_GAS = 417;
export const ERR_TX_INVALID_FEE_MARKET_GAS_PRICE = 418;
export const ERR_TX_INVALID_LEGACY_FEE_MARKET = 419;
export const ERR_TX_INVALID_OBJECT = 420;
export const ERR_TX_INVALID_NONCE_OR_CHAIN_ID = 421;
export const ERR_TX_UNABLE_TO_POPULATE_NONCE = 422;
export const ERR_TX_UNSUPPORTED_EIP_1559 = 423;
export const ERR_TX_UNSUPPORTED_TYPE = 424;
export const ERR_TX_DATA_AND_INPUT = 425;
export const ERR_TX_POLLING_TIMEOUT = 426;
export const ERR_TX_RECEIPT_MISSING_OR_BLOCKHASH_NULL = 427;
export const ERR_TX_RECEIPT_MISSING_BLOCK_NUMBER = 428;

// Connection error codes
export const ERR_CONN = 500;
export const ERR_CONN_INVALID = 501;
export const ERR_CONN_TIMEOUT = 502;
export const ERR_CONN_NOT_OPEN = 503;
export const ERR_CONN_CLOSE = 504;
export const ERR_CONN_MAX_ATTEMPTS = 505;
export const ERR_CONN_PENDING_REQUESTS = 506;

// Provider error codes
export const ERR_PROVIDER = 600;
export const ERR_INVALID_PROVIDER = 601;
export const ERR_INVALID_CLIENT = 602;
export const ERR_SUBSCRIPTION = 603;

// Account error codes
export const ERR_PRIVATE_KEY_LENGTH = 701;
export const ERR_INVALID_PRIVATE_KEY = 702;
export const ERR_UNSUPPORTED_KDF = 703;
export const ERR_KEY_DERIVATION_FAIL = 704;
export const ERR_KEY_VERSION_UNSUPPORTED = 705;
export const ERR_INVALID_PASSWORD = 706;
export const ERR_IV_LENGTH = 707;
export const ERR_INVALID_KEYSTORE = 708;
export const ERR_PBKDF2_ITERATIONS = 709;

// Signature error codes
export const ERR_SIGNATURE_FAILED = 801;
export const ERR_INVALID_SIGNATURE = 802;

export const GENESIS_BLOCK_NUMBER = '0x0';

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#provider-errors
export const JSONRPC_ERR_REJECTED_REQUEST = 4001;
export const JSONRPC_ERR_UNAUTHORIZED = 4001;
export const JSONRPC_ERR_UNSUPPORTED_METHOD = 4200;
export const JSONRPC_ERR_DISCONNECTED = 4900;
export const JSONRPC_ERR_CHAIN_DISCONNECTED = 4901;

export const ERR_ENS_CHECK_INTERFACE_SUPPORT = 901;
export const ERR_ENS_UNSUPPORTED_NETWORK = 902;
export const ERR_ENS_NETWORK_NOT_SYNCED = 903;
