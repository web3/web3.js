import * as ava from 'ava';
import { XMLHttpRequest } from '../xml-http-request';
import { HttpServer } from './helpers/server';
import { PNGArrayBuffer, PNGBuffer } from './helpers/png';

function contextualize<T>(getContext: () => T): ava.RegisterContextual<T> {
	ava.test.beforeEach(t => {
		Object.assign(t.context, getContext());
	});
	return ava.test;
}

const test = contextualize(() => ({
	xhr: new XMLHttpRequest(),
	jsonUrl: '',
	jsonString: '',
	imageUrl: ''
}));

test.before(async () => {
	await HttpServer.serverStarted;
});

test.beforeEach(t => {
	t.context.xhr = new XMLHttpRequest();
	t.context.jsonUrl = `http://localhost:${HttpServer.port}/test/fixtures/hello.json`;
	t.context.jsonString = '{"hello": "world", "answer": 42}\n';
	t.context.imageUrl = `http://localhost:${HttpServer.port}/test/fixtures/hello.png`;
});

test('XMLHttpRequest #responseType text reads a JSON file into a String', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.addEventListener('load', () => {
			t.is(xhr.response, t.context.jsonString);
			t.is(xhr.responseText, t.context.jsonString);
			resolve();
		});
		xhr.open('GET', t.context.jsonUrl);
		xhr.responseType = 'text';
		xhr.send();
	});
});

test('XMLHttpRequest #responseType json reads a JSON file into a parsed JSON object', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== XMLHttpRequest.DONE) { return; }
			
			t.deepEqual(xhr.response, { hello: 'world', answer: 42 });
			resolve();
		});
		xhr.open('GET', t.context.jsonUrl);
		xhr.responseType = 'json';
		xhr.send();
	});
});

test('XMLHttpRequest #responseType json produces null when reading a non-JSON file', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.addEventListener('loadend', () => {
			t.is(xhr.response, null);
			resolve();
		});
		xhr.open('GET', `http://localhost:${HttpServer.port}/test/fixtures/hello.txt`);
		xhr.responseType = 'json';
		xhr.send();
	});
});

test('XMLHttpRequest #responseType arraybuffer reads a JSON file into an ArrayBuffer', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.addEventListener('loadend', () => {
			t.true(xhr.response instanceof ArrayBuffer);
			if (!(xhr.response instanceof ArrayBuffer)) { return; }
			const view = new Uint8Array(xhr.response);
			const response = Array.from(view).map(viewElement => String.fromCharCode(viewElement)).join('');
			t.is(response, t.context.jsonString);
			resolve();
		});
		xhr.open('GET', t.context.jsonUrl);
		xhr.responseType = 'arraybuffer';
		xhr.send();
	});
});

test('XMLHttpRequest #responseType arraybuffer reads a binary file into an ArrayBuffer', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.addEventListener('loadend', () => {
			t.true(xhr.response instanceof ArrayBuffer);
			if (!(xhr.response instanceof ArrayBuffer)) { return; }
			t.deepEqual(xhr.response, PNGArrayBuffer);
			resolve();
		});
		xhr.open('GET', t.context.imageUrl);
		xhr.responseType = 'arraybuffer';
		xhr.send();
	});
});

test('XMLHttpRequest #responseType buffer reads a JSON file into a node.js Buffer', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.addEventListener('loadend', () => {
			t.true(xhr.response instanceof Buffer);
			if (!(xhr.response instanceof Buffer)) { return; }
			const response = Array.from(xhr.response).map(viewElement => String.fromCharCode(viewElement)).join('');
			t.is(response, t.context.jsonString);
			resolve();
		});
		xhr.open('GET', t.context.jsonUrl);
		xhr.responseType = 'buffer';
		xhr.send();
	});
});

test('XMLHttpRequest #responseType buffer reads a binary file into a node.js Buffer', async t => {
	const xhr = t.context.xhr;
	await new Promise(resolve => {
		xhr.addEventListener('loadend', () => {
			t.true(xhr.response instanceof Buffer);
			if (!(xhr.response instanceof Buffer)) { return; }
			t.deepEqual(xhr.response, PNGBuffer);
			resolve();
		});
		xhr.open('GET', t.context.imageUrl);
		xhr.responseType = 'buffer';
		xhr.send();
	});
});
