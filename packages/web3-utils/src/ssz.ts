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
import {
	ByteVectorType,
	ContainerType,
	ListCompositeType,
	UintBigintType,
	UintNumberType,
} from '@chainsafe/ssz';

import { MAX_WITHDRAWALS_PER_PAYLOAD } from './constants';

export const UintNum64 = new UintNumberType(8);
export const UintBigInt64 = new UintBigintType(8);
export const Bytes20 = new ByteVectorType(20);

export const Withdrawal = new ContainerType(
	{
		index: UintBigInt64,
		validatorIndex: UintBigInt64,
		address: Bytes20,
		amount: UintBigInt64,
	},
	{ typeName: 'Withdrawal', jsonCase: 'eth2' },
);
export const Withdrawals = new ListCompositeType(Withdrawal, MAX_WITHDRAWALS_PER_PAYLOAD);
