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
/* eslint deprecation/deprecation: 0 */

import { Web3ConfigOptions, Web3ConfigEvent, Web3Config } from './web3_config';
import { Web3RequestManagerEvent, Web3RequestManager } from './web3_request_manager';
import { Web3SubscriptionManager } from './web3_subscription_manager';
import { Web3Subscription, Web3SubscriptionConstructor } from './web3_subscriptions';
import {
	Web3ContextObject,
	Web3ContextInitOptions,
	Web3ContextConstructor,
	Web3ContextFactory,
	Web3Context,
	TransactionBuilder,
	Web3PluginBase,
	Web3EthPluginBase,
} from './web3_context';
import { DEFAULT_BATCH_REQUEST_TIMEOUT, Web3BatchRequest } from './web3_batch_request';
import {
	isWeb3Provider,
	isLegacyRequestProvider,
	isEIP1193Provider,
	isLegacySendProvider,
	isLegacySendAsyncProvider,
	isSupportedProvider,
	isSupportSubscriptions,
} from './utils';
import { TransactionTypeParser } from './types';
import {
	inputStorageKeysFormatter,
	outputProofFormatter,
	outputBigIntegerFormatter,
	inputBlockNumberFormatter,
	inputDefaultBlockNumberFormatter,
	inputAddressFormatter,
	txInputOptionsFormatter,
	inputCallFormatter,
	inputTransactionFormatter,
	inputSignFormatter,
	outputTransactionFormatter,
	inputTopicFormatter,
	inputLogFormatter,
	outputLogFormatter,
	outputTransactionReceiptFormatter,
	outputBlockFormatter,
	inputPostFormatter,
	outputPostFormatter,
	outputSyncingFormatter,
} from './formatters';
import { PromiseExecutor, Web3PromiEvent } from './web3_promi_event';
import {
	Web3EventMap,
	Web3EventKey,
	Web3EventCallback,
	Web3Emitter,
	Web3EventEmitter,
} from './web3_event_emitter';

export {
	Web3ConfigOptions,
	Web3ConfigEvent,
	Web3Config,
	Web3RequestManagerEvent,
	Web3RequestManager,
	Web3SubscriptionManager,
	Web3Subscription,
	Web3SubscriptionConstructor,
	Web3ContextObject,
	Web3ContextInitOptions,
	Web3ContextConstructor,
	Web3ContextFactory,
	Web3Context,
	TransactionBuilder,
	Web3PluginBase,
	Web3EthPluginBase,
	DEFAULT_BATCH_REQUEST_TIMEOUT,
	Web3BatchRequest,
	isWeb3Provider,
	isLegacyRequestProvider,
	isEIP1193Provider,
	isLegacySendProvider,
	isLegacySendAsyncProvider,
	isSupportedProvider,
	isSupportSubscriptions,
	TransactionTypeParser,
	inputStorageKeysFormatter,
	outputProofFormatter,
	outputBigIntegerFormatter,
	inputBlockNumberFormatter,
	inputDefaultBlockNumberFormatter,
	inputAddressFormatter,
	txInputOptionsFormatter,
	inputCallFormatter,
	inputTransactionFormatter,
	inputSignFormatter,
	outputTransactionFormatter,
	inputTopicFormatter,
	inputLogFormatter,
	outputLogFormatter,
	outputTransactionReceiptFormatter,
	outputBlockFormatter,
	inputPostFormatter,
	outputPostFormatter,
	outputSyncingFormatter,
	PromiseExecutor,
	Web3PromiEvent,
	Web3EventMap,
	Web3EventKey,
	Web3EventCallback,
	Web3Emitter,
	Web3EventEmitter,
};

// For backward usability export as namespace
export * as formatters from './formatters';
