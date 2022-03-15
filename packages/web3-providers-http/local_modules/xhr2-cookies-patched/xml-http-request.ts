import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import { ProgressEvent } from './progress-event';
import { InvalidStateError, NetworkError, SecurityError, SyntaxError } from './errors';
import { ProgressEventListener, XMLHttpRequestEventTarget } from './xml-http-request-event-target';
import { XMLHttpRequestUpload } from './xml-http-request-upload';
import { Url } from 'url';
import { Agent as HttpAgent, ClientRequest, IncomingMessage, RequestOptions as RequestOptionsHttp } from 'http';
import { Agent as HttpsAgent } from 'https';
import * as Cookie from 'cookiejar';

export interface XMLHttpRequestOptions {
	anon?: boolean;
}
export interface XHRUrl extends Url {
	method?: string;
}

export class XMLHttpRequest extends XMLHttpRequestEventTarget {
	static ProgressEvent = ProgressEvent;
	static InvalidStateError = InvalidStateError;
	static NetworkError = NetworkError;
	static SecurityError = SecurityError;
	static SyntaxError = SyntaxError;
	static XMLHttpRequestUpload = XMLHttpRequestUpload;

	static UNSENT = 0;
	static OPENED = 1;
	static HEADERS_RECEIVED = 2;
	static LOADING = 3;
	static DONE = 4;

	static cookieJar = Cookie.CookieJar();

	UNSENT = XMLHttpRequest.UNSENT;
	OPENED = XMLHttpRequest.OPENED;
	HEADERS_RECEIVED = XMLHttpRequest.HEADERS_RECEIVED;
	LOADING = XMLHttpRequest.LOADING;
	DONE = XMLHttpRequest.DONE;

	onreadystatechange: ProgressEventListener | null = null;
	readyState: number = XMLHttpRequest.UNSENT;

	response: string | ArrayBuffer | Buffer | object | null = null;
	responseText = '';
	responseType = '';
	status = 0; // TODO: UNSENT?
	statusText = '';
	timeout = 0;
	upload = new XMLHttpRequestUpload();
	responseUrl = '';
	withCredentials = false;

	nodejsHttpAgent: HttpsAgent;
	nodejsHttpsAgent: HttpsAgent;
	nodejsBaseUrl: string | null;

	private _anonymous: boolean;
	private _method: string | null = null;
	private _url: XHRUrl | null = null;
	private _sync = false;
	private _headers: {[header: string]: string} = {};
	private _loweredHeaders: {[lowercaseHeader: string]: string} = {};
	private _mimeOverride: string | null = null; // TODO: is type right?
	private _request: ClientRequest | null = null;
	private _response: IncomingMessage | null = null;
	private _responseParts: Buffer[] | null = null;
	private _responseHeaders: {[lowercaseHeader: string]: string} | null = null;
	private _aborting = null; // TODO: type?
	private _error = null; // TODO: type?
	private _loadedBytes = 0;
	private _totalBytes = 0;
	private _lengthComputable = false;

	private _restrictedMethods = {CONNECT: true, TRACE: true, TRACK: true};
	private _restrictedHeaders = {
		'accept-charset': true,
		'accept-encoding': true,
		'access-control-request-headers': true,
		'access-control-request-method': true,
		connection: true,
		'content-length': true,
		cookie: true,
		cookie2: true,
		date: true,
		dnt: true,
		expect: true,
		host: true,
		'keep-alive': true,
		origin: true,
		referer: true,
		te: true,
		trailer: true,
		'transfer-encoding': true,
		upgrade: true,
		via: true
	};
	private _privateHeaders = {'set-cookie': true, 'set-cookie2': true};
	private _userAgent = `-`;

	constructor(options: XMLHttpRequestOptions = {}) {
		super();
		this._anonymous = options.anon || false;
	}

	open(method: string, url: string, async = true, user?: string, password?: string) {
		method = method.toUpperCase();
		if (this._restrictedMethods[method]) { throw new XMLHttpRequest.SecurityError(`HTTP method ${method} is not allowed in XHR`)};

		const xhrUrl = this._parseUrl(url, user, password);

		if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED || this.readyState === XMLHttpRequest.LOADING) {
			// TODO(pwnall): terminate abort(), terminate send()
		}

		this._method = method;
		this._url = xhrUrl;
		this._sync = !async;
		this._headers = {};
		this._loweredHeaders = {};
		this._mimeOverride = null;
		this._setReadyState(XMLHttpRequest.OPENED);
		this._request = null;
		this._response = null;
		this.status = 0;
		this.statusText = '';
		this._responseParts = [];
		this._responseHeaders = null;
		this._loadedBytes = 0;
		this._totalBytes = 0;
		this._lengthComputable = false;
	}

	setRequestHeader(name: string, value: any) {
		if (this.readyState !== XMLHttpRequest.OPENED) { throw new XMLHttpRequest.InvalidStateError('XHR readyState must be OPENED'); }

		const loweredName = name.toLowerCase();
		if (this._restrictedHeaders[loweredName] || /^sec-/.test(loweredName) || /^proxy-/.test(loweredName)) {
			console.warn(`Refused to set unsafe header "${name}"`);
			return;
		}

		value = value.toString();
		if (this._loweredHeaders[loweredName] != null) {
			name = this._loweredHeaders[loweredName];
			this._headers[name] = `${this._headers[name]}, ${value}`;
		} else {
			this._loweredHeaders[loweredName] = name;
			this._headers[name] = value;
		}
	}

	send(data?: string | Buffer | ArrayBuffer | ArrayBufferView) {
		if (this.readyState !== XMLHttpRequest.OPENED) { throw new XMLHttpRequest.InvalidStateError('XHR readyState must be OPENED'); }
		if (this._request) { throw new XMLHttpRequest.InvalidStateError('send() already called'); }

		switch (this._url.protocol) {
		case 'file:':
			return this._sendFile(data);
		case 'http:':
		case 'https:':
			return this._sendHttp(data);
		default:
			throw new XMLHttpRequest.NetworkError(`Unsupported protocol ${this._url.protocol}`);
		}
	}

	abort() {
		if (this._request == null) { return; }

		this._request.abort();
		this._setError();

		this._dispatchProgress('abort');
		this._dispatchProgress('loadend');
	}

	getResponseHeader(name: string) {
		if (this._responseHeaders == null || name == null) { return null; }
		const loweredName = name.toLowerCase();
		return this._responseHeaders.hasOwnProperty(loweredName)
			? this._responseHeaders[name.toLowerCase()]
			: null;
	}

	getAllResponseHeaders() {
		if (this._responseHeaders == null) { return ''; }
		return Object.keys(this._responseHeaders).map(key => `${key}: ${this._responseHeaders[key]}`).join('\r\n');
	}

	overrideMimeType(mimeType: string) {
		if (this.readyState === XMLHttpRequest.LOADING || this.readyState === XMLHttpRequest.DONE) { throw new XMLHttpRequest.InvalidStateError('overrideMimeType() not allowed in LOADING or DONE'); }
		this._mimeOverride = mimeType.toLowerCase();
	}

	nodejsSet(options: {httpAgent?: HttpAgent, httpsAgent?: HttpsAgent, baseUrl?: string }) {
		this.nodejsHttpAgent = options.httpAgent || this.nodejsHttpAgent;
		this.nodejsHttpsAgent = options.httpsAgent || this.nodejsHttpsAgent;
		if (options.hasOwnProperty('baseUrl')) {
			if (options.baseUrl != null) {
				const parsedUrl = url.parse(options.baseUrl, false, true);
				if (!parsedUrl.protocol) {
					throw new XMLHttpRequest.SyntaxError("baseUrl must be an absolute URL")
				}
			}
			this.nodejsBaseUrl = options.baseUrl;
		}
	}

	static nodejsSet(options: {httpAgent?: HttpAgent, httpsAgent?: HttpsAgent, baseUrl?: string }) {
		XMLHttpRequest.prototype.nodejsSet(options);
	}

	private _setReadyState(readyState: number) {
		this.readyState = readyState;
		this.dispatchEvent(new ProgressEvent('readystatechange'));
	}

	private _sendFile(data: any) {
		// TODO
		throw new Error('Protocol file: not implemented');
	}

	private _sendHttp(data?: string | Buffer | ArrayBuffer | ArrayBufferView) {
		if (this._sync) { throw new Error('Synchronous XHR processing not implemented'); }
		if (data && (this._method === 'GET' || this._method === 'HEAD')) {
			console.warn(`Discarding entity body for ${this._method} requests`);
			data = null;
		} else {
			data = data || '';
		}

		this.upload._setData(data);
		this._finalizeHeaders();
		this._sendHxxpRequest();
	}

	private _sendHxxpRequest() {
		if (this.withCredentials) {
			const cookie = XMLHttpRequest.cookieJar
				.getCookies(
					Cookie.CookieAccessInfo(this._url.hostname, this._url.pathname, this._url.protocol === 'https:')
				).toValueString();

			this._headers.cookie = this._headers.cookie2 = cookie;
		}

		const [hxxp, agent] = this._url.protocol === 'http:' ? [http, this.nodejsHttpAgent] : [https, this.nodejsHttpsAgent];
		const requestMethod: (options: RequestOptionsHttp) => ClientRequest = hxxp.request.bind(hxxp);
		const request = requestMethod({
			hostname: this._url.hostname,
			port: +this._url.port,
			path: this._url.path,
			auth: this._url.auth,
			method: this._method,
			headers: this._headers,
			agent
		});
		this._request = request;

		if (this.timeout) { request.setTimeout(this.timeout, () => this._onHttpTimeout(request)); }
		request.on('response', response => this._onHttpResponse(request, response));
		request.on('error', error => this._onHttpRequestError(request, error));
		this.upload._startUpload(request);

		if (this._request === request) { this._dispatchProgress('loadstart'); }
	}

	private _finalizeHeaders() {
		if (!this._headers['User-Agent']) {
			this._headers['User-Agent'] = this._userAgent;
		}
		this._headers = {
			...this._headers,
			Connection: 'keep-alive',
			Host: this._url.host,
			...this._anonymous ? {Referer: 'about:blank'} : {}
		};
		this.upload._finalizeHeaders(this._headers, this._loweredHeaders);
	}

	private _onHttpResponse(request: ClientRequest, response: IncomingMessage) {
		if (this._request !== request) { return; }

		if (this.withCredentials && (response.headers['set-cookie'] || response.headers['set-cookie2'])) {
			XMLHttpRequest.cookieJar
				.setCookies(response.headers['set-cookie'] || response.headers['set-cookie2']);
		}

		if ([301, 302, 303, 307, 308].indexOf(response.statusCode) >= 0) {
			this._url = this._parseUrl(response.headers.location);
			this._method = 'GET';
			if (this._loweredHeaders['content-type']) {
				delete this._headers[this._loweredHeaders['content-type']];
				delete this._loweredHeaders['content-type'];
			}
			if (this._headers['Content-Type'] != null) {
				delete this._headers['Content-Type'];
			}
			delete this._headers['Content-Length'];

			this.upload._reset();
			this._finalizeHeaders();
			this._sendHxxpRequest();
			return;
		}

		this._response = response;
		this._response.on('data', data => this._onHttpResponseData(response, data));
		this._response.on('end', () => this._onHttpResponseEnd(response));
		this._response.on('close', () => this._onHttpResponseClose(response));

		this.responseUrl = this._url.href.split('#')[0];
		this.status = response.statusCode;
		this.statusText = http.STATUS_CODES[this.status];
		this._parseResponseHeaders(response);

		const lengthString = this._responseHeaders['content-length'] || '';
		this._totalBytes = +lengthString;
		this._lengthComputable = !!lengthString;

		this._setReadyState(XMLHttpRequest.HEADERS_RECEIVED);
	}

	private _onHttpResponseData(response: IncomingMessage, data: string | Buffer) {
		if (this._response !== response) { return; }

		this._responseParts.push(Buffer.from(data as any));
		this._loadedBytes += data.length;

		if (this.readyState !== XMLHttpRequest.LOADING) {
			this._setReadyState(XMLHttpRequest.LOADING);
		}

		this._dispatchProgress('progress');
	}

	private _onHttpResponseEnd(response: IncomingMessage) {
		if (this._response !== response) { return; }

		this._parseResponse();
		this._request = null;
		this._response = null;
		this._setReadyState(XMLHttpRequest.DONE);

		this._dispatchProgress('load');
		this._dispatchProgress('loadend');
	}

	private _onHttpResponseClose(response: IncomingMessage) {
		if (this._response !== response) { return; }

		const request = this._request;
		this._setError();
		request.abort();
		this._setReadyState(XMLHttpRequest.DONE);

		this._dispatchProgress('error');
		this._dispatchProgress('loadend');
	}

	private _onHttpTimeout(request: ClientRequest) {
		if (this._request !== request) { return; }

		this._setError();
		request.abort();
		this._setReadyState(XMLHttpRequest.DONE);

		this._dispatchProgress('timeout');
		this._dispatchProgress('loadend');
	}

	private _onHttpRequestError(request: ClientRequest, error: Error) {
		if (this._request !== request) { return; }

		this._setError();
		request.abort();
		this._setReadyState(XMLHttpRequest.DONE);

		this._dispatchProgress('error');
		this._dispatchProgress('loadend');
	}

	private _dispatchProgress(eventType: string) {
		const event = new XMLHttpRequest.ProgressEvent(eventType);
		event.lengthComputable = this._lengthComputable;
		event.loaded = this._loadedBytes;
		event.total = this._totalBytes;
		this.dispatchEvent(event);
	}

	private _setError() {
		this._request = null;
		this._response = null;
		this._responseHeaders = null;
		this._responseParts = null;
	}

	private _parseUrl(urlString: string, user?: string, password?: string) {
		const absoluteUrl = this.nodejsBaseUrl == null ? urlString : url.resolve(this.nodejsBaseUrl, urlString);
		const xhrUrl: XHRUrl = url.parse(absoluteUrl, false, true);

		xhrUrl.hash = null;

		const [xhrUser, xhrPassword] = (xhrUrl.auth || '').split(':');
		if (xhrUser || xhrPassword || user || password) {
			xhrUrl.auth = `${user || xhrUser || ''}:${password || xhrPassword || ''}`;
		}

		return xhrUrl;
	}

	private _parseResponseHeaders(response: IncomingMessage) {
		this._responseHeaders = {};
		for (let name in response.headers) {
			const loweredName = name.toLowerCase();
			if (this._privateHeaders[loweredName]) { continue; }
			this._responseHeaders[loweredName] = response.headers[name];
		}
		if (this._mimeOverride != null) {
			this._responseHeaders['content-type'] = this._mimeOverride;
		}
	}

	private _parseResponse() {
		const buffer = Buffer.concat(this._responseParts);
		this._responseParts = null;

		switch (this.responseType) {
		case 'json':
			this.responseText = null;
			try {
				this.response = JSON.parse(buffer.toString('utf-8'));
			} catch {
				this.response = null;
			}
			return;
		case 'buffer':
			this.responseText = null;
			this.response = buffer;
			return;
		case 'arraybuffer':
			this.responseText = null;
			const arrayBuffer = new ArrayBuffer(buffer.length);
			const view = new Uint8Array(arrayBuffer);
			for (let i = 0; i < buffer.length; i++) { view[i] = buffer[i]; }
			this.response = arrayBuffer;
			return;
		case 'text':
		default:
			try {
				this.responseText = buffer.toString(this._parseResponseEncoding());
			} catch {
				this.responseText = buffer.toString('binary');
			}
			this.response = this.responseText;
		}
	}

	private _parseResponseEncoding() {
		return /;\s*charset=(.*)$/.exec(this._responseHeaders['content-type'] || '')[1] || 'utf-8';
	}
}

XMLHttpRequest.prototype.nodejsHttpAgent = http.globalAgent;
XMLHttpRequest.prototype.nodejsHttpsAgent = https.globalAgent;
XMLHttpRequest.prototype.nodejsBaseUrl = null;
