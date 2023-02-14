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

import { InvalidBlockError } from 'web3-errors';
import {
	checkAddressCheckSum as checkAddressCheckSumValidator,
	isAddress as isAddressValidator,
	isBloom as isBloomValidator,
	isContractAddressInBloom as isContractAddressInBloomValidator,
	isHex as isHexValidator,
	isHexStrict as isHexStrictValidator,
	isInBloom as isInBloomValidator,
	isTopic as isTopicValidator,
	isTopicInBloom as isTopicInBloomValidator,
	isUserEthereumAddressInBloom as isUserEthereumAddressInBloomValidator,
	isNullish as isNullishValidator,
	isBlockTag,
} from 'web3-validator';
import { BlockNumberOrTag } from 'web3-types';

/**
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isHexStrict = isHexStrictValidator;

/**
 * returns true if input is a hexstring, number or bigint
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isHex = isHexValidator;

/**
 * Checks the checksum of a given address. Will also return false on non-checksum addresses.
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const checkAddressCheckSum = checkAddressCheckSumValidator;

/**
 * Checks if a given string is a valid Ethereum address. It will also check the checksum, if the address has upper and lowercase letters.
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isAddress = isAddressValidator;

/**
 * Returns true if the bloom is a valid bloom
 * https://github.com/joshstevens19/ethereum-bloom-filters/blob/fbeb47b70b46243c3963fe1c2988d7461ef17236/src/index.ts#L7
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isBloom = isBloomValidator;

/**
 * Returns true if the value is part of the given bloom
 * note: false positives are possible.
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isInBloom = isInBloomValidator;

/**
 * Returns true if the ethereum users address is part of the given bloom note: false positives are possible.
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isUserEthereumAddressInBloom = isUserEthereumAddressInBloomValidator;

/**
 * Returns true if the contract address is part of the given bloom.
 * note: false positives are possible.
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isContractAddressInBloom = isContractAddressInBloomValidator;

/**
 * Checks if its a valid topic
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isTopic = isTopicValidator;

/**
 * Returns true if the topic is part of the given bloom.
 * note: false positives are possible.
 *
 * @deprecated Will be removed in next release. Please use `web3-validator` package instead.
 */
export const isTopicInBloom = isTopicInBloomValidator;

/**
 * Compares between block A and block B
 * Returns -1 if a \< b, returns 1 if a \> b and returns 0 if a == b
 */
export const compareBlockNumbers = (blockA: BlockNumberOrTag, blockB: BlockNumberOrTag) => {
	// string validation
	if (blockA === 'genesis' || blockB === 'genesis')
		throw new InvalidBlockError('Genesis tag not supported'); // for more specific error message
	if (typeof blockA === 'string' && !isBlockTag(blockA)) throw new InvalidBlockError(blockA);
	if (typeof blockB === 'string' && !isBlockTag(blockB)) throw new InvalidBlockError(blockB);

	// Increasing order:  earliest, finalized , safe, latest, pending
	// safe vs block-num cant be compared as block number provided can be on left or right side of safe tag, until safe tag block number is extracted and compared

	if (
		blockA === blockB ||
		((blockA === 'earliest' || blockA === 0) && (blockB === 'earliest' || blockB === 0))
	) {
		return 0;
	}
	if (blockA === 'earliest' || blockA === 0) {
		// b !== a, thus a < b
		return -1;
	}
	if (blockB === 'earliest' || blockB === 0) {
		// b !== a, thus a > b
		return 1;
	}
	if (blockA === 'latest' || blockA === 'safe') {
		if (blockB === 'pending' || blockB === 'latest') {
			return -1;
		}
		// b !== ("pending" OR "latest"), thus a > b
		return 1;
	}
	if (blockB === 'latest' || blockB === 'safe') {
		if (blockA === 'pending' || blockA === 'latest') {
			return 1;
		}
		// b !== ("pending" OR "latest"), thus a > b
		return -1;
	}
	if (blockA === 'pending') {
		// b (== OR <) "latest", thus a > b
		return 1;
	}
	if (blockB === 'pending') {
		return -1;
	}

	if (blockA === 'finalized' || blockB === 'finalized') {
		// either a or b is "finalized" and the other one did not fall into any of the conditions above, so the other one is a number
		throw new InvalidBlockError(
			`Cannot compare finalized tag with ${blockA === 'finalized' ? blockB : blockA}`,
		);
	}

	const bigIntA = BigInt(blockA);
	const bigIntB = BigInt(blockB);

	if (bigIntA < bigIntB) {
		return -1;
	}
	if (bigIntA === bigIntB) {
		return 0;
	}
	return 1;
};

export const isNullish = isNullishValidator;
