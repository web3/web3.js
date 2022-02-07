import { EventEmitter } from 'events';

export class WebSocket extends EventEmitter {
	public readyState: number;

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
