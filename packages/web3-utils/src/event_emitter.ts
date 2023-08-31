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

import { EventEmitter as NodeEventEmitter } from 'events';

type Callback = (params: any) => void | Promise<void>;

export class InBrowserEventEmitter extends EventTarget {
	private _listeners: Record<string, Callback[]> = {};
	private maxListeners = Number.MAX_SAFE_INTEGER;

	public on(eventName: string, fn: Callback) {
		super.addEventListener(eventName, fn as EventListener);
		this._addToListeners(eventName, fn);
		return this;
	}

	public once(eventName: string, fn: Callback) {
		const onceCallback = async (params: unknown) => {
			await fn(params);
			this.off(eventName, onceCallback);
		};
		return this.on(eventName, onceCallback);
	}

	public off(eventName: string, fn: Callback) {
		super.removeEventListener(eventName, fn as EventListener);
		this._removeFromListeners(eventName, fn);
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
		return this._listeners[eventName] || [];
	}

	public eventNames(): string[] {
		return Object.keys(this._listeners);
	}

	public removeAllListeners() {
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

	private _addToListeners(eventName: string, fn: Callback) {
		if (!this._listeners[eventName]) {
			this._listeners[eventName] = [];
		}
		this._listeners[eventName].push(fn);
	}

	private _removeFromListeners(eventName: string, fn: Callback) {
		const eventListeners = this._listeners[eventName];
		if (eventListeners) {
			const index = eventListeners.indexOf(fn);
			if (index !== -1) {
				eventListeners.splice(index, 1);
			}
		}
	}
}

// eslint-disable-next-line import/no-mutable-exports
export let EventEmitter: typeof NodeEventEmitter;
// Check if the code is running in a Node.js environment
if (typeof window === 'undefined') {
	EventEmitter = NodeEventEmitter;
} else {
	// Fallback for the browser environment
	EventEmitter = InBrowserEventEmitter as unknown as typeof NodeEventEmitter;
}
