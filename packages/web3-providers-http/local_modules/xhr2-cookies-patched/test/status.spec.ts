import * as ava from 'ava';
import { XMLHttpRequest } from '../xml-http-request';
import { HttpServer } from './helpers/server';

function contextualize<T>(getContext: () => T): ava.RegisterContextual<T> {
	ava.test.beforeEach(t => {
		Object.assign(t.context, getContext());
	});
	return ava.test;
}

const test = contextualize(() => ({
	xhr: new XMLHttpRequest(),
	okUrl: '',
	errorUrl: '',
	errorJson: ''
}));

test.before(async () => {
	await HttpServer.serverStarted;
});

test.beforeEach(t => {
	t.context.xhr = new XMLHttpRequest();
	t.context.okUrl = `http://localhost:${HttpServer.port}/test/fixtures/hello.txt`;
	t.context.errorUrl = `http://localhost:${HttpServer.port}/_/response`;
	t.context.errorJson = JSON.stringify({
		code: 401,
		status: 'Unauthorized',
		body: JSON.stringify({error: 'Credential error'}),
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': '28'
		}
	});
});

test('XMLHttpRequest #status is 200 for a normal request', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('GET', t.context.okUrl);
		let done = false;
		xhr.addEventListener('readystatechange', () => {
			if (done) { return; }
			if (xhr.readyState < XMLHttpRequest.HEADERS_RECEIVED) {
				t.is(xhr.status, 0);
				t.is(xhr.statusText, '');
			} else {
				t.is(xhr.status, 200);
				t.truthy(xhr.statusText);
				t.not(xhr.statusText, '');
				if (xhr.readyState === XMLHttpRequest.DONE) {
					done = true;
					resolve();
				}
			}
		});
		xhr.send();
	});
});

test('XMLHttpRequest #status returns the server-reported status', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('POST', t.context.errorUrl);
		let done = false;
		xhr.addEventListener('readystatechange', () => {
			if (done) { return; }
			if (xhr.readyState < XMLHttpRequest.HEADERS_RECEIVED) {
				t.is(xhr.status, 0);
				t.is(xhr.statusText, '');
			} else {
				t.is(xhr.status, 401);
				t.truthy(xhr.statusText);
				t.not(xhr.statusText, '');
				if (xhr.readyState === XMLHttpRequest.DONE) {
					done = true;
					resolve();
				}
			}
		});
		xhr.send(t.context.errorJson);
	});
});
