import { XMLHttpRequestEventTarget } from './xml-http-request-event-target';
export declare class ProgressEvent {
    type: string;
    bubbles: boolean;
    cancelable: boolean;
    target: XMLHttpRequestEventTarget;
    loaded: number;
    lengthComputable: boolean;
    total: number;
    constructor(type: string);
}
