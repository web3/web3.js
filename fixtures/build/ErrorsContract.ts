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
export const ErrorsContractAbi = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
		inputs: [{ internalType: 'string', name: '', type: 'string' }],
		name: 'CustomError',
		type: 'error',
	},
	{ inputs: [], name: 'Unauthorized', type: 'error' },
	{
		inputs: [],
		name: 'badRequire',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'unauthorize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const;
export const ErrorsContractBytecode =
	'0x608060405260008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561005157600080fd5b5061029e806100616000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063593b0df41461003b5780638ec6371414610045575b600080fd5b61004361004f565b005b61004d6100fd565b005b600260011015610094576040517f8d6ea8be00000000000000000000000000000000000000000000000000000000815260040161008b90610248565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f193505050501580156100fa573d6000803e3d6000fd5b50565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610182576040517f82b4290000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f193505050501580156101e8573d6000803e3d6000fd5b50565b600082825260208201905092915050565b7f7265766572746564207573696e6720637573746f6d204572726f720000000000600082015250565b6000610232601b836101eb565b915061023d826101fc565b602082019050919050565b6000602082019050818103600083015261026181610225565b905091905056fea264697066735822122044b9ec500058314fc2322d787ecf6c99c1470d0ace05668c811cfe70fdd05c2764736f6c63430008100033';
