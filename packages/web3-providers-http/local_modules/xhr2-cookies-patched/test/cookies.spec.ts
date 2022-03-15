import * as ava from 'ava';
import { XMLHttpRequest } from '../xml-http-request';
import { HttpServer } from './helpers/server';
import * as Cookie from 'cookiejar';

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
	XMLHttpRequest.cookieJar = Cookie.CookieJar();
});

test('XMLHttpRequest sets cookies and passes them on on redirect', async t => {
	const xhr = t.context.xhr;
	t.plan(1);
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/redirect-cookie/test/works`);
		xhr.withCredentials = true;
		xhr.onload = () => {
			t.is(xhr.responseText, 'works');
			resolve();
		};
		xhr.send();
	});
});

test('XMLHttpRequest sets cookies and uses them for subsequent calls', async t => {
	let xhr = t.context.xhr;
	t.plan(1);
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/set-cookie/second-test/works`);
		xhr.withCredentials = true;
		xhr.onload = resolve;
		xhr.send();
	});
	xhr = new XMLHttpRequest();
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/print-cookie/second-test`);
		xhr.withCredentials = true;
		xhr.onload = () => {
			t.is(xhr.responseText, 'works');
			resolve();
		};
		xhr.send();
	});
});
