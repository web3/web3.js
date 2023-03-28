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

type AsyncListener<T, R> =
	| ((data: T, callback?: (result?: R) => void) => Promise<R>)
	| ((data: T, callback?: (result?: R) => void) => void);
export interface EventMap {
	[event: string]: AsyncListener<any, any>;
}

async function runInSeries(
	context: any,
	tasks: Array<(data: unknown, callback?: (error?: Error) => void) => void>,
	data: unknown,
): Promise<void> {
	let error: Error | undefined;
	for await (const task of tasks) {
		try {
			if (task.length < 2) {
				// sync
				task.call(context, data);
			} else {
				await new Promise<void>((resolve, reject) => {
					task.call(context, data, err => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});
			}
		} catch (e: unknown) {
			error = e as Error;
		}
	}
	if (error) {
		throw error;
	}
}

export class AsyncEventEmitter<T extends EventMap> extends EventEmitter {
	public emit<E extends keyof T>(event: E & string, ...args: Parameters<T[E]>) {
		let [data, callback] = args;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
		let listeners = (self as any)._events[event] ?? [];

		// Optional data argument
		if (callback === undefined && typeof data === 'function') {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			callback = data;
			data = undefined;
		}

		// Special treatment of internal newListener and removeListener events
		if (event === 'newListener' || event === 'removeListener') {
			data = {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				event: data,
				fn: callback,
			};

			callback = undefined;
		}

		// A single listener is just a function not an array...
		listeners = Array.isArray(listeners) ? listeners : [listeners];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
		runInSeries(self, listeners.slice(), data).then(callback).catch(callback);

		return self.listenerCount(event) > 0;
	}

	public once<E extends keyof T>(event: E & string, listener: T[E]): this {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		let g: (...args: any[]) => void;

		if (typeof listener !== 'function') {
			throw new TypeError('listener must be a function');
		}

		// Hack to support set arity
		if (listener.length >= 2) {
			g = function (e: E, next: any) {
				self.removeListener(event, g as T[E]);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, no-void
				void listener(e, next);
			};
		} else {
			g = function (e: E) {
				self.removeListener(event, g as T[E]);
				// eslint-disable-next-line no-void
				void listener(e, g);
			};
		}

		self.on(event, g as T[E]);

		return self;
	}

	public first<E extends keyof T>(event: E & string, listener: T[E]): this {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
		let listeners = (this as any)._events[event] ?? [];

		// Contract
		if (typeof listener !== 'function') {
			throw new TypeError('listener must be a function');
		}

		// Listeners are not always an array
		if (!Array.isArray(listeners)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-multi-assign
			(this as any)._events[event] = listeners = [listeners];
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		listeners.unshift(listener);

		return this;
	}

	public before<E extends keyof T>(event: E & string, target: T[E], listener: T[E]): this {
		return this.beforeOrAfter(event, target, listener);
	}

	public after<E extends keyof T>(event: E & string, target: T[E], listener: T[E]): this {
		return this.beforeOrAfter(event, target, listener, 'after');
	}

	private beforeOrAfter<E extends keyof T>(
		event: E & string,
		target: T[E],
		listener: T[E],
		beforeOrAfter?: string,
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
		let listeners = (this as any)._events[event] ?? [];
		let i;
		let index;
		const add = beforeOrAfter === 'after' ? 1 : 0;

		// Contract
		if (typeof listener !== 'function') {
			throw new TypeError('listener must be a function');
		}
		if (typeof target !== 'function') {
			throw new TypeError('target must be a function');
		}

		// Listeners are not always an array
		if (!Array.isArray(listeners)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-multi-assign
			(this as any)._events[event] = listeners = [listeners];
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
		index = listeners.length;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, no-cond-assign
		for (i = listeners.length; (i -= 1); ) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (listeners[i] === target) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-plus-operands
				index = i + add;
				break;
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		listeners.splice(index, 0, listener);

		return this;
	}

	public on<E extends keyof T>(event: E & string, listener: T[E]): this {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return super.on(event, listener);
	}

	public addListener<E extends keyof T>(event: E & string, listener: T[E]): this {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return super.addListener(event, listener);
	}

	public prependListener<E extends keyof T>(event: E & string, listener: T[E]): this {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return super.prependListener(event, listener);
	}

	public prependOnceListener<E extends keyof T>(event: E & string, listener: T[E]): this {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return super.prependOnceListener(event, listener);
	}

	public removeAllListeners(event?: keyof T & string): this {
		return super.removeAllListeners(event);
	}

	public removeListener<E extends keyof T>(event: E & string, listener: T[E]): this {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return super.removeListener(event, listener);
	}

	public eventNames(): Array<keyof T & string> {
		return super.eventNames() as keyof T & string[];
	}

	public listeners<E extends keyof T>(event: E & string): Array<T[E]> {
		return super.listeners(event) as T[E][];
	}

	public listenerCount(event: keyof T & string): number {
		return super.listenerCount(event);
	}

	public getMaxListeners(): number {
		return super.getMaxListeners();
	}

	public setMaxListeners(maxListeners: number): this {
		return super.setMaxListeners(maxListeners);
	}
}
