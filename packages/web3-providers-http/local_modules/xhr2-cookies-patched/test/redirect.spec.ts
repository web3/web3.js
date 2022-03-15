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
	xhr: new XMLHttpRequest()
}));

test.before(async () => {
	await HttpServer.serverStarted;
});

test.beforeEach(t => {
	t.context.xhr = new XMLHttpRequest();
});

test('XMLHttpRequest when redirected issues a GET for the next location', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('POST', `http://localhost:${HttpServer.port}/_/redirect/302/method`);
		xhr.onload = () => {
			t.regex(xhr.responseText, /GET/i);
			resolve();
		};
		xhr.onerror = () => {
			t.fail();
			resolve();
		};
		xhr.send('This should be dropped during the redirect');
	});
});

test('XMLHttpRequest when redirected does not return the redirect headers', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/redirect/302/method`);
		xhr.onload = () => {
			t.is(xhr.getResponseHeader('Content-Type'), 'text/plain; charset=utf-8');
			t.falsy(xhr.getResponseHeader('X-Redirect-Header'));
			resolve();
		};
		xhr.onerror = () => {
			t.fail();
			resolve();
		};
		xhr.send();
	});
});

test('XMLHttpRequest when redirected persists custom request headers across redirects', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/redirect/302/headers`);
		xhr.setRequestHeader('X-Redirect-Test', 'should be preserved');
		xhr.onload = () => {
			t.regex(xhr.responseText, /^\{.*\}$/);
			const headers = JSON.parse(xhr.responseText);
			t.is(headers.connection, 'keep-alive');
			t.true(headers.hasOwnProperty('host'));
			t.is(headers.host, `localhost:${HttpServer.port}`);
			t.true(headers.hasOwnProperty('x-redirect-test'));
			t.is(headers['x-redirect-test'], 'should be preserved');
			resolve();
		};
		xhr.onerror = () => {
			t.fail();
			resolve();
		};
		xhr.send();
	});
});

test('XMLHttpRequest when redirected drops content-related headers across redirects', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/redirect/302/headers`);
		xhr.setRequestHeader('X-Redirect-Test', 'should be preserved');
		xhr.onload = () => {
			t.regex(xhr.responseText, /^\{.*\}$/);
			const headers = JSON.parse(xhr.responseText);
			t.is(headers.connection, 'keep-alive');
			t.true(headers.hasOwnProperty('host'));
			t.is(headers.host, `localhost:${HttpServer.port}`);
			t.true(headers.hasOwnProperty('x-redirect-test'));
			t.is(headers['x-redirect-test'], 'should be preserved');
			t.false(headers.hasOwnProperty('content-type'));
			t.false(headers.hasOwnProperty('content-length'));
			resolve();
		};
		xhr.onerror = () => {
			t.fail();
			resolve();
		};
		xhr.send();
	});
});

test('XMLHttpRequest when redirected provides the final responseURL', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/redirect/302/method`);
		xhr.setRequestHeader('X-Redirect-Test', 'should be preserved');
		xhr.onload = () => {
			t.is(xhr.responseUrl, `http://localhost:${HttpServer.port}/_/method`);
			resolve();
		};
		xhr.onerror = () => {
			t.fail();
			resolve();
		};
		xhr.send();
	});
});
