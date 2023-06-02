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
import { readFileSync, writeFileSync } from 'fs';

// eslint-disable-next-line import/no-cycle
import {
	ChangelogConfig,
	DEFAULT_CHANGELOG_CONFIG,
	ENTRY_SECTION_HEADERS,
	GroupedUnreleasedEntries,
} from './types';
// eslint-disable-next-line import/no-cycle
import { getListOfPackageNames } from './helpers';

export const getUnreleasedSection = (parsedChangelog: string[]) => {
	const unreleasedSectionHeaderIndex = parsedChangelog.findIndex(
		item => item === '## [Unreleased]',
	);
	const unreleasedSection = parsedChangelog.slice(unreleasedSectionHeaderIndex);
	return unreleasedSection;
};

const skipSection = (section: string, unreleasedSection: string[]): string[] => {
	const index = unreleasedSection.indexOf(section);
	if (index !== -1) {
		const nextSectionIndex = unreleasedSection.findIndex(
			(el, i) => el.startsWith('###') && i > index,
		);
		if (nextSectionIndex !== -1) {
			unreleasedSection.splice(index, nextSectionIndex - index);
		}
	}
	return unreleasedSection;
};

export const getRootGroupedUnreleasedEntries = (unreleasedSection: string[]) => {
	const groupedUnreleasedEntries: GroupedUnreleasedEntries = {};

	let lastPackageHeaderIndex = 0;
	let lastEntryHeaderIndex = 0;
	// skip '### Breaking Changes' section from unreleasedSection array
	// eslint-disable-next-line no-param-reassign
	unreleasedSection = skipSection('### Breaking Changes', unreleasedSection);

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

// @ts-expect-error 'commandName' is declared but its value is never read
export const syncChangelogs = (commandName: string, args?: string[]) => {
	const CHANGELOG_CONFIG: ChangelogConfig =
		args?.[0] !== undefined && args[0].endsWith('.json')
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
