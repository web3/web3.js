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

test('XMLHttpRequest #responseURL provides the URL of the response', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/method`);
		xhr.onload = () => {
			t.is(xhr.responseUrl, `http://localhost:${HttpServer.port}/_/method`);
			resolve();
		};
		xhr.send();
	});
});

test('XMLHttpRequest #responseURL ignores the hash fragment', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.open('GET', `http://localhost:${HttpServer.port}/_/method#foo`);
		xhr.onload = () => {
			t.is(xhr.responseUrl, `http://localhost:${HttpServer.port}/_/method`);
			resolve();
		};
		xhr.send();
	});
});
