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
import { TestClient, TestEngine } from './types';

/**
 * Get the env variable from Cypress if it exists or node process
 */
export function getEnv<ExpectedValue extends string>(name: string): ExpectedValue {
	// @ts-expect-error Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const env = global.Cypress ? Cypress.env(name) : process.env[name];
	if (env === undefined) throw new Error(`Env ${name} is undefined`);
	return env
}

export const getTestClient = () => getEnv<TestClient>('WEB3_TEST_CLIENT');
export const getTestEngine = () => getEnv<TestEngine>('WEB3_TEST_ENGINE');
export const getTestProvider = () => getEnv('WEB3_TEST_PROVIDER');
export const getTestMnemonic = () => getEnv('WEB3_TEST_MNEMONIC');
