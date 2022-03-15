import { XMLHttpRequestEventTarget } from './xml-http-request-event-target';
import { ClientRequest } from 'http';

export class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
	private _contentType: string | null = null;
	private _body = null;
	
	constructor() {
		super();
		this._reset();
	}
	
	_reset() {
		this._contentType = null;
		this._body = null;
	}
	
	_setData(data?: string | Buffer | ArrayBuffer | ArrayBufferView) {
		if (data == null) { return; }
		
		if (typeof data === 'string') {
			if (data.length !== 0) {
				this._contentType = 'text/plain;charset=UTF-8';
			}
			this._body = Buffer.from(data, 'utf-8');
		} else if (Buffer.isBuffer(data)) {
			this._body = data;
		} else if (data instanceof ArrayBuffer) {
			const body = Buffer.alloc(data.byteLength);
			const view = new Uint8Array(data);
			for (let i = 0; i < data.byteLength; i++) { body[i] = view[i]; }
			this._body = body;
		} else if (data.buffer && data.buffer instanceof ArrayBuffer) {
			const body = Buffer.alloc(data.byteLength);
			const offset = data.byteOffset;
			const view = new Uint8Array(data.buffer);
			for (let i = 0; i < data.byteLength; i++) { body[i] = view[i + offset]; }
			this._body = body;
		} else {
			throw new Error(`Unsupported send() data ${data}`);
		}
	}
	
	_finalizeHeaders(headers: object, loweredHeaders: object) {
		if (this._contentType && !loweredHeaders['content-type']) {
			headers['Content-Type'] = this._contentType;
		}
		if (this._body) {
			headers['Content-Length'] = this._body.length.toString();
		}
	}
	
	_startUpload(request: ClientRequest) {
		if (this._body) { request.write(this._body); }
		request.end();
	}
}
