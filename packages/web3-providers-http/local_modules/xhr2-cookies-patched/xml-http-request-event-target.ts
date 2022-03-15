import { ProgressEvent } from './progress-event';

export type ProgressEventListener = (event: ProgressEvent) => void;
export type ProgressEventListenerObject = {handleEvent(event: ProgressEvent): void};
export type ProgressEventListenerOrEventListenerObject = ProgressEventListener | ProgressEventListenerObject;

export class XMLHttpRequestEventTarget {
	onloadstart: ProgressEventListener | null;
	onprogress: ProgressEventListener | null;
	onabort: ProgressEventListener | null;
	onerror: ProgressEventListener | null;
	onload: ProgressEventListener | null;
	ontimeout: ProgressEventListener | null;
	onloadend: ProgressEventListener | null;
	
	private listeners: {[eventType: string]: ProgressEventListener[]} = {};
	
	addEventListener(eventType: string, listener?: ProgressEventListenerOrEventListenerObject) {
		eventType = eventType.toLowerCase();
		this.listeners[eventType] = this.listeners[eventType] || [];
		this.listeners[eventType].push((listener as ProgressEventListenerObject).handleEvent || (listener as ProgressEventListener));
	}
	removeEventListener(eventType: string, listener?: ProgressEventListenerOrEventListenerObject) {
		eventType = eventType.toLowerCase();
		if (!this.listeners[eventType]) { return; }
		
		const index = this.listeners[eventType].indexOf((listener as ProgressEventListenerObject).handleEvent || (listener as ProgressEventListener));
		if (index < 0) { return; }
		
		this.listeners[eventType].splice(index, 1);
	}
	dispatchEvent(event: ProgressEvent) {
		const eventType = event.type.toLowerCase();
		event.target = this; // TODO: set event.currentTarget?
		
		if (this.listeners[eventType]) {
			for (let listener of this.listeners[eventType]) {
				listener.call(this, event);
			}
		}
		
		const listener = this[`on${eventType}`];
		if (listener) {
			listener.call(this, event);
		}
		
		return true;
	}
}
