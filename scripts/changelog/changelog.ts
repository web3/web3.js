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
import { readdirSync, readFileSync, writeFileSync } from 'fs';

export interface ChangelogConfig {
	packagesDirectoryPath: string;
	packagesChangelogPath: string;
	rootChangelogPath: string;
}

interface Command {
	name: string;
	description: string;
	arguments: string[];
	example: string;
	commandFunction: (args?: string[]) => unknown;
}

type GroupedUnreleasedEntries = Record<string, Record<string, string[]>>;

const DEFAULT_CHANGELOG_CONFIG = {
	packagesDirectoryPath: './packages',
	packagesChangelogPath: 'CHANGELOG.md',
	rootChangelogPath: './CHANGELOG.md',
};
const ENTRY_SECTION_HEADERS = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];

export const getListOfPackageNames = (packagesDirectory: string) =>
	readdirSync(packagesDirectory, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

export const getUnreleasedSection = (parsedChangelog: string[]) => {
	const unreleasedSectionHeaderIndex = parsedChangelog.findIndex(
		item => item === '## [Unreleased]',
	);
	const unreleasedSection = parsedChangelog.slice(unreleasedSectionHeaderIndex);
	return unreleasedSection;
};

export const getRootGroupedUnreleasedEntries = (unreleasedSection: string[]) => {
	const groupedUnreleasedEntries: GroupedUnreleasedEntries = {};

	let lastPackageHeaderIndex = 0;
	let lastEntryHeaderIndex = 0;
	for (const [index, item] of unreleasedSection.entries()) {
		// substring(4) removes "### " from entry headers (e.g. "### Changed" -> "Changed")
		if (ENTRY_SECTION_HEADERS.includes(item.substring(4))) {
			groupedUnreleasedEntries[unreleasedSection[index]] = {};
			lastEntryHeaderIndex = index;
		} else if (item.startsWith('#### ')) {
			groupedUnreleasedEntries[unreleasedSection[lastEntryHeaderIndex]][item] = [];
			lastPackageHeaderIndex = index;
		} else if (item.startsWith('-')) {
			const entryHeader = unreleasedSection[lastEntryHeaderIndex];
			const packageHeader = unreleasedSection[lastPackageHeaderIndex];
			groupedUnreleasedEntries[entryHeader][packageHeader].push(item);
		}
	}

	return groupedUnreleasedEntries;
};

export const getPackageGroupedUnreleasedEntries = (unreleasedSection: string[]) => {
	const groupedUnreleasedEntries: Record<string, string[]> = {};

	let lastEntryHeaderIndex = 0;
	for (const [index, item] of unreleasedSection.entries()) {
		// substring(4) removes "### " from entry headers (e.g. "### Changed" -> "Changed")
		if (ENTRY_SECTION_HEADERS.includes(item.substring(4))) {
			groupedUnreleasedEntries[item] = [];
			lastEntryHeaderIndex = index;
		} else if (item.startsWith('-   ')) {
			const entryHeader = unreleasedSection[lastEntryHeaderIndex];
			groupedUnreleasedEntries[entryHeader].push(item);
		}
	}

	return groupedUnreleasedEntries;
};

export const getSyncedGroupedUnreleasedEntries = (
	listOfPackageNames: string[],
	changelogConfig: ChangelogConfig,
	rootGroupedUnreleasedEntries: GroupedUnreleasedEntries,
) => {
	const _rootGroupedUnreleasedEntries: GroupedUnreleasedEntries = rootGroupedUnreleasedEntries;
	for (const packageName of listOfPackageNames) {
		const parsedChangelog = readFileSync(
			`${changelogConfig.packagesDirectoryPath}/${packageName}/${changelogConfig.packagesChangelogPath}`,
			'utf8',
		).split(/\n/);
		const packageGroupedUnreleasedEntries = getPackageGroupedUnreleasedEntries(
			getUnreleasedSection(parsedChangelog),
		);

		for (const entrySectionHeader of ENTRY_SECTION_HEADERS) {
			const formattedEntrySectionHeader = `### ${entrySectionHeader}`;
			const formattedPackageEntryHeader = `#### ${packageName}`;

			const packageEntrySection =
				packageGroupedUnreleasedEntries[formattedEntrySectionHeader];
			if (packageEntrySection !== undefined) {
				// PackageName has a formattedEntrySectionHeader listed in packageName/CHANGELOG.md

				if (_rootGroupedUnreleasedEntries[formattedEntrySectionHeader] === undefined) {
					// Root CHANGELOG.md is missing formattedEntrySectionHeader
					_rootGroupedUnreleasedEntries[formattedEntrySectionHeader] = {};
				}

				_rootGroupedUnreleasedEntries[formattedEntrySectionHeader][
					formattedPackageEntryHeader
				] = packageGroupedUnreleasedEntries[formattedEntrySectionHeader];
			}
		}
	}

	return _rootGroupedUnreleasedEntries;
};

export const flattenSyncedUnreleasedEntries = (
	syncedGroupedUnreleasedEntries: GroupedUnreleasedEntries,
	listOfPackageNames: string[],
) => {
	const flattenedSyncedUnreleasedEntries: string[] = [];
	for (const key of Object.keys(syncedGroupedUnreleasedEntries)) {
		const element = syncedGroupedUnreleasedEntries[key];
		flattenedSyncedUnreleasedEntries.push(key);
		flattenedSyncedUnreleasedEntries.push('');
		for (const packageName of listOfPackageNames) {
			const formattedPackageEntryHeader = `#### ${packageName}`;
			const element2 = element[formattedPackageEntryHeader];
			if (element[formattedPackageEntryHeader] !== undefined) {
				flattenedSyncedUnreleasedEntries.push(formattedPackageEntryHeader);
				flattenedSyncedUnreleasedEntries.push('');
				flattenedSyncedUnreleasedEntries.push(...element2);
				flattenedSyncedUnreleasedEntries.push('');
			}
		}
	}

	return flattenedSyncedUnreleasedEntries;
};

export const syncChangelogs = (args?: string[]) => {
	const CHANGELOG_CONFIG: ChangelogConfig =
		// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
		args !== undefined && args[0] !== undefined && args[0].endsWith('.json')
			? (JSON.parse(readFileSync(args[0], 'utf8')) as ChangelogConfig)
			: DEFAULT_CHANGELOG_CONFIG;
	const parsedRootChangelog = readFileSync(CHANGELOG_CONFIG.rootChangelogPath, 'utf8').split(
		/\n/,
	);
	const listOfPackageNames = getListOfPackageNames(CHANGELOG_CONFIG.packagesDirectoryPath);
	const syncedGroupedUnreleasedEntries = getSyncedGroupedUnreleasedEntries(
		listOfPackageNames,
		CHANGELOG_CONFIG,
		getRootGroupedUnreleasedEntries(getUnreleasedSection(parsedRootChangelog)),
	);
	const flattenedSyncedUnreleasedEntries = flattenSyncedUnreleasedEntries(
		syncedGroupedUnreleasedEntries,
		listOfPackageNames,
	);

	// +2 is so the header, ## [Unreleased], and the newline after it don't get removed
	parsedRootChangelog.splice(
		parsedRootChangelog.findIndex(item => item === '## [Unreleased]') + 2,
	);
	parsedRootChangelog.push(...flattenedSyncedUnreleasedEntries);
	writeFileSync(CHANGELOG_CONFIG.rootChangelogPath, parsedRootChangelog.join('\n'));
};

const COMMANDS: Command[] = [
	// {
	// 	name: '[packageName]',
	// 	description:
	// 		'Updates the CHANGELOG.md for packageName with specified changelogHeader and changelogEntry',
	// 	arguments: ['changelogHeader', 'changelogEntry'],
	// 	example: 'yarn changelog [packageName] [changelogHeader] [changelogEntry]',
	// 	commandFunction: () => {},
	// },
	{
		name: 'sync',
		description:
			'Checks CHANGELOG.md for each package in ./packages/ for entries not included in root CHANGELOG.md',
		arguments: [],
		example: 'sync',
		commandFunction: syncChangelogs,
	},
];

const parseArgs = (): unknown => {
	const commandArg = process.argv[2];
	for (const command of COMMANDS) {
		if (command.name === commandArg) {
			return command.commandFunction(process.argv.slice(3));
		}
	}

	// eslint-disable-next-line no-console
	console.log('Invalid command, please refer to below table for expected commands:');
	// eslint-disable-next-line no-console
	console.table(COMMANDS);
	return undefined;
};

parseArgs();
