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
import { copyFileSync, readFileSync, unlinkSync } from 'fs';

import {
	flattenSyncedUnreleasedEntries,
	getPackageGroupedUnreleasedEntries,
	getRootGroupedUnreleasedEntries,
	getSyncedGroupedUnreleasedEntries,
	getUnreleasedSection,
	syncChangelogs,
} from '../../src/sync';
import { getListOfPackageNames } from '../../src/helpers';
import {
	parsedPackageChangelog,
	packageUnreleasedSection,
	packageGroupedUnreleasedEntries,
} from '../fixtures/package_parsed_changelog';
import {
	rootFlattenedSyncedUnreleasedEntries,
	rootGroupedUnreleasedEntries,
	rootSyncedChangelog,
	rootSyncedGroupedUnreleasedEntries,
	rootUnreleasedSection,
} from '../fixtures/root_parsed_changelog';
import TestChangelogConfig from './test_changelog_config.json';

describe('Changelog Sync tests', () => {
	let listOfPackageNames: string[];

	beforeAll(() => {
		listOfPackageNames = getListOfPackageNames(
			'./scripts/changelog/test/fixtures/mock_packages_directory',
		);
	});

	it('should get package unreleased section', () => {
		const result = getUnreleasedSection(parsedPackageChangelog);
		expect(result).toEqual(packageUnreleasedSection);
	});

	it('should get root grouped unreleased entries', () => {
		const result = getRootGroupedUnreleasedEntries(rootUnreleasedSection);
		expect(result).toEqual(rootGroupedUnreleasedEntries);
	});

	it('should get package grouped unreleased entries', () => {
		const result = getPackageGroupedUnreleasedEntries(packageUnreleasedSection);
		expect(result).toEqual(packageGroupedUnreleasedEntries);
	});

	it('should get synced grouped unreleased entries', () => {
		const result = getSyncedGroupedUnreleasedEntries(
			listOfPackageNames,
			TestChangelogConfig,
			rootGroupedUnreleasedEntries,
		);
		expect(result).toEqual(rootSyncedGroupedUnreleasedEntries);
	});

	it('should flatten synced unreleased entries', () => {
		const syncedGroupedUnreleasedEntries = getSyncedGroupedUnreleasedEntries(
			listOfPackageNames,
			TestChangelogConfig,
			rootGroupedUnreleasedEntries,
		);
		const result = flattenSyncedUnreleasedEntries(
			syncedGroupedUnreleasedEntries,
			listOfPackageNames,
		);
		expect(result).toEqual(rootFlattenedSyncedUnreleasedEntries);
	});

	it('should sync all package CHANGELOGs with root CHANGELOG.md', () => {
		copyFileSync(
			'./scripts/changelog/test/fixtures/root_unsynced_CHANGELOG.tmpl',
			TestChangelogConfig.rootChangelogPath,
		);

		syncChangelogs('sync', ['./scripts/changelog/test/unit/test_changelog_config.json']);

		const parsedRootChangelog = readFileSync(
			TestChangelogConfig.rootChangelogPath,
			'utf8',
		).split(/\n/);
		expect(parsedRootChangelog).toEqual(rootSyncedChangelog);

		unlinkSync(TestChangelogConfig.rootChangelogPath);
	});
});
