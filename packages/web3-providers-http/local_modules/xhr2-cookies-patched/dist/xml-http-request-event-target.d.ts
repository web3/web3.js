import { ProgressEvent } from './progress-event';
export declare type ProgressEventListener = (event: ProgressEvent) => void;
export declare type ProgressEventListenerObject = {
    handleEvent(event: ProgressEvent): void;
};
export declare type ProgressEventListenerOrEventListenerObject = ProgressEventListener | ProgressEventListenerObject;
export declare class XMLHttpRequestEventTarget {
    onloadstart: ProgressEventListener | null;
    onprogress: ProgressEventListener | null;
    onabort: ProgressEventListener | null;
    onerror: ProgressEventListener | null;
    onload: ProgressEventListener | null;
    ontimeout: ProgressEventListener | null;
    onloadend: ProgressEventListener | null;
    private listeners;
    addEventListener(eventType: string, listener?: ProgressEventListenerOrEventListenerObject): void;
    removeEventListener(eventType: string, listener?: ProgressEventListenerOrEventListenerObject): void;
    dispatchEvent(event: ProgressEvent): boolean;
}
