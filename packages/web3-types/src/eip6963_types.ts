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

import type { Web3APISpec } from './web3_api_types.js';
import type { EIP1193Provider } from './web3_base_provider.js';

export interface EIP6963ProviderInfo {
	uuid: string;
	name: string;
	icon: string;
	rdns: string;
}

export interface EIP6963ProviderDetail<API = Web3APISpec> {
	info: EIP6963ProviderInfo;
	provider: EIP1193Provider<API>;
}

export type EIP6963ProviderResponse = Map<string, EIP6963ProviderDetail>;

export interface EIP6963ProvidersMapUpdateEvent extends CustomEvent {
	type: string;
	detail: EIP6963ProviderResponse;
}
