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
/* eslint-disable max-classes-per-file */

import { EventEmitter as EventEmitterAtNode } from 'events';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (params: any) => void | Promise<void>;

type EventTargetCallback = (params: CustomEvent) => void;

const wrapFunction =
	(fn: Callback): EventTargetCallback =>
	(params: CustomEvent) =>
		fn(params.detail);

/**
 * This class copy the behavior of Node.js EventEmitter class.
 * It is used to provide the same interface for the browser environment.
 */
class EventEmitterAtBrowser extends EventTarget {
	private _listeners: Record<string, [key: Callback, value: EventTargetCallback][]> = {};
	private maxListeners = Number.MAX_SAFE_INTEGER;

	public on(eventName: string, fn: Callback) {
		this.addEventListener(eventName, fn);
		return this;
	}

	public once(eventName: string, fn: Callback) {
		const onceCallback = async (params: Callback) => {
			this.off(eventName, onceCallback);
			await fn(params);
		};
		return this.on(eventName, onceCallback);
	}

	public off(eventName: string, fn: Callback) {
		this.removeEventListener(eventName, fn);
		return this;
	}

	public emit(eventName: string, params: unknown) {
		const event = new CustomEvent(eventName, { detail: params });
		return super.dispatchEvent(event);
	}

	public listenerCount(eventName: string): number {
		const eventListeners = this._listeners[eventName];
		return eventListeners ? eventListeners.length : 0;
	}

	public listeners(eventName: string): Callback[] {
		return this._listeners[eventName].map(value => value[0]) || [];
	}

	public eventNames(): string[] {
		return Object.keys(this._listeners);
	}

	public removeAllListeners() {
		Object.keys(this._listeners).forEach(event => {
			this._listeners[event].forEach(
				(listener: [key: Callback, value: EventTargetCallback]) => {
					super.removeEventListener(event, listener[1] as EventListener);
				},
			);
		});

		this._listeners = {};
		return this;
	}

	public setMaxListeners(maxListeners: number) {
		this.maxListeners = maxListeners;
		return this;
	}

	public getMaxListeners(): number {
		return this.maxListeners;
	}

	public addEventListener(eventName: string, fn: Callback) {
		const wrappedFn = wrapFunction(fn);
		super.addEventListener(eventName, wrappedFn as EventListener);
		if (!this._listeners[eventName]) {
			this._listeners[eventName] = [];
		}
		this._listeners[eventName].push([fn, wrappedFn]);
	}

	public removeEventListener(eventName: string, fn: Callback) {
		const eventListeners = this._listeners[eventName];
		if (eventListeners) {
			const index = eventListeners.findIndex(item => item[0] === fn);
			if (index !== -1) {
				super.removeEventListener(eventName, eventListeners[index][1] as EventListener);
				eventListeners.splice(index, 1);
			}
		}
	}
}

// eslint-disable-next-line import/no-mutable-exports
let EventEmitterType: typeof EventEmitterAtNode;
// Check if the code is running in a Node.js environment
if (typeof window === 'undefined') {
	EventEmitterType = EventEmitterAtNode;
} else {
	// Fallback for the browser environment
	EventEmitterType = EventEmitterAtBrowser as unknown as typeof EventEmitterAtNode;
}

export class EventEmitter extends EventEmitterType {}