import Common from '../common';
import { bufferToHex, setLengthLeft, toBuffer } from 'ethereumjs-util';
import { AccessList, AccessListBuffer, AccessListItem, isAccessList } from './types';

export function checkMaxInitCodeSize(common: Common, length: number) {
	if (length > common.param('vm', 'maxInitCodeSize')) {
		throw new Error(
			`the initcode size of this transaction is too large: it is ${length} while the max is ${common.param(
				'vm',
				'maxInitCodeSize',
			)}`,
		);
	}
}

export class AccessLists {
	public static getAccessListData(accessList: AccessListBuffer | AccessList) {
		let AccessListJSON;
		let bufferAccessList;
		if (accessList && isAccessList(accessList)) {
			AccessListJSON = accessList;
			const newAccessList: AccessListBuffer = [];

			for (let i = 0; i < accessList.length; i++) {
				const item: AccessListItem = accessList[i];
				const addressBuffer = toBuffer(item.address);
				const storageItems: Buffer[] = [];
				for (let index = 0; index < item.storageKeys.length; index++) {
					storageItems.push(toBuffer(item.storageKeys[index]));
				}
				newAccessList.push([addressBuffer, storageItems]);
			}
			bufferAccessList = newAccessList;
		} else {
			bufferAccessList = accessList ?? [];
			// build the JSON
			const json: AccessList = [];
			for (let i = 0; i < bufferAccessList.length; i++) {
				const data = bufferAccessList[i];
				const address = bufferToHex(data[0]);
				const storageKeys: string[] = [];
				for (let item = 0; item < data[1].length; item++) {
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
	}

	public static verifyAccessList(accessList: AccessListBuffer) {
		for (let key = 0; key < accessList.length; key++) {
			const accessListItem = accessList[key];
			const address = <Buffer>accessListItem[0];
			const storageSlots = <Buffer[]>accessListItem[1];
			if ((<any>accessListItem)[2] !== undefined) {
				throw new Error(
					'Access list item cannot have 3 elements. It can only have an address, and an array of storage slots.',
				);
			}
			if (address.length != 20) {
				throw new Error('Invalid EIP-2930 transaction: address length should be 20 bytes');
			}
			for (let storageSlot = 0; storageSlot < storageSlots.length; storageSlot++) {
				if (storageSlots[storageSlot].length != 32) {
					throw new Error(
						'Invalid EIP-2930 transaction: storage slot length should be 32 bytes',
					);
				}
			}
		}
	}

	public static getAccessListJSON(accessList: AccessListBuffer) {
		const accessListJSON = [];
		for (let index = 0; index < accessList.length; index++) {
			const item: any = accessList[index];
			const JSONItem: any = {
				address: '0x' + setLengthLeft(<Buffer>item[0], 20).toString('hex'),
				storageKeys: [],
			};
			const storageSlots: Buffer[] = item[1];
			for (let slot = 0; slot < storageSlots.length; slot++) {
				const storageSlot = storageSlots[slot];
				JSONItem.storageKeys.push('0x' + setLengthLeft(storageSlot, 32).toString('hex'));
			}
			accessListJSON.push(JSONItem);
		}
		return accessListJSON;
	}

	public static getDataFeeEIP2930(accessList: AccessListBuffer, common: Common): number {
		const accessListStorageKeyCost = common.param('gasPrices', 'accessListStorageKeyCost');
		const accessListAddressCost = common.param('gasPrices', 'accessListAddressCost');

		let slots = 0;
		for (let index = 0; index < accessList.length; index++) {
			const item = accessList[index];
			const storageSlots = item[1];
			slots += storageSlots.length;
		}

		const addresses = accessList.length;
		return addresses * accessListAddressCost + slots * accessListStorageKeyCost;
	}
}
