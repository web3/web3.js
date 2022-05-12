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
export const deployRevertByteCode =
	'0x6080604052348015600f57600080fd5b506000604e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040160459060ab565b60405180910390fd5b60c9565b600082825260208201905092915050565b7f43616e206e6f74206465706c6f79207468697320636f6e747261637400000000600082015250565b60006097601c836052565b915060a0826063565b602082019050919050565b6000602082019050818103600083015260c281608c565b9050919050565b603f806100d76000396000f3fe6080604052600080fdfea2646970667358221220a75c70518a046b5c5407b0c8bb08fcd84efda588f0cf9ef644b7d57a7f9459e364736f6c634300080d0033';

export const deployRevertAbi = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
] as const;
