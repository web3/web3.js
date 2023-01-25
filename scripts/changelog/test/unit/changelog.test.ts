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

import * as Changelog from '../../changelog';
import {
	mockParsedPackageChangelog,
	mockPackageUnreleasedSection,
	mockPackageGroupedUnreleasedEntries,
} from '../fixtures/mock_package_parsed_changelog';
import {
	mockRootFlattenedSyncedUnreleasedEntries,
	mockRootGroupedUnreleasedEntries,
	mockRootSyncedChangelog,
	mockRootSyncedGroupedUnreleasedEntries,
	mockRootUnreleasedSection,
} from '../fixtures/mock_root_parsed_changelog';
import TestChangelogConfig from './test_changelog_config.json';

describe('Changelog script tests', () => {
	let listOfPackageNames: string[];

	beforeAll(() => {
		listOfPackageNames = Changelog.getListOfPackageNames(
			'./scripts/changelog/test/fixtures/mock_packages_directory',
		);
	});

	it('should get list of directory names in ../fixtures/mock_packages_directory', () => {
		expect(listOfPackageNames).toEqual(['mock-package-1', 'mock-package-2', 'mock-package-3']);
	});

	it('should get package unreleased section', () => {
		const result = Changelog.getUnreleasedSection(mockParsedPackageChangelog);
		expect(result).toEqual(mockPackageUnreleasedSection);
	});

	it('should get root grouped unreleased entries', () => {
		const result = Changelog.getRootGroupedUnreleasedEntries(mockRootUnreleasedSection);
		expect(result).toEqual(mockRootGroupedUnreleasedEntries);
	});

	it('should get package grouped unreleased entries', () => {
		const result = Changelog.getPackageGroupedUnreleasedEntries(mockPackageUnreleasedSection);
		expect(result).toEqual(mockPackageGroupedUnreleasedEntries);
	});

	it('should get synced grouped unreleased entries', () => {
		const result = Changelog.getSyncedGroupedUnreleasedEntries(
			listOfPackageNames,
			TestChangelogConfig,
			mockRootGroupedUnreleasedEntries,
		);
		expect(result).toEqual(mockRootSyncedGroupedUnreleasedEntries);
	});

	it('should flatten synced unreleased entries', () => {
		const syncedGroupedUnreleasedEntries = Changelog.getSyncedGroupedUnreleasedEntries(
			listOfPackageNames,
			TestChangelogConfig,
			mockRootGroupedUnreleasedEntries,
		);
		const result = Changelog.flattenSyncedUnreleasedEntries(
			syncedGroupedUnreleasedEntries,
			listOfPackageNames,
		);
		expect(result).toEqual(mockRootFlattenedSyncedUnreleasedEntries);
	});

	it('should sync all package CHANGELOGs with root CHANGELOG.md', () => {
		copyFileSync(
			'./scripts/changelog/test/fixtures/mock_root_unsynced_CHANGELOG.tmpl',
			TestChangelogConfig.rootChangelogPath,
		);

		Changelog.syncChangelogs(['./scripts/changelog/test/unit/test_changelog_config.json']);

		const parsedRootChangelog = readFileSync(
			TestChangelogConfig.rootChangelogPath,
			'utf8',
		).split(/\n/);
		expect(parsedRootChangelog).toEqual(mockRootSyncedChangelog);

		unlinkSync(TestChangelogConfig.rootChangelogPath);
	});
});
