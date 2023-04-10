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
import { HexString } from 'web3-types';
import { bufferToHex, setLengthLeft, toBuffer } from '../common/utils';
import type { AccessList, AccessListBuffer, AccessListItem } from './types';
import { isAccessList } from './types';

import type { Common } from '../common/common';

export const checkMaxInitCodeSize = (common: Common, length: number) => {
	const maxInitCodeSize = common.param('vm', 'maxInitCodeSize');
	if (maxInitCodeSize && BigInt(length) > maxInitCodeSize) {
		throw new Error(
			`the initcode size of this transaction is too large: it is ${length} while the max is ${common.param(
				'vm',
				'maxInitCodeSize',
			)}`,
		);
	}
};

export const getAccessListData = (accessList: AccessListBuffer | AccessList) => {
	let AccessListJSON;
	let bufferAccessList;
	if (isAccessList(accessList)) {
		AccessListJSON = accessList;
		const newAccessList: AccessListBuffer = [];
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < accessList.length; i += 1) {
			const item: AccessListItem = accessList[i];
			const addressBuffer = toBuffer(item.address);
			const storageItems: Buffer[] = [];
			// eslint-disable-next-line @typescript-eslint/prefer-for-of
			for (let index = 0; index < item.storageKeys.length; index += 1) {
				storageItems.push(toBuffer(item.storageKeys[index]));
			}
			newAccessList.push([addressBuffer, storageItems]);
		}
		bufferAccessList = newAccessList;
	} else {
		bufferAccessList = accessList ?? [];
		// build the JSON
		const json: AccessList = [];
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < bufferAccessList.length; i += 1) {
			const data = bufferAccessList[i];
			const address = bufferToHex(data[0]);
			const storageKeys: string[] = [];
			// eslint-disable-next-line @typescript-eslint/prefer-for-of
			for (let item = 0; item < data[1].length; item += 1) {
				storageKeys.push(bufferToHex(data[1][item]));
			}
			const jsonItem: AccessListItem = {
				address,
				storageKeys,
			};
			json.push(jsonItem);
		}
		AccessListJSON = json;
	}

	return {
		AccessListJSON,
		accessList: bufferAccessList,
	};
};

export const verifyAccessList = (accessList: AccessListBuffer) => {
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let key = 0; key < accessList.length; key += 1) {
		const accessListItem = accessList[key];
		const address = accessListItem[0];
		const storageSlots = accessListItem[1];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions
		if ((<any>accessListItem)[2] !== undefined) {
			throw new Error(
				'Access list item cannot have 3 elements. It can only have an address, and an array of storage slots.',
			);
		}
		if (address.length !== 20) {
			throw new Error('Invalid EIP-2930 transaction: address length should be 20 bytes');
		}
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let storageSlot = 0; storageSlot < storageSlots.length; storageSlot += 1) {
			if (storageSlots[storageSlot].length !== 32) {
				throw new Error(
					'Invalid EIP-2930 transaction: storage slot length should be 32 bytes',
				);
			}
		}
	}
};

export const getAccessListJSON = (
	accessList: AccessListBuffer,
): {
	address: HexString;
	storageKeys: HexString[];
}[] => {
	const accessListJSON: { address: HexString; storageKeys: HexString[] }[] = [];
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let index = 0; index < accessList.length; index += 1) {
		const item: any = accessList[index];
		const JSONItem: { address: HexString; storageKeys: HexString[] } = {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions
			address: `0x${setLengthLeft(<Buffer>item[0], 20).toString('hex')}`,
			storageKeys: [],
		};
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/prefer-optional-chain
		const storageSlots: Buffer[] = item && item[1];
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let slot = 0; slot < storageSlots.length; slot += 1) {
			const storageSlot = storageSlots[slot];
			JSONItem.storageKeys.push(`0x${setLengthLeft(storageSlot, 32).toString('hex')}`);
		}
		accessListJSON.push(JSONItem);
	}
	return accessListJSON;
};

export const getDataFeeEIP2930 = (accessList: AccessListBuffer, common: Common): number => {
	const accessListStorageKeyCost = common.param('gasPrices', 'accessListStorageKeyCost');
	const accessListAddressCost = common.param('gasPrices', 'accessListAddressCost');

	let slots = 0;
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let index = 0; index < accessList.length; index += 1) {
		const item = accessList[index];
		const storageSlots = item[1];
		slots += storageSlots.length;
	}

	const addresses = accessList.length;
	return addresses * Number(accessListAddressCost) + slots * Number(accessListStorageKeyCost);
};
