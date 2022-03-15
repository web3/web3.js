import * as ava from 'ava';
import { XMLHttpRequest } from '../xml-http-request';

function contextualize<T>(getContext: () => T): ava.RegisterContextual<T> {
	ava.test.beforeEach(t => {
		Object.assign(t.context, getContext());
	});
	return ava.test;
}

const test = contextualize(() => ({
	xhr: new XMLHttpRequest(),
	customXhr: new XMLHttpRequest()
}));

test.beforeEach(t => {
	t.context.xhr = new XMLHttpRequest();
	t.context.customXhr = new XMLHttpRequest();
});

test('XMLHttpRequest.nodejsSet with a httpAgent option', t => {
	const customAgent = {custom: 'httpAgent'};
	const defaultAgent = XMLHttpRequest.prototype.nodejsHttpAgent;
	const agent = {mocking: 'httpAgent'};
	t.context.customXhr.nodejsHttpAgent = customAgent as any;
	XMLHttpRequest.nodejsSet({httpAgent: agent} as any);
	t.is(t.context.xhr.nodejsHttpAgent, agent as any, 'sets the default nodejsHttpAgent');
	t.is(t.context.customXhr.nodejsHttpAgent, customAgent as any, 'does not interfere with custom nodejsHttpAgent settings');
	XMLHttpRequest.nodejsSet({httpAgent: defaultAgent});
});

test('XMLHttpRequest.nodejsSet with a httpsAgent option', t => {
	const customAgent = {custom: 'httpsAgent'};
	const defaultAgent = XMLHttpRequest.prototype.nodejsHttpsAgent;
	const agent = {mocking: 'httpsAgent'};
	t.context.customXhr.nodejsHttpsAgent = customAgent as any;
	XMLHttpRequest.nodejsSet({httpsAgent: agent} as any);
	t.is(t.context.xhr.nodejsHttpsAgent, agent as any, 'sets the default nodejsHttpsAgent');
	t.is(t.context.customXhr.nodejsHttpsAgent, customAgent as any, 'does not interfere with custom nodejsHttpsAgent settings');
	XMLHttpRequest.nodejsSet({httpsAgent: defaultAgent});
});

test('XMLHttpRequest.nodejsSet with a baseUrl option', t => {
	const customBaseUrl = 'http://custom.url/base';
	const defaultBaseUrl = XMLHttpRequest.prototype.nodejsBaseUrl;
	const baseUrl = 'http://localhost/base';
	t.context.customXhr.nodejsBaseUrl = customBaseUrl;
	XMLHttpRequest.nodejsSet({baseUrl});
	t.is(t.context.xhr.nodejsBaseUrl, baseUrl, 'sets the default nodejsBaseUrl');
	t.is(t.context.customXhr.nodejsBaseUrl, customBaseUrl, 'does not interfere with custom nodejsBaseUrl settings');
	XMLHttpRequest.nodejsSet({baseUrl: defaultBaseUrl});
});

test('#nodejsSet with a httpAgent option', t => {
	const customAgent = {custom: 'httpAgent'};
	t.context.customXhr.nodejsSet({httpAgent: customAgent as any});
	t.is(t.context.customXhr.nodejsHttpAgent, customAgent as any, 'sets nodejsHttpAgent on the XHR instance');
	t.not(t.context.xhr.nodejsHttpAgent, customAgent as any, 'does not interfere with default nodejsHttpAgent settings');
});

test('#nodejsSet with a httpsAgent option', t => {
	const customAgent = {custom: 'httpsAgent'};
	t.context.customXhr.nodejsSet({httpsAgent: customAgent as any});
	t.is(t.context.customXhr.nodejsHttpsAgent, customAgent as any, 'sets nodejsHttpsAgent on the XHR instance');
	t.not(t.context.xhr.nodejsHttpsAgent, customAgent as any, 'does not interfere with default nodejsHttpsAgent settings');
});

test('base URL parsing with null baseUrl', t => {
	const xhr = t.context.xhr as any;
	xhr.nodejsSet({baseUrl: null});
	const parsedUrl = xhr._parseUrl('http://www.domain.com/path');
	t.truthy(parsedUrl);
	t.true(parsedUrl.hasOwnProperty('href'));
	t.is(parsedUrl.href, 'http://www.domain.com/path');
});

test('base URL parsing with a (protocol, domain, filePath) baseUrl parses an absolute URL', t => {
	const xhr = t.context.xhr as any;
	xhr.nodejsSet({baseUrl: 'https://base.url/dir/file.html'});
	const parsedUrl = xhr._parseUrl('http://www.domain.com/path');
	t.truthy(parsedUrl);
	t.true(parsedUrl.hasOwnProperty('href'));
	t.is(parsedUrl.href, 'http://www.domain.com/path');
});

test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a path-relative URL', t => {
	const xhr = t.context.xhr as any;
	xhr.nodejsSet({baseUrl: 'https://base.url/dir/file.html'});
	const parsedUrl = xhr._parseUrl('path/to.js');
	t.truthy(parsedUrl);
	t.true(parsedUrl.hasOwnProperty('href'));
	t.is(parsedUrl.href, 'https://base.url/dir/path/to.js');
});

test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a path-relative URL with ..', t => {
	const xhr = t.context.xhr as any;
	xhr.nodejsSet({baseUrl: 'https://base.url/dir/file.html'});
	const parsedUrl = xhr._parseUrl('../path/to.js');
	t.truthy(parsedUrl);
	t.true(parsedUrl.hasOwnProperty('href'));
	t.is(parsedUrl.href, 'https://base.url/path/to.js');
});

test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a host-relative URL', t => {
	const xhr = t.context.xhr as any;
	xhr.nodejsSet({baseUrl: 'https://base.url/dir/file.html'});
	const parsedUrl = xhr._parseUrl('/path/to.js');
	t.truthy(parsedUrl);
	t.true(parsedUrl.hasOwnProperty('href'));
	t.is(parsedUrl.href, 'https://base.url/path/to.js');
});

test('base URL parsing with a (protocol, domain, filePath) baseUrl parses a protocol-relative URL', t => {
	const xhr = t.context.xhr as any;
	xhr.nodejsSet({baseUrl: 'https://base.url/dir/file.html'});
	const parsedUrl = xhr._parseUrl('//domain.com/path/to.js');
	t.truthy(parsedUrl);
	t.true(parsedUrl.hasOwnProperty('href'));
	t.is(parsedUrl.href, 'https://domain.com/path/to.js');
});
