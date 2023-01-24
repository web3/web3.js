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
	commandFunction: (args?: string[]) => any;
}

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
	const unreleasedSection = parsedChangelog.splice(unreleasedSectionHeaderIndex);
	return unreleasedSection;
};

export const getRootGroupedUnreleasedEntries = (unreleasedSection: string[]) => {
	const groupedUnreleasedEntries: Record<string, Record<string, string[]>> = {};

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

export const syncChangelogs = (args?: string[]) => {
	const CHANGELOG_CONFIG: ChangelogConfig =
		// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
		args !== undefined && args[0] !== undefined && args[0].endsWith('.json')
			? (JSON.parse(readFileSync(args[0], 'utf8')) as ChangelogConfig)
			: DEFAULT_CHANGELOG_CONFIG;

	const parsedRootChangelog = readFileSync(CHANGELOG_CONFIG.rootChangelogPath, 'utf8').split(
		/\n/,
	);
	const rootGroupedUnreleasedEntries = getRootGroupedUnreleasedEntries(
		getUnreleasedSection(parsedRootChangelog),
	);
	writeFileSync('./foo.json', JSON.stringify(rootGroupedUnreleasedEntries));

	// TODO Remove after debugging
	// eslint-disable-next-line no-unreachable-loop
	for (const packageName of getListOfPackageNames(CHANGELOG_CONFIG.packagesDirectoryPath)) {
		const parsedChangelog = readFileSync(
			`${CHANGELOG_CONFIG.packagesDirectoryPath}/${packageName}/${CHANGELOG_CONFIG.packagesChangelogPath}`,
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

				if (rootGroupedUnreleasedEntries[formattedEntrySectionHeader] === undefined) {
					// Root CHANGELOG.md is missing formattedEntrySectionHeader
					rootGroupedUnreleasedEntries[formattedEntrySectionHeader] = {};
				}

				if (
					rootGroupedUnreleasedEntries[formattedEntrySectionHeader][
						formattedPackageEntryHeader
					] === undefined
				) {
					// Root CHANGELOG.md is missing formattedPackageEntryHeader for formattedEntrySectionHeader
					rootGroupedUnreleasedEntries[formattedEntrySectionHeader][
						formattedPackageEntryHeader
					] = packageGroupedUnreleasedEntries[formattedEntrySectionHeader];
				} else {
					for (const packageEntry of packageGroupedUnreleasedEntries[
						formattedEntrySectionHeader
					]) {
						if (
							!rootGroupedUnreleasedEntries[formattedEntrySectionHeader][
								formattedPackageEntryHeader
							].includes(packageEntry)
						) {
							rootGroupedUnreleasedEntries[formattedEntrySectionHeader][
								formattedPackageEntryHeader
							].push(packageEntry);
						}
					}
				}
			}
		}
		// console.log(rootGroupedUnreleasedEntries);
		break;
	}
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

const parseArgs = (): any => {
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
