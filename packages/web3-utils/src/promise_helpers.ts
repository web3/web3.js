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

import { isNullish } from 'web3-validator';

export type AsyncFunction<T, K = unknown> = (...args: K[]) => Promise<T>;

export function waitWithTimeout<T>(
	awaitable: Promise<T> | AsyncFunction<T>,
	timeout: number,
	error: Error,
): Promise<T>;
export function waitWithTimeout<T>(
	awaitable: Promise<T> | AsyncFunction<T>,
	timeout: number,
): Promise<T | undefined>;

/**
 * Wait for a promise but interrupt it if it did not resolve within a given timeout.
 * If the timeout reached, before the promise code resolve, either throw an error if an error object was provided, or return `undefined`.
 */
export async function waitWithTimeout<T>(
	awaitable: Promise<T> | AsyncFunction<T>,
	timeout: number,
	error?: Error,
): Promise<T | undefined> {
	let timeoutId: NodeJS.Timeout | undefined;
	const result = await Promise.race([
		awaitable instanceof Promise ? awaitable : awaitable(),
		new Promise<undefined | Error>((resolve, reject) => {
			timeoutId = setTimeout(() => (error ? reject(error) : resolve(undefined)), timeout);
		}),
	]);
	if (timeoutId) {
		clearTimeout(timeoutId);
	}
	if (result instanceof Error) {
		throw result;
	}
	return result;
}

export async function pollTillDefined<T>(
	func: AsyncFunction<T>,
	interval: number,
): Promise<Exclude<T, undefined>> {
	const awaitableRes = waitWithTimeout(func, interval);

	let intervalId: NodeJS.Timer | undefined;
	const polledRes = new Promise<Exclude<T, undefined>>((resolve, reject) => {
		intervalId = setInterval(() => {
			(async () => {
				try {
					const res = await waitWithTimeout(func, interval);

					if (!isNullish(res)) {
						clearInterval(intervalId);
						resolve(res as unknown as Exclude<T, undefined>);
					}
				} catch (error) {
					clearInterval(intervalId);
					reject(error);
				}
			})() as unknown;
		}, interval);
	});

	// If the first call to awaitableRes succeeded, return the result
	const res = await awaitableRes;
	if (!isNullish(res)) {
		if (intervalId) {
			clearInterval(intervalId);
		}
		return res as unknown as Exclude<T, undefined>;
	}

	return polledRes;
}

export function rejectIfTimeout(timeout: number, error: Error): [NodeJS.Timer, Promise<never>] {
	let timeoutId: NodeJS.Timer | undefined;
	const rejectOnTimeout = new Promise<never>((_, reject) => {
		timeoutId = setTimeout(() => {
			reject(error);
		}, timeout);
	});
	return [timeoutId as unknown as NodeJS.Timer, rejectOnTimeout];
}

export function rejectIfConditionAtInterval<T>(
	cond: AsyncFunction<T | undefined>,
	interval: number,
): [NodeJS.Timer, Promise<never>] {
	let intervalId: NodeJS.Timer | undefined;
	const rejectIfCondition = new Promise<never>((_, reject) => {
		intervalId = setInterval(() => {
			(async () => {
				const error = await cond();
				if (error) {
					clearInterval(intervalId);
					reject(error);
				}
			})() as unknown;
		}, interval);
	});
	return [intervalId as unknown as NodeJS.Timer, rejectIfCondition];
}
