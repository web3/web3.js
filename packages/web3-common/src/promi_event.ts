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

import { Web3EventEmitter, Web3EventMap } from './web3_event_emitter';

export type PromiseExecutor<T> = (
	resolve: (data: T) => void,
	reject: (reason: unknown) => void,
) => void;

export class PromiEvent<ResolveType, EventMap extends Web3EventMap>
	extends Web3EventEmitter<EventMap>
	implements Promise<ResolveType>
{
	private readonly _promise: Promise<ResolveType>;

	public constructor(executor: PromiseExecutor<ResolveType>) {
		super();
		this._promise = new Promise<ResolveType>(executor);
	}

	// public tag to treat object as promise by different libs
	public [Symbol.toStringTag]: 'Promise';

	public async then<TResult1 = ResolveType, TResult2 = never>(
		onfulfilled?: ((value: ResolveType) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
	): Promise<TResult1 | TResult2> {
		return this._promise.then(onfulfilled, onrejected);
	}

	public async catch<TResult = never>(
		onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
	): Promise<ResolveType | TResult> {
		return this._promise.catch(onrejected);
	}

	public async finally(onfinally?: (() => void) | null): Promise<ResolveType> {
		return this._promise.finally(onfinally);
	}
}
