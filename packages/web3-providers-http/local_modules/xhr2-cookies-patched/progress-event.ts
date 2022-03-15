import { XMLHttpRequestEventTarget } from './xml-http-request-event-target';

export class ProgressEvent {
	bubbles = false;
	cancelable = false;
	target: XMLHttpRequestEventTarget;
	loaded = 0;
	lengthComputable = false;
	total = 0;
	
	constructor (public type: string) {}
}
