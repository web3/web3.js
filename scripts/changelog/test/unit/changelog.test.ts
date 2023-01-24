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
import * as Changelog from '../../changelog';
import {
	mockParsedPackageChangelog,
	mockPackageUnreleasedSection,
	mockPackageGroupedUnreleasedEntries,
} from '../fixtures/mock_parsed_package_changelog';
import {
	mockRootGroupedUnreleasedEntries,
	mockRootUnreleasedSection,
} from '../fixtures/mock_parsed_root_changelog';

describe('Changelog script tests', () => {
	it('should get list of directory names in ../fixtures/mock_packages_directory', () => {
		const result = Changelog.getListOfPackageNames(
			'./scripts/changelog/test/fixtures/mock_packages_directory',
		);
		expect(result).toEqual(['mock-package-1', 'mock-package-2', 'mock-package-3']);
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

	it('should sync all package CHANGELOGs with root CHANGELOG.md', () => {
		Changelog.syncChangelogs(['./scripts/changelog/test/unit/test_changelog_config.json']);
	});
});
