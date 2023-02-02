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

import { addChangelogEntry } from '../../src/add_changelog_entry';
import { getListOfPackageNames } from '../../src/helpers';
import TestChangelogConfig from './test_changelog_config.json';
import ModifiedTestChangelogConfig from './test_changelog_config_for_add_changelog_entry_tests.json';
import ExpectedModifiedChangelog from '../fixtures/mock_packages_directory/mock-package-1/expected_modified_CHANGELOG.json';
import ExpectedModifiedChangelog2 from '../fixtures/mock_packages_directory/mock-package-1/expected_modified_CHANGELOG_2.json';

describe('Add Changelog Entry tests', () => {
	it('should add an entry under the Added header`', () => {
		const listOfPackageNames = getListOfPackageNames(TestChangelogConfig.packagesDirectoryPath);

		copyFileSync(
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${TestChangelogConfig.packagesChangelogPath}`,
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${ModifiedTestChangelogConfig.packagesChangelogPath}`,
		);

		addChangelogEntry('added', [
			'./scripts/changelog/test/unit/test_changelog_config_for_add_changelog_entry_tests.json',
			listOfPackageNames[0],
			'Some new change (#42)',
		]);

		const parsedModifiedChangelog = readFileSync(
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${ModifiedTestChangelogConfig.packagesChangelogPath}`,
			'utf8',
		).split(/\n/);
		expect(parsedModifiedChangelog).toEqual(ExpectedModifiedChangelog);

		unlinkSync(
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${ModifiedTestChangelogConfig.packagesChangelogPath}`,
		);
	});

	it('should add the header Newheader and add an entry under it`', () => {
		const listOfPackageNames = getListOfPackageNames(TestChangelogConfig.packagesDirectoryPath);

		copyFileSync(
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${TestChangelogConfig.packagesChangelogPath}`,
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${ModifiedTestChangelogConfig.packagesChangelogPath}`,
		);

		addChangelogEntry('newheader', [
			'./scripts/changelog/test/unit/test_changelog_config_for_add_changelog_entry_tests.json',
			listOfPackageNames[0],
			'Some new change (#42)',
		]);

		const parsedModifiedChangelog = readFileSync(
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${ModifiedTestChangelogConfig.packagesChangelogPath}`,
			'utf8',
		).split(/\n/);
		expect(parsedModifiedChangelog).toEqual(ExpectedModifiedChangelog2);

		unlinkSync(
			`${TestChangelogConfig.packagesDirectoryPath}/${listOfPackageNames[0]}/${ModifiedTestChangelogConfig.packagesChangelogPath}`,
		);
	});
});
