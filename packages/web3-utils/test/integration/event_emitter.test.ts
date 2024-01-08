/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { EventEmitter } from '../../src/event_emitter';

describe('EventEmitter in the browser with Cypress', () => {
	let emitter: EventEmitter;

	beforeEach(() => {
		emitter = new EventEmitter();
	});

	describe('on', () => {
		it('should add a listener for the specified event', () => {
			const callback = jest.fn();
			emitter.on('test', callback);
			emitter.emit('test', 'hello');
			expect(callback).toHaveBeenCalledWith('hello');
		});
	});

	describe('once', () => {
		it('should add a listener for the specified event that is only called once', () => {
			const callback = jest.fn();
			emitter.once('test', callback);
			emitter.emit('test', 'hello');
			emitter.emit('test', 'world');
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith('hello');
		});
	});

	describe('off', () => {
		it('should remove a listener for the specified event', () => {
			const callback = jest.fn();
			emitter.on('test', callback);
			emitter.off('test', callback);
			emitter.emit('test', 'hello');
			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe('emit', () => {
		it('should call all listeners for the specified event', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();
			emitter.on('test', callback1);
			emitter.on('test', callback2);
			emitter.emit('test', 'hello');
			expect(callback1).toHaveBeenCalledWith('hello');
			expect(callback2).toHaveBeenCalledWith('hello');
		});
	});

	describe('listenerCount', () => {
		it('should return the number of listeners for the specified event', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();
			emitter.on('test', callback1);
			emitter.on('test', callback2);
			expect(emitter.listenerCount('test')).toBe(2);
		});
	});

	describe('listeners', () => {
		it('should return an array of listeners for the specified event', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();
			emitter.on('test', callback1);
			emitter.on('test', callback2);
			expect(emitter.listeners('test')).toEqual([callback1, callback2]);
		});
	});

	describe('eventNames', () => {
		it('should return an array of event names that have listeners', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();
			emitter.on('test1', callback1);
			emitter.on('test2', callback2);
			expect(emitter.eventNames()).toEqual(['test1', 'test2']);
		});
	});

	describe('removeAllListeners', () => {
		it('should remove all listeners for all events', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();
			emitter.on('test1', callback1);
			emitter.on('test2', callback2);
			emitter.removeAllListeners();
			emitter.emit('test1', 'hello');
			emitter.emit('test2', 'world');
			expect(callback1).not.toHaveBeenCalled();
			expect(callback2).not.toHaveBeenCalled();
		});
	});

	describe('setMaxListeners', () => {
		it('should set the maximum number of listeners for an event', () => {
			emitter.setMaxListeners(2);
			expect(emitter.getMaxListeners()).toBe(2);
		});
	});
});
