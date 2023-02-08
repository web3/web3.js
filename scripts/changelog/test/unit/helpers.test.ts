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
import { getListOfPackageNames, parseArgs } from '../../src/helpers';
import { Command } from '../../src/types';

describe('Changelog Helpers tests', () => {
	const mockCommandFunction = jest.fn();
	const mockCommandFunction2 = jest.fn();
	const commands: Command[] = [
		{
			name: 'mockCommand',
			description: 'mockCommand',
			arguments: [],
			example: 'mockCommand',
			commandFunction: mockCommandFunction,
		},
		{
			name: 'mockCommand2',
			description: 'mockCommand2',
			arguments: ['argument1', 'argument2'],
			example: 'mockCommand2',
			commandFunction: mockCommandFunction2,
		},
	];

	it('should parse args and execute mockCommandFunction with no arguments', () => {
		process.argv = ['', '', 'mockCommand'];
		parseArgs(commands);

		expect(commands[0].commandFunction).toHaveBeenCalledWith('mockCommand', []);
	});

	it('should parse args and execute mockCommandFunction2 with two arguments', () => {
		const expectedArguments = ['arg1', 'arg2'];
		process.argv = ['', '', 'mockCommand2', ...expectedArguments];
		parseArgs(commands);

		expect(commands[1].commandFunction).toHaveBeenCalledWith('mockCommand2', expectedArguments);
	});

	it('should parse args, not execute either commandFunctions, and call console.log and console.table', () => {
		// eslint-disable-next-line no-console
		console.log = jest.fn();
		// eslint-disable-next-line no-console
		console.table = jest.fn();
		process.argv = ['', ''];

		parseArgs(commands);

		expect(commands[0].commandFunction).not.toHaveBeenCalledWith();
		expect(commands[1].commandFunction).not.toHaveBeenCalledWith();
		// eslint-disable-next-line no-console
		expect(console.log).toHaveBeenLastCalledWith(
			'Invalid command, please refer to below table for expected commands:',
		);
		// eslint-disable-next-line no-console
		expect(console.table).toHaveBeenCalledWith(commands);
	});

	it('should get list of directory names in ../fixtures/mock_packages_directory', () => {
		const result = getListOfPackageNames(
			'./scripts/changelog/test/fixtures/mock_packages_directory',
		);
		expect(result).toEqual(['mock-package-1', 'mock-package-2', 'mock-package-3']);
	});
});
