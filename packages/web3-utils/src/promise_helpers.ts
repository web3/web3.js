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

export async function waitWithTimeout<T>(
	awaitable: Promise<T>,
	timeout: number,
	error?: Error,
): Promise<T | undefined> {
	const x = new Promise<undefined | Error>((resolve, reject) => {
		setTimeout(() => (error ? reject(error) : resolve(undefined)), timeout);
	});
	const result = await Promise.race([awaitable, x]);
	if (result instanceof Error) {
		throw result;
	}
	return result;
}
