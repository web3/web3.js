import * as ava from 'ava';
import { XMLHttpRequest } from '../xml-http-request';
import { ProgressEvent } from '../progress-event';

function contextualize<T>(getContext: () => T): ava.RegisterContextual<T> {
	ava.test.beforeEach(t => {
		Object.assign(t.context, getContext());
	});
	return ava.test;
}

const test = contextualize(() => ({
	xhr: new XMLHttpRequest(),
	loadEvent: new ProgressEvent('load')
}));

test.beforeEach(t => {
	t.context.xhr = new XMLHttpRequest();
	t.context.loadEvent = new ProgressEvent('load');
});

test('XMLHttpRequestEventTarget dispatchEvent works with a DOM0 listener', t => {
	t.plan(1);
	t.context.xhr.onload = () => t.pass();
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget dispatchEvent works with a DOM2 listener', t => {
	t.plan(1);
	t.context.xhr.addEventListener('load', () => t.pass());
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget dispatchEvent executes DOM2 listeners in order', t => {
	t.plan(1);
	let firstExecuted = false;
	t.context.xhr.addEventListener('load', () => firstExecuted = true);
	t.context.xhr.addEventListener('load', () => {
		if (firstExecuted) { t.pass(); }
	});
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget removes a DOM2 listener correctly', t => {
	t.plan(1);
	const listener = () => t.pass();
	t.context.xhr.addEventListener('load', listener);
	t.context.xhr.dispatchEvent(t.context.loadEvent);
	t.context.xhr.removeEventListener('load', listener);
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget binds this correctly in a DOM0 listener', t => {
	t.plan(1);
	t.context.xhr.onload = function () { if (this === t.context.xhr) { t.pass(); } };
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget binds this correctly in a DOM2 listener', t => {
	t.plan(1);
	t.context.xhr.addEventListener('load', function () { if (this === t.context.xhr) { t.pass(); } });
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget sets target correctly in a DOM0 listener', t => {
	t.plan(1);
	t.context.xhr.onload = function (event) { if (event.target === t.context.xhr) { t.pass(); } };
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget sets target correctly in a DOM2 listener', t => {
	t.plan(1);
	t.context.xhr.addEventListener('load', function (event) { if (event.target === t.context.xhr) { t.pass(); } });
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget works with a DOM0 and two DOM2 listeners', t => {
	t.plan(3);
	t.context.xhr.addEventListener('load', () => t.pass());
	t.context.xhr.onload = () => t.pass();
	t.context.xhr.addEventListener('load', () => t.pass());
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget does not invoke a DOM0 listener for a different event', t => {
	t.plan(0);
	['onerror', 'onloadstart', 'onprogress', 'onabort', 'ontimeout', 'onloadend']
		.forEach(eventType => t.context.xhr[eventType] = () => t.pass());
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

test('XMLHttpRequestEventTarget does not invoke a DOM2 listener for a different event', t => {
	t.plan(0);
	['error', 'loadstart', 'progress', 'abort', 'timeout', 'loadend']
		.forEach(eventType => t.context.xhr.addEventListener(eventType, () => t.pass()));
	t.context.xhr.dispatchEvent(t.context.loadEvent);
});

// TODO:
//   * remove event listener from an event that had no listeners
//   * remove non-existent event listener from an event that had listeners
