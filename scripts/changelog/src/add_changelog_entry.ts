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
import { ChangelogConfig, DEFAULT_CHANGELOG_CONFIG } from './types';
import { getPackageGroupedUnreleasedEntries, getUnreleasedSection } from './sync';

export const addChangelogEntry = (commandName: string, args: string[]) => {
	let CHANGELOG_CONFIG: ChangelogConfig;
	if (args?.[0] !== undefined && args[0].endsWith('.json')) {
		CHANGELOG_CONFIG = JSON.parse(readFileSync(args[0], 'utf8')) as ChangelogConfig;
		args.shift();
	} else {
		CHANGELOG_CONFIG = DEFAULT_CHANGELOG_CONFIG;
	}

	const [packageName, changelogEntry] = args;
	const parsedChangelog = readFileSync(
		`${CHANGELOG_CONFIG.packagesDirectoryPath}/${packageName}/${CHANGELOG_CONFIG.packagesChangelogPath}`,
		'utf8',
	).split(/\n/);
	const groupedUnreleasedEntries = getPackageGroupedUnreleasedEntries(
		getUnreleasedSection(parsedChangelog),
	);
	const formattedCommandName = `### ${
		commandName.charAt(0).toUpperCase() + commandName.slice(1)
	}`;
	const formattedChangelogEntry = `-   ${changelogEntry}`;

	if (groupedUnreleasedEntries[formattedCommandName] !== undefined) {
		groupedUnreleasedEntries[formattedCommandName].push(formattedChangelogEntry);
	} else {
		groupedUnreleasedEntries[formattedCommandName] = [formattedChangelogEntry];
	}

	const flattenedModifiedUnreleasedEntries: string[] = [];
	for (const entryHeader of Object.keys(groupedUnreleasedEntries)) {
		const entries = groupedUnreleasedEntries[entryHeader];
		flattenedModifiedUnreleasedEntries.push(entryHeader);
		flattenedModifiedUnreleasedEntries.push('');
		for (const [index, entry] of entries.entries()) {
			flattenedModifiedUnreleasedEntries.push(entry);
			if (index + 1 === entries.length) flattenedModifiedUnreleasedEntries.push('');
		}
	}

	// +2 is so the header, ## [Unreleased], and the newline after it don't get removed
	parsedChangelog.splice(parsedChangelog.findIndex(item => item === '## [Unreleased]') + 2);
	parsedChangelog.push(...flattenedModifiedUnreleasedEntries);
	writeFileSync(
		`${CHANGELOG_CONFIG.packagesDirectoryPath}/${packageName}/${CHANGELOG_CONFIG.packagesChangelogPath}`,
		parsedChangelog.join('\n'),
	);
};
