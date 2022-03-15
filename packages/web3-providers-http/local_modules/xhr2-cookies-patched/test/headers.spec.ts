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

	XMLHttpRequest.nodejsSet({
		baseUrl: HttpServer.testUrl().replace('https://', 'http://')
	});
});

test.beforeEach(t => {
	t.context.xhr = new XMLHttpRequest();
});

test('#setRequestHeader with allowed headers should send the headers', async t => {
	const xhr = t.context.xhr;
	xhr.open('POST', `http://localhost:${HttpServer.port}/_/headers`);
	xhr.responseType = 'text';

	xhr.setRequestHeader('Authorization', 'lol');
	xhr.setRequestHeader('X-Answer', '42');
	xhr.setRequestHeader('X-Header-Name', 'value');

	await new Promise(resolve => {
		xhr.onload = () => {
			t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
			const headers = JSON.parse(xhr.responseText);
			t.true(headers.hasOwnProperty('authorization'), 'headers have authorization header');
			t.is(headers.authorization, 'lol', 'authorization header is correct');
			t.true(headers.hasOwnProperty('x-answer'), 'headers have x-answer header');
			t.is(headers['x-answer'], '42', 'x-answer header is correct');
			t.true(headers.hasOwnProperty('x-header-name'), 'headers have x-header-name header');
			t.is(headers['x-header-name'], 'value', 'x-header-name header is correct');
			resolve();
		};
		xhr.send('');
	});
});

test('#setRequestHeader with a mix of allowed and forbidden headers should only send the allowed headers', async t => {
	const xhr = t.context.xhr;
	xhr.open('POST', `http://localhost:${HttpServer.port}/_/headers`);
	xhr.responseType = 'text';

	xhr.setRequestHeader('Authorization', 'lol');
	xhr.setRequestHeader('Proxy-Authorization', 'evil:kitten');
	xhr.setRequestHeader('Sec-Breach', 'yes please');
	xhr.setRequestHeader('Host', 'www.google.com');
	xhr.setRequestHeader('Origin', 'https://www.google.com');
	xhr.setRequestHeader('X-Answer', '42');

	await new Promise(resolve => {
		xhr.onload = () => {
			t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
			const headers = JSON.parse(xhr.responseText);
			t.true(headers.hasOwnProperty('authorization'), 'headers have authorization header');
			t.is(headers['authorization'], 'lol', 'authorization header is correct');
			t.false(headers.hasOwnProperty('proxy-authorization'), 'headers do not have proxy-authorization header');
			t.false(headers.hasOwnProperty('sec-breach'), 'headers do not have sec-breach header');
			t.notRegex(headers['origin'] || '', /www\.google\.com/, 'header "origin" should not contain www.google.com');
			t.notRegex(headers['host'] || '', /www\.google\.com/, 'header "host" should not contain www.google.com');
			t.true(headers.hasOwnProperty('x-answer'), 'headers have x-answer header');
			t.is(headers['x-answer'], '42', 'x-answer header is correct');
			resolve();
		};
		xhr.send('');
	});
});

test('#setRequestHeader with repeated headers should send all headers', async t => {
	const xhr = t.context.xhr;
	xhr.open('POST', `http://localhost:${HttpServer.port}/_/headers`);
	xhr.responseType = 'text';

	xhr.setRequestHeader('Authorization', 'troll');
	xhr.setRequestHeader('Authorization', 'lol');
	xhr.setRequestHeader('Authorization', 'lol');
	xhr.setRequestHeader('X-Answer', '42');

	await new Promise(resolve => {
		xhr.onload = () => {
			t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
			const headers = JSON.parse(xhr.responseText);
			t.true(headers.hasOwnProperty('authorization'), 'headers have authorization header');
			t.is(headers['authorization'], 'troll, lol, lol', 'authorization header is correct');
			t.true(headers.hasOwnProperty('x-answer'), 'headers have x-answer header');
			t.is(headers['x-answer'], '42', 'x-answer header is correct');
			resolve();
		};
		xhr.send('');
	});
});

test('#setRequestHeader with no headers should set the protected headers correctly', async t => {
	const xhr = t.context.xhr;
	xhr.open('POST', `http://localhost:${HttpServer.port}/_/headers`);
	xhr.responseType = 'text';

	xhr.setRequestHeader('Authorization', 'troll');
	xhr.setRequestHeader('Authorization', 'lol');
	xhr.setRequestHeader('Authorization', 'lol');
	xhr.setRequestHeader('X-Answer', '42');

	await new Promise(resolve => {
		xhr.onload = () => {
			t.regex(xhr.responseText, /^\{.*\}$/, 'response text looks like JSON');
			const headers = JSON.parse(xhr.responseText);
			t.true(headers.hasOwnProperty('connection'), 'headers have connection header');
			t.is(headers['connection'], 'keep-alive', 'connection header is correct');
			t.true(headers.hasOwnProperty('host'), 'headers have host header');
			t.is(headers['host'], `localhost:${HttpServer.port}`, 'host header is correct');
			t.true(headers.hasOwnProperty('user-agent'), 'headers have user-agent header');
			resolve();
		};
		xhr.send('');
	});
});

test('#getResponseHeader returns accessible headers, returns null for private headers, has headers on HEADERS_RECEIVED readyState', async t => {
	const xhr = t.context.xhr;
	xhr.open('POST', `http://localhost:${HttpServer.port}/_/get-headers`);
	const headerJson = `{
		"Accept-Ranges": "bytes",
		"Content-Type": "application/xhr2; charset=utf-1337",
		"Set-Cookie": "UserID=JohnDoe; Max-Age=3600; Version=1",
		"X-Header": "one, more, value"
	}`;

	await new Promise(resolve => {
		xhr.onloadend = () => {
			t.is(xhr.getResponseHeader('AccEPt-RANgeS'), 'bytes', 'AccEPt-RANgeS works correctly');
			t.is(xhr.getResponseHeader('content-Type'), 'application/xhr2; charset=utf-1337', 'content-Type works correctly');
			t.is(xhr.getResponseHeader('X-Header'), 'one, more, value', 'X-Header works correctly');
			t.is(xhr.getResponseHeader('set-cookie'), null, 'set-cookie works correctly');
			resolve();
		};
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.HEADERS_RECEIVED) { return; }
			t.is(xhr.getResponseHeader('AccEPt-RANgeS'), 'bytes', 'AccEPt-RANgeS works correctly when HEADERS_RECEIVED ready state');
		};
		xhr.send(headerJson);
	});
});

test('#getAllResponseHeaders contains accessible headers, does not contain private headers, has headers on HEADERS_RECEIVED readyState', async t => {
	const xhr = t.context.xhr;
	xhr.open('POST', `http://localhost:${HttpServer.port}/_/get-headers`);
	const headerJson = `{
		"Accept-Ranges": "bytes",
		"Content-Type": "application/xhr2; charset=utf-1337",
		"Set-Cookie": "UserID=JohnDoe; Max-Age=3600; Version=1",
		"X-Header": "one, more, value"
	}`;

	await new Promise(resolve => {
		xhr.onloadend = () => {
			const headers = xhr.getAllResponseHeaders();
			t.regex(headers, /(\A|\r\n)accept-ranges: bytes(\r\n|\Z)/mi);
			t.regex(headers, /(\A|\r\n)content-type: application\/xhr2; charset=utf-1337(\r\n|\Z)/mi);
			t.regex(headers, /(\A|\r\n)X-Header: one, more, value(\r\n|\Z)/mi);
			t.notRegex(headers, /(\A|\r\n)set-cookie:/mi);
			resolve();
		};
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.HEADERS_RECEIVED) { return; }
			const headers = xhr.getAllResponseHeaders();
			t.regex(headers, /(\A|\r\n)accept-ranges: bytes(\r\n|\Z)/mi);
		};
		xhr.send(headerJson);
	});
});

// TODO:
//   * set request header after request opened should throw InvalidStateError
//   *
