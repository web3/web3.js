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
import { readdirSync } from 'fs';

// eslint-disable-next-line import/no-cycle
import { Command, getCommands } from './types';

export const parseArgs = (commands: Command[] = getCommands()): unknown => {
	const commandArg = process.argv[2];
	for (const command of commands) {
		if (command.name === commandArg) {
			return command.commandFunction(command.name, process.argv.slice(3));
		}
	}

	// eslint-disable-next-line no-console
	console.log('Invalid command, please refer to below table for expected commands:');
	// eslint-disable-next-line no-console
	console.table(commands);
	return undefined;
};

export const getListOfPackageNames = (packagesDirectory: string) =>
	readdirSync(packagesDirectory, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
