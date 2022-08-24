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

export function waitWithTimeout<T>(
	awaitable: Promise<T>,
	timeout: number,
	error: Error,
): Promise<T>;
export function waitWithTimeout<T>(awaitable: Promise<T>, timeout: number): Promise<T | undefined>;

/**
 * Wait for a promise but interrupt it if it did not resolve within a given timeout.
 * If the timeout reached, before the promise code resolve, either throw an error if an error object was provided, or return `undefined`.
 */
export async function waitWithTimeout<T>(
	awaitable: Promise<T>,
	timeout: number,
	error?: Error,
): Promise<T | undefined> {
	let timeoutId: NodeJS.Timeout | undefined;
	const result = await Promise.race([
		awaitable,
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
