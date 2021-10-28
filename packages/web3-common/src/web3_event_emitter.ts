import { EventEmitter } from 'events';

export type Web3EventMap = Record<string, unknown>;
export type Web3EventKey<T extends Web3EventMap> = string & keyof T;
export type Web3EventCallback<T> = (params: T) => void | Promise<void>;
export interface Web3Emitter<T extends Web3EventMap> {
	on<K extends Web3EventKey<T>>(eventName: K, fn: Web3EventCallback<T[K]>): void;
	once<K extends Web3EventKey<T>>(eventName: K, fn: Web3EventCallback<T[K]>): void;
	off<K extends Web3EventKey<T>>(eventName: K, fn: Web3EventCallback<T[K]>): void;
	emit<K extends Web3EventKey<T>>(eventName: K, params: T[K]): void;
}

export class Web3EventEmitter<T extends Web3EventMap> implements Web3Emitter<T> {
	private readonly _emitter = new EventEmitter();

	public on<K extends Web3EventKey<T>>(eventName: K, fn: Web3EventCallback<T[K]>) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this._emitter.on(eventName, fn);
	}

	public once<K extends Web3EventKey<T>>(eventName: K, fn: Web3EventCallback<T[K]>) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this._emitter.once(eventName, fn);
	}

	public off<K extends Web3EventKey<T>>(eventName: K, fn: Web3EventCallback<T[K]>) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this._emitter.off(eventName, fn);
	}

	public emit<K extends Web3EventKey<T>>(eventName: K, params: T[K]) {
		this._emitter.emit(eventName, params);
	}
}
