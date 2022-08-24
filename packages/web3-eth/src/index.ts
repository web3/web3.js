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

/**
 * The `web3-eth` package allows you to interact with an Ethereum blockchain and Ethereum smart contracts.
 *
 * To use this package standalone and use its methods use:
 * ```ts
 * import { Web3Context } from 'web3-core';
 * import { BlockTags } from 'web3-types';
 * import { DEFAULT_RETURN_FORMAT } from 'web3-utils';
 * import { getBalance} from 'web3-eth';
 *
 * getBalance(
 *      new Web3Context('http://127.0.0.1:8545'),
 *      '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
 *      BlockTags.LATEST,
 *      DEFAULT_RETURN_FORMAT
 * ).then(console.log);
 * > 1000000000000n
 * ```
 *
 * To use this package within the `web3` object use:
 * ```ts
 * import { Web3 } from 'web3';
 *
 * const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
 * web3.eth.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1').then(console.log);
 * > 1000000000000n
 */
/**
 *
 */

import { Web3Eth } from './web3_eth';

export * from './web3_eth';
export * from './schemas';
export * from './types';
export * from './validation';
export * from './rpc_method_wrappers';
export * from './utils/format_transaction';
export * from './utils/prepare_transaction_for_signing';
export * from './web3_subscriptions';
export { detectTransactionType } from './utils/detect_transaction_type';
export { transactionBuilder } from './utils/transaction_builder';

export default Web3Eth;
