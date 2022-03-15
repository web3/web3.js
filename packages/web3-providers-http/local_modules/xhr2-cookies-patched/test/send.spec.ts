import * as ava from 'ava';
import { XMLHttpRequest } from '../xml-http-request';
import { HttpServer } from './helpers/server';
import { PNGArrayBuffer, PNGUint8Array } from './helpers/png';

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
	t.context.xhr.open('POST', `http://localhost:${HttpServer.port}/_/echo`);
});

test('XMLHttpRequest #send works with ASCII DOMStrings', async t => {
	const xhr = t.context.xhr;
	t.plan(2);
	await new Promise(resolve => {
		xhr.onload = () => {
			t.regex(xhr.getResponseHeader('content-type'), /^text\/plain(;\s?charset=UTF-8)?$/);
			t.is(xhr.responseText, 'Hello world!');
			resolve();
		};
		xhr.onerror = () => { t.fail(); return resolve(); };
		xhr.send('Hello world!');
	});
});

test('XMLHttpRequest #send works with UTF-8 DOMStrings', async t => {
	const xhr = t.context.xhr;
	t.plan(2);
	await new Promise(resolve => {
		xhr.onload = () => {
			t.regex(xhr.getResponseHeader('content-type'), /^text\/plain(;\s?charset=UTF-8)?$/);
			t.is(xhr.responseText, '世界你好!');
			resolve();
		};
		xhr.send('世界你好!');
	});
});

test('XMLHttpRequest #send works with ArrayBufferViews', async t => {
	const xhr = t.context.xhr;
	t.plan(2);
	await new Promise(resolve => {
		xhr.responseType = 'arraybuffer';
		xhr.onload = () => {
			t.is(xhr.getResponseHeader('content-type'), null);
			if (!(xhr.response instanceof ArrayBuffer)) { t.fail(); return resolve(); }
			t.deepEqual(new Uint8Array(xhr.response), PNGUint8Array);
			resolve();
		};
		xhr.onerror = () => { t.fail(); return resolve(); };
		xhr.send(PNGUint8Array);
	});
});

test('XMLHttpRequest #send works with ArrayBufferViews with set index and length', async t => {
	const xhr = t.context.xhr;
	t.plan(2);
	const arrayBufferView10 = new Uint8Array(PNGArrayBuffer, 10, 42);
	await new Promise(resolve => {
		xhr.responseType = 'arraybuffer';
		xhr.onload = () => {
			t.is(xhr.getResponseHeader('content-type'), null);
			if (!(xhr.response instanceof ArrayBuffer)) { t.fail(); return resolve(); }
			t.deepEqual(new Uint8Array(xhr.response), arrayBufferView10);
			resolve();
		};
		xhr.onerror = () => { t.fail(); return resolve(); };
		xhr.send(arrayBufferView10);
	});
});

test('XMLHttpRequest #send works with ArrayBuffers', async t => {
	const xhr = t.context.xhr;
	t.plan(2);
	await new Promise(resolve => {
		xhr.responseType = 'arraybuffer';
		xhr.onload = () => {
			t.is(xhr.getResponseHeader('content-type'), null);
			if (!(xhr.response instanceof ArrayBuffer)) { t.fail(); return resolve(); }
			t.deepEqual(xhr.response, PNGArrayBuffer);
			resolve();
		};
		xhr.onerror = () => { t.fail(); return resolve(); };
		xhr.send(PNGArrayBuffer);
	});
});

test('XMLHttpRequest #send works with node.js Buffers', async t => {
	const xhr = t.context.xhr;
	const buffer = Buffer.alloc(PNGUint8Array.length);
	for (let i = 0; i < PNGUint8Array.length; i++) { buffer.writeUInt8(PNGUint8Array[i], i); }
	t.plan(2);
	
	await new Promise(resolve => {
		xhr.responseType = 'buffer';
		xhr.onload = () => {
			t.is(xhr.getResponseHeader('content-type'), null);
			if (!(xhr.response instanceof Buffer)) { t.fail(); return resolve(); }
			t.deepEqual(new Uint8Array(xhr.response), PNGUint8Array);
			resolve();
		};
		xhr.onerror = () => { t.fail(); return resolve(); };
		xhr.send(PNGArrayBuffer);
	});
});

test('XMLHttpRequest #send sets POST headers correctly when given null data', async t => {
	const xhr = t.context.xhr;
	xhr.open('POST', `http://localhost:${HttpServer.port}/_/headers`);
	await new Promise(resolve => {
		xhr.responseType = 'text';
		xhr.onload = () => {
			t.regex(xhr.responseText, /^\{.*\}$/);
			const headers = JSON.parse(xhr.responseText);
			t.true(headers.hasOwnProperty('content-length'));
			t.is(headers['content-length'], '0');
			t.false(headers.hasOwnProperty('content-type'));
			resolve();
		};
		xhr.onerror = () => { t.fail(); return resolve(); };
		xhr.send();
	});
});
