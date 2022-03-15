import * as ava from 'ava';
import { XMLHttpRequest } from '../xml-http-request';
import { HttpServer, HttpsServer } from './helpers/server';
import * as https from 'https';

const agent = new https.Agent({
	rejectUnauthorized: true,
	ca: HttpsServer.sslCertificate()
});
XMLHttpRequest.nodejsSet({
	httpsAgent: agent
});

function contextualize<T>(getContext: () => T): ava.RegisterContextual<T> {
	ava.test.beforeEach(t => {
		Object.assign(t.context, getContext());
	});
	return ava.test;
}

const test = contextualize(() => ({
	xhr: new XMLHttpRequest()
}));

test.before(async t => {
	await HttpServer.serverStarted;
	await HttpsServer.serverStarted;
	
	XMLHttpRequest.nodejsSet({
		baseUrl: HttpServer.testUrl().replace('https://', 'http://')
	});
});

test.beforeEach(t => {
	t.context.xhr = new XMLHttpRequest();
});

test('constructor', t => {
	const xhr = t.context.xhr;
	t.is(xhr.readyState, XMLHttpRequest.UNSENT, 'sets readyState to UNSENT');
	t.is(xhr.timeout, 0, 'sets timeout to 0');
	t.is(xhr.responseType, '', 'sets responseType to ""');
	t.is(xhr.status, 0, 'sets status to 0');
	t.is(xhr.statusText, '', 'sets statusText to ""');
});

test('#open throws SecurityError on CONNECT', t => {
	t.throws(() => t.context.xhr.open('CONNECT', `http://localhost:${HttpServer.port}/test`), XMLHttpRequest.SecurityError);
});

test('#open with a GET for a local https request', t => {
	const xhr = t.context.xhr;
	xhr.open('GET', `https://localhost:${HttpsServer.port}/test/fixtures/hello.txt`);
	t.is(xhr.readyState, XMLHttpRequest.OPENED, 'sets readyState to OPENED');
	t.is(xhr.status, 0, 'keeps status 0');
	t.is(xhr.statusText, '', 'keeps statusText ""');
});

test('#send on a local http GET kicks off the request', async t => {
	const xhr = t.context.xhr;
	xhr.open('GET', `http://localhost:${HttpServer.port}/test/fixtures/hello.txt`);
	
	t.plan(2);
	await new Promise((resolve, reject) => {
		xhr.onload = (event) => {
			t.is(xhr.status, 200, 'the status is 200');
			t.is(xhr.responseText, 'Hello, world!', 'the text is correct');
			resolve();
		};
		xhr.onerror = (event) => {
			reject(event);
		};
		xhr.send();
	});
});

test('#send on a local https GET kicks off the request', async t => {
	const xhr = t.context.xhr;
	xhr.open('GET', `https://localhost:${HttpsServer.port}/test/fixtures/hello.txt`);
	
	t.plan(2);
	await new Promise((resolve, reject) => {
		xhr.onload = (event) => {
			t.is(xhr.status, 200, 'the status is 200');
			t.is(xhr.responseText, 'Hello, world!', 'the text is correct');
			resolve();
		};
		xhr.onerror = (event) => {
			reject(event);
		};
		xhr.send();
	});
});

test('on a local relative GET it kicks off the request', async t => {
	const xhr = t.context.xhr;
	xhr.open('GET', '../fixtures/hello.txt');
	
	t.plan(2);
	await new Promise((resolve, reject) => {
		xhr.onload = (event) => {
			t.is(xhr.status, 200, 'the status is 200');
			t.is(xhr.responseText, 'Hello, world!', 'the text is correct');
			resolve();
		};
		xhr.onerror = (event) => {
			reject(event);
		};
		xhr.send();
	});
});

test('on a local gopher GET #open + #send throws a NetworkError', async t => {
	const xhr = t.context.xhr;
	t.throws(() => {
		xhr.open('GET', `gopher:localhost:${HttpServer.port}`);
		xhr.send();
	}, XMLHttpRequest.NetworkError);
});

test('readyState constants', t => {
	t.is(XMLHttpRequest.UNSENT < XMLHttpRequest.OPENED, true, 'UNSENT < OPENED');
	t.is(XMLHttpRequest.OPENED < XMLHttpRequest.HEADERS_RECEIVED, true, 'OPENED < HEADERS_RECEIVED');
	t.is(XMLHttpRequest.HEADERS_RECEIVED < XMLHttpRequest.LOADING, true, 'HEADERS_RECEIVED < LOADING');
	t.is(XMLHttpRequest.LOADING < XMLHttpRequest.DONE, true, 'LOADING < DONE');
});

test('XMLHttpRequest constants match the instance constants', t => {
	const xhr = t.context.xhr;
	t.is(XMLHttpRequest.UNSENT, xhr.UNSENT, 'UNSENT');
	t.is(XMLHttpRequest.OPENED, xhr.OPENED, 'OPENED');
	t.is(XMLHttpRequest.HEADERS_RECEIVED, xhr.HEADERS_RECEIVED, 'HEADERS_RECEIVED');
	t.is(XMLHttpRequest.LOADING, xhr.LOADING, 'LOADING');
	t.is(XMLHttpRequest.DONE, xhr.DONE, 'DONE');
});
