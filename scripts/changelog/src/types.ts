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
// eslint-disable-next-line import/no-cycle
import { syncChangelogs } from './sync';

export interface ChangelogConfig {
	packagesDirectoryPath: string;
	packagesChangelogPath: string;
	rootChangelogPath: string;
}

export interface Command {
	name: string;
	description: string;
	arguments: string[];
	example: string;
	commandFunction: (args?: string[]) => unknown;
}

export type GroupedUnreleasedEntries = Record<string, Record<string, string[]>>;

export const DEFAULT_CHANGELOG_CONFIG = {
	packagesDirectoryPath: './packages',
	packagesChangelogPath: 'CHANGELOG.md',
	rootChangelogPath: './CHANGELOG.md',
};

export const ENTRY_SECTION_HEADERS = [
	'Added',
	'Changed',
	'Deprecated',
	'Removed',
	'Fixed',
	'Security',
];

export const COMMANDS: Command[] = [
	{
		name: 'sync',
		description:
			'Checks CHANGELOG.md for each package in ./packages/ for entries not included in root CHANGELOG.md',
		arguments: [],
		example: 'sync',
		commandFunction: syncChangelogs,
	},
	{
		name: ENTRY_SECTION_HEADERS.join(' || ').toLocaleLowerCase(),
		description:
			'Updates the CHANGELOG.md for packageName with specified changelogHeader and changelogEntry',
		arguments: ['packageName', 'changelogEntry'],
		example: 'yarn changelog [changelogHeader] [packageName] [changelogEntry]',
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		commandFunction: () => {},
	},
];
