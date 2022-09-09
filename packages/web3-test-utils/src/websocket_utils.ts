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
import { Web3Context } from 'web3-core';
import {
	ProviderConnectionNotCloseableError,
	ProviderConnectionNotWaitableError,
	WaitForOpenConnectionTimeoutError,
} from 'web3-errors';
import { Web3BaseProvider } from 'web3-types';

import { isIpc, isWs } from './is_provider';

export const waitForOpenConnection = async (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	web3Context: Web3Context<any>,
) =>
	new Promise<void>((resolve, reject) => {
		if (!isWs) reject(new ProviderConnectionNotWaitableError());

		const interval = setInterval(() => {
			const maxNumberOfAttempts = 10;

			let currentAttempt = 0;

			if (currentAttempt > maxNumberOfAttempts) {
				clearInterval(interval);
				reject(new WaitForOpenConnectionTimeoutError());
			} else if (
				(web3Context.provider as unknown as Web3BaseProvider).getStatus() === 'connected'
			) {
				clearInterval(interval);
				resolve();
			}
			currentAttempt += 1;
		}, 5000);
	});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const closeOpenConnection = async (web3Context: Web3Context<any>) => {
	if (!isWs && !isIpc) throw new ProviderConnectionNotCloseableError();

	// make sure we try to close the connection after it is established
	if ((web3Context?.provider as unknown as Web3BaseProvider)?.getStatus() === 'connecting') {
		await waitForOpenConnection(web3Context);
	}

	if ((web3Context?.provider as unknown as Web3BaseProvider)?.disconnect) {
		(web3Context.provider as unknown as Web3BaseProvider).disconnect(1000, '');
	}
};
