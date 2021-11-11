// Response error
export const ERR_RESPONSE = 100;
export const ERR_INVALID_RESPONSE = 101;

// Generic errors
export const ERR_PARAM = 200;
export const ERR_FORMATTERS = 201;
export const ERR_METHOD_NOT_IMPLEMENTED = 202;
export const ERR_OPERATION_TIMEOUT = 203;
export const ERR_OPERATION_ABORT = 204;

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

export const GENESIS_BLOCK_NUMBER = '0x0';
