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

export const fullErrors: any[] = [
	{
		instancePath: '',
		schemaPath: '#/minItems',
		keyword: 'minItems',
		params: { limit: 1 },
		message: 'must NOT have fewer than 1 items',
	},
	{
		instancePath: '',
		schemaPath: '#/minItems',
		keyword: 'minItems',
		params: { limit: 2 },
		message: 'must NOT have fewer than 2 items',
	},
	{
		instancePath: '',
		schemaPath: '#/maxItems',
		keyword: 'maxItems',
		params: { limit: 1 },
		message: 'must NOT have more than 1 items',
	},
];

export const errorsWithInstanceNoParamsNoMessage: any[] = [
	{
		keyword: 'eth',
		instancePath: '/0',
		schemaPath: '#/items/0/eth',
	},
];

export const unspecifiedErrors: any[] = [{}];
