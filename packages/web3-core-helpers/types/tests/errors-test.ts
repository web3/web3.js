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
 * @file errors-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2019
 */

import { errors, WebSocketEvent } from 'web3-core-helpers';

// $ExpectType Error
errors.ErrorResponse(new Error('hey'));

// $ExpectType Error
errors.InvalidNumberOfParams(1, 3, 'method');

// $ExpectType ConnectionError
errors.InvalidConnection('https://localhost:2345432');

// $ExpectType Error
errors.InvalidProvider();

// $ExpectType Error
errors.InvalidResponse(new Error('hey'));

// $ExpectType Error
errors.ConnectionTimeout('timeout');

// $ExpectType Error
errors.ConnectionNotOpenError();

// $ExpectType Error
errors.MaxAttemptsReachedOnReconnectingError();

// $ExpectType Error
errors.PendingRequestsOnReconnectingError();

const event: WebSocketEvent = {code: 100, reason: 'reason'};
// $ExpectType ConnectionError
errors.ConnectionError('msg', event);

// $ExpectType Error | ConnectionError
errors.ConnectionCloseError(event);

// $ExpectType Error | ConnectionError
errors.ConnectionCloseError(true);

// $ExpectType RevertInstructionError
errors.RevertInstructionError('reason', 'signature');

// $ExpectType TransactionRevertInstructionError
errors.TransactionRevertInstructionError('reason', 'signature', {});

// $ExpectType TransactionError
errors.TransactionError('reason', {});

// $ExpectType TransactionError
errors.NoContractAddressFoundError({});

// $ExpectType TransactionError
errors.ContractCodeNotStoredError({});

// $ExpectType TransactionError
errors.TransactionRevertedWithoutReasonError({});

// $ExpectType TransactionError
errors.TransactionOutOfGasError({});

// $ExpectType Error
errors.ResolverMethodMissingError('0x0000000000000000000000000000000000000001', 'content');
