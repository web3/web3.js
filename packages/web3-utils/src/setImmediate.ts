/* eslint-disable */

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
/*

Copyright (c) 2023 Web3
Copyright (c) 2012-2016 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola

*/

interface Task {
	callback: Function;
	args: any[];
}

interface TasksByHandle {
	[handle: number]: Task;
}

const tasksByHandle: TasksByHandle = {};
let registerImmediate: (handle: number) => void;
let nextHandle = 1; // Spec says greater than zero

interface SelfGlobalThis {
	setImmediate: (callback: Function, ...args: any[]) => number;
	clearImmediate: (handle: number) => void;
}

const selfGlobalThis: any =
	typeof self === 'undefined' ? (typeof global === 'undefined' ? this : global) : self;

export const setImmediate =
	(selfGlobalThis as SelfGlobalThis)?.setImmediate ||
	function (callback: Function, ...args: any[]): number {
		// Callback can either be a function or a string
		if (typeof callback !== 'function') {
			callback = new Function(`${callback}`);
		}
		// Store and register the task
		const task: Task = { callback, args };
		tasksByHandle[nextHandle] = task;
		registerImmediate(nextHandle);
		return nextHandle++;
	};

export const clearImmediate =
	(selfGlobalThis as SelfGlobalThis)?.clearImmediate ||
	function (handle: number): void {
		if (selfGlobalThis.clearImmediate) {
			return selfGlobalThis.clearImmediate(handle);
		}
		delete tasksByHandle[handle];
	};

(function (global: any) {
	if (global.setImmediate) {
		return;
	}

	let currentlyRunningATask = false;
	const doc: Document = global.document;

	function run(task: Task): void {
		const { callback } = task;
		const { args } = task;
		switch (args.length) {
			case 0:
				callback();
				break;
			case 1:
				callback(args[0]);
				break;
			case 2:
				callback(args[0], args[1]);
				break;
			case 3:
				callback(args[0], args[1], args[2]);
				break;
			default:
				callback.apply(undefined, args);
				break;
		}
	}

	function runIfPresent(handle: number): void {
		// From the spec: "Wait until any invocations of this algorithm started before this one have completed."
		// So if we're currently running a task, we'll need to delay this invocation.
		if (currentlyRunningATask) {
			// Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
			// "too much recursion" error.
			setTimeout(runIfPresent, 0, handle);
		} else {
			const task: Task = tasksByHandle[handle];
			if (task) {
				currentlyRunningATask = true;
				try {
					run(task);
				} finally {
					clearImmediate(handle);
					currentlyRunningATask = false;
				}
			}
		}
	}

	function canUsePostMessage(): boolean | void {
		// The test against `importScripts` prevents this implementation from being installed inside a web worker,
		// where `global.postMessage` means something completely different and can't be used for this purpose.
		if (global.postMessage && !global.importScripts) {
			let postMessageIsAsynchronous = true;
			const oldOnMessage: Function = global.onmessage;
			global.onmessage = function (): void {
				postMessageIsAsynchronous = false;
			};
			global.postMessage('', '*');
			global.onmessage = oldOnMessage;
			return postMessageIsAsynchronous;
		}
	}

	function installPostMessageImplementation(): void {
		// Installs an event handler on `global` for the `message` event: see
		// * https://developer.mozilla.org/en/DOM/window.postMessage
		// * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

		const messagePrefix = `setImmediate$${Math.random()}$`;
		const onGlobalMessage: (event: MessageEvent) => void = function (
			event: MessageEvent,
		): void {
			if (
				event.source === global &&
				typeof event.data === 'string' &&
				event.data.startsWith(messagePrefix)
			) {
				runIfPresent(+event.data.slice(messagePrefix.length));
			}
		};

		if (global.addEventListener) {
			global.addEventListener('message', onGlobalMessage, false);
		} else {
			global.attachEvent('onmessage', onGlobalMessage);
		}

		registerImmediate = function (handle: number): void {
			global.postMessage(messagePrefix + handle, '*');
		};
	}

	function installMessageChannelImplementation(): void {
		const channel: MessageChannel = new MessageChannel();
		channel.port1.onmessage = function (event: MessageEvent): void {
			const handle: number = event.data;
			runIfPresent(handle);
		};

		registerImmediate = function (handle: number): void {
			channel.port2.postMessage(handle);
		};
	}

	function installReadyStateChangeImplementation(): void {
		const html: HTMLElement = doc.documentElement;
		registerImmediate = function (handle: number): void {
			// Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
			// into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
			let script: HTMLScriptElement | null = doc.createElement('script');
			(script as any).onreadystatechange = function (): void {
				runIfPresent(handle);
				(script as any).onreadystatechange = null;
				html.removeChild(script as HTMLScriptElement);
				script = null;
			};
			html.appendChild(script);
		};
	}

	function installSetTimeoutImplementation(): void {
		registerImmediate = function (handle: number): void {
			setTimeout(runIfPresent, 0, handle);
		};
	}

	// If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	let attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	if (canUsePostMessage()) {
		// For non-IE10 modern browsers
		installPostMessageImplementation();
	} else if (global.MessageChannel) {
		// For web workers, where supported
		installMessageChannelImplementation();
	} else if (doc && 'onreadystatechange' in doc.createElement('script')) {
		// For IE 6–8
		installReadyStateChangeImplementation();
	} else {
		// For older browsers
		installSetTimeoutImplementation();
	}
})(selfGlobalThis);
