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

import { EventEmitter } from 'events';

export default class WebSocket extends EventEmitter {
	public readyState: number;

	public CONNECTING = 0;
	public OPEN = 1;

	public constructor(...args: any[]) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		super(...args);

		// Connected state
		this.readyState = 1;
	}

	public send(message: any) {
		const data = JSON.parse(message);

		setTimeout(() => {
			if (data.error) {
				this.emit('message', { data: JSON.stringify({ ...data, error: data.error }) });
			} else {
				this.emit('message', { data: JSON.stringify({ ...data, result: message }) });
			}
		}, 100);
	}

	public addEventListener(event: any, cb: () => void) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		this.prependListener(event, cb);
	}

	public removeEventListener(event: any, cb: () => void) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		this.removeListener(event, cb);
	}
}
