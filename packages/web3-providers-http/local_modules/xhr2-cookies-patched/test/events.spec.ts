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
	dripUrl: `http://localhost:${HttpServer.port}/_/drip`,
	dripJson: {drips: 3, size: 1000, ms: 50, length: true},
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

test('level 2 events for a successful fetch with Content-Length set', async t => {
	let endFired = false;
	let intermediateProgressFired = false;
	const xhr = t.context.xhr;
	
	await new Promise(resolve => {
		['loadstart', 'progress', 'load', 'loadend', 'error', 'abort'].forEach(addCheckedEvent);
		xhr.addEventListener('loadend', () => {
			endFired = true;
			resolve();
		});
		xhr.addEventListener('error', () => resolve());
		
		xhr.open('POST', t.context.dripUrl);
		xhr.send(JSON.stringify(t.context.dripJson));
	});
	
	t.true(intermediateProgressFired, 'at least one intermediate progress event was fired');
	
	function addCheckedEvent(eventType: string) {
		xhr.addEventListener(eventType, event => {
			t.is(event.type, eventType, `event type is ${eventType}`);
			t.is(event.target, xhr, 'event has correct target');
			t.false(endFired, 'end is not fired');
			t.false(event.bubbles, 'event does not bubble');
			t.false(event.cancelable, 'event is not cancelable');
			
			switch (eventType) {
			case 'loadstart':
				t.is(event.loaded, 0, 'on loadstart loaded = 0');
				t.false(event.lengthComputable, 'on loadstart length is not computable');
				t.is(event.total, 0, 'on loadstart event total is 0');
				break;
			case 'load':
			case 'loadend':
				t.is(event.loaded, 3000, 'on load/loadend loaded = 3000');
				t.true(event.lengthComputable, 'on load/loadend length is computable');
				t.is(event.total, 3000, 'on load/loadend event total is 0');
				break;
			case 'progress':
				t.true(event.loaded >= 0, 'on progress: loaded >= 0');
				t.true(event.loaded <= 3000, 'on progress: loaded <= 3000');
				if (event.lengthComputable) {
					t.is(event.total, 3000, 'on progress event when length is computable total is 3000');
				} else {
					t.is(event.total, 0, 'on progress event when length is not computable total is 0');
				}
				if (event.loaded > 0 && event.loaded < 3000) { intermediateProgressFired = true; }
				break;
			}
		})
	}
});

test('level 2 events for a successful fetch without Content-Length set', async t => {
	let endFired = false;
	let intermediateProgressFired = false;
	const xhr = t.context.xhr;
	t.context.dripJson = {...t.context.dripJson, length: false};
	
	await new Promise(resolve => {
		['loadstart', 'progress', 'load', 'loadend', 'error', 'abort'].forEach(addCheckedEvent);
		xhr.addEventListener('loadend', () => {
			endFired = true;
			resolve();
		});
		
		xhr.open('POST', t.context.dripUrl);
		xhr.send(JSON.stringify(t.context.dripJson));
	});
	
	t.true(intermediateProgressFired, 'at least one intermediate progress event was fired');
	
	function addCheckedEvent(eventType: string) {
		xhr.addEventListener(eventType, event => {
			t.is(event.type, eventType, `event type is ${eventType}`);
			t.is(event.target, xhr, 'event has correct target');
			t.false(endFired, 'end is not fired');
			t.false(event.bubbles, 'event does not bubble');
			t.false(event.cancelable, 'event is not cancelable');
			t.false(event.lengthComputable, 'length is not computable');
			t.is(event.total, 0, 'when length is not computable total is 0');
			
			switch (eventType) {
			case 'loadstart':
				t.is(event.loaded, 0, 'on loadstart loaded = 0');
				break;
			case 'load':
			case 'loadend':
				t.is(event.loaded, 3000, 'on load/loadend loaded = 3000');
				break;
			case 'progress':
				t.true(event.loaded >= 0, 'on progress: loaded >= 0');
				t.true(event.loaded <= 3000, 'on progress: loaded <= 3000');
				if (event.loaded > 0 && event.loaded < 3000) { intermediateProgressFired = true; }
				break;
			}
		})
	}
});

test('level 2 events for a network error due to bad DNS', async t => {
	let errorFired = false;
	const xhr = t.context.xhr;
	
	await new Promise(resolve => {
		['loadstart', 'progress', 'load', 'loadend', 'error', 'abort'].forEach(addCheckedEvent);
		xhr.addEventListener('loadend', () => resolve());
		
		xhr.open('GET', 'https://broken.to.cause.an.xhrnetworkerror.com.a.com');
		xhr.send();
	});
	
	t.true(errorFired, 'an error event was fired');
	
	function addCheckedEvent(eventType: string) {
		xhr.addEventListener(eventType, () => {
			switch (eventType) {
			case 'load':
			case 'progress':
				t.fail();
				break;
			case 'error':
				errorFired = true;
				break;
			}
		})
	}
});

test('readystatechange for a successful fetch with Content-Length set', async t => {
	let doneFired = false;
	const xhr = t.context.xhr;
	const states = [];
	
	await new Promise(resolve => {
		xhr.addEventListener('readystatechange', event => {
			t.is(event.type, 'readystatechange', 'event type is correct');
			t.false(doneFired, 'no readystatechange events after DONE');
			t.is(event.target, xhr, 'event has correct target');
			t.false(event.bubbles, 'event does not bubble');
			t.false(event.cancelable, 'event is not cancelable');
			
			states.push((event.target as XMLHttpRequest).readyState);
			if ((event.target as XMLHttpRequest).readyState === XMLHttpRequest.DONE) {
				doneFired = true;
				resolve();
			}
		});
		xhr.open('POST', t.context.dripUrl);
		xhr.send(JSON.stringify(t.context.dripJson));
	});
	
	t.deepEqual(states, [
		XMLHttpRequest.OPENED,
		XMLHttpRequest.HEADERS_RECEIVED,
		XMLHttpRequest.LOADING,
		XMLHttpRequest.DONE
	], 'right order of ready states');
});

test('readystatechange for a successful fetch without Content-Length set', async t => {
	let doneFired = false;
	const xhr = t.context.xhr;
	const states = [];
	t.context.dripJson = {...t.context.dripJson, length: false};
	
	await new Promise(resolve => {
		xhr.addEventListener('readystatechange', event => {
			t.is(event.type, 'readystatechange', 'event type is correct');
			t.false(doneFired, 'no readystatechange events after DONE');
			t.is(event.target, xhr, 'event has correct target');
			t.false(event.bubbles, 'event does not bubble');
			t.false(event.cancelable, 'event is not cancelable');
			t.false(event.lengthComputable, 'length is not computable');
			t.is(event.total, 0, 'when length is not computable total is 0');
			
			states.push((event.target as XMLHttpRequest).readyState);
			if ((event.target as XMLHttpRequest).readyState === XMLHttpRequest.DONE) {
				doneFired = true;
				resolve();
			}
		});
		xhr.open('POST', t.context.dripUrl);
		xhr.send(JSON.stringify(t.context.dripJson));
	});
	
	t.deepEqual(states, [
		XMLHttpRequest.OPENED,
		XMLHttpRequest.HEADERS_RECEIVED,
		XMLHttpRequest.LOADING,
		XMLHttpRequest.DONE
	], 'right order of ready states');
});

test('readystatechange for a network error due to bad DNS', async t => {
	const xhr = t.context.xhr;
	const states = [];
	
	await new Promise(resolve => {
		xhr.addEventListener('readystatechange', event => {
			t.is(event.type, 'readystatechange', 'event type is correct');
			t.is(event.target, xhr, 'event has correct target');
			t.false(event.bubbles, 'event does not bubble');
			t.false(event.cancelable, 'event is not cancelable');
			
			states.push((event.target as XMLHttpRequest).readyState);
			if ((event.target as XMLHttpRequest).readyState === XMLHttpRequest.DONE) {
				resolve();
			}
		});
		xhr.open('GET', 'https://broken.to.cause.an.xhrnetworkerror.com.a.com');
		xhr.send();
	});
	
	t.deepEqual(states, [
		XMLHttpRequest.OPENED,
		XMLHttpRequest.DONE
	], 'right order of ready states');
});
