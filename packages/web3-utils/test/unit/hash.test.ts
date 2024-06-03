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

import { keccak256 } from 'js-sha3';
import {
	sha3,
	sha3Raw,
	soliditySha3,
	soliditySha3Raw,
	encodePacked,
	keccak256 as web3keccak256,
	getStorageSlotNumForLongString,
} from '../../src/hash';
import {
	sha3Data,
	sha3ValidData,
	soliditySha3RawValidData,
	sha3RawValidData,
	soliditySha3ValidData,
	soliditySha3InvalidData,
	compareSha3JSValidData,
	compareSha3JSRawValidData,
	encodePackData,
	encodePackedInvalidData,
	keccak256ValidData,
	soliditySha3BigIntValidData,
	getStorageSlotNumForLongStringValidData,
} from '../fixtures/hash';

describe('hash', () => {
	describe('sha3', () => {
		describe('valid cases', () => {
			it.each(sha3ValidData)('%s', (input, output) => {
				expect(sha3(input)).toEqual(output);
			});
		});

		describe('compare with js-sha3 normal cases', () => {
			it.each(sha3Data)('%s', input => {
				expect(sha3(input)).toBe(`0x${keccak256(input)}`);
			});
		});

		describe('compare with js-sha3 uint8array cases', () => {
			it.each(compareSha3JSValidData)('%s', (input, output) => {
				expect(sha3(input)).toBe(`0x${keccak256(output)}`);
			});
		});
	});

	describe('sha3Raw', () => {
		describe('valid cases', () => {
			it.each(sha3RawValidData)('%s', (input, output) => {
				expect(sha3Raw(input)).toEqual(output);
			});
		});
		describe('comparing with js-sha3 cases', () => {
			it.each(compareSha3JSRawValidData)('%s', (input, output) => {
				expect(sha3Raw(input)).toBe(`0x${keccak256(output)}`);
			});
		});
	});

	describe('soliditySha3', () => {
		describe('valid cases', () => {
			it.each(soliditySha3ValidData)('%s', (input, output) => {
				expect(soliditySha3(...input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(soliditySha3InvalidData)('%s', (input, output) => {
				expect(() => soliditySha3(input)).toThrow(output);
			});
		});
	});

	describe('soliditySha3Raw', () => {
		describe('valid cases', () => {
			it.each(soliditySha3RawValidData)('%s', (input, output) => {
				expect(soliditySha3Raw(...input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(soliditySha3InvalidData)('%s', (input, output) => {
				expect(() => soliditySha3Raw(input)).toThrow(output);
			});
		});
	});

	describe('encodePacked', () => {
		describe('valid cases', () => {
			it.each(encodePackData)('%s', (input, output) => {
				expect(encodePacked(...input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(encodePackedInvalidData)('%s', (input, output) => {
				expect(() => encodePacked(input)).toThrow(output);
			});
		});
	});
	describe('keccak256', () => {
		describe('valid cases', () => {
			it.each(keccak256ValidData)('%s', (input, output) => {
				expect(web3keccak256(input)).toEqual(output);
			});
		});
	});

	describe('extra types supporting', () => {
		it('object', () => {
			const res = soliditySha3({
				historicBlock: {
					hash: '0xcba0b90a5e65512202091c12a2e3b328f374715b9f1c8f32cb4600c726fe2aa6',
					height: 1,
				},
				networkId: 5777,
			});
			expect(res).toBe('0x00203462b63e3a8ca15da715e490c676b0e370f47823e31383fe43c25da3b78d');
		});
		it('object in string', () => {
			const res = soliditySha3(
				'{"contents":"pragma solidity >=0.4.21 <0.6.0;\\n\\ncontract Migrations {\\n  address public owner;\\n  uint public last_completed_migration;\\n\\n  constructor() public {\\n    owner = msg.sender;\\n  }\\n\\n  modifier restricted() {\\n    if (msg.sender == owner) _;\\n  }\\n\\n  function setCompleted(uint completed) public restricted {\\n    last_completed_migration = completed;\\n  }\\n\\n  function upgrade(address new_address) public restricted {\\n    Migrations upgraded = Migrations(new_address);\\n    upgraded.setCompleted(last_completed_migration);\\n  }\\n}\\n","sourcePath":"/Users/gnidan/src/work/reproduce/2019/01/21/artifacts/contracts/Migrations.sol"}',
			);
			expect(res).toBe('0xdb092e2751b8dcb7c8509baade3c0ac290414a71685823c3cbeb28667970b0bd');
		});
		it('another object in string', () => {
			const res = soliditySha3(
				'{"bytes":"608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610314806100606000396000f3fe608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630900f01014610067578063445df0ac146100b85780638da5cb5b146100e3578063fdacd5761461013a575b600080fd5b34801561007357600080fd5b506100b66004803603602081101561008a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610175565b005b3480156100c457600080fd5b506100cd61025d565b6040518082815260200191505060405180910390f35b3480156100ef57600080fd5b506100f8610263565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561014657600080fd5b506101736004803603602081101561015d57600080fd5b8101908080359060200190929190505050610288565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561025a5760008190508073ffffffffffffffffffffffffffffffffffffffff1663fdacd5766001546040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561024057600080fd5b505af1158015610254573d6000803e3d6000fd5b50505050505b50565b60015481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156102e557806001819055505b5056fea165627a7a7230582013359aba5684f88626fb6a58a003236e309ef1462172af4afb4afb9bd2532b510029","linkReferences":[]}',
			);
			expect(res).toBe('0x46e99868594ceb46b7cd37e4b33d635f12a7751671f8c51dd8218fa0dcf82901');
		});

		describe('BigInt soliditySha3', () => {
			it.each(soliditySha3BigIntValidData)('%s', (input, output) => {
				expect(soliditySha3(...input)).toEqual(output);
			});
		});
	});

	describe('getStorageSlotNumForLongString', () => {
		it.each(getStorageSlotNumForLongStringValidData)('%s', (input, output) => {
			expect(getStorageSlotNumForLongString(input)).toEqual(output);
		});
	});
});
