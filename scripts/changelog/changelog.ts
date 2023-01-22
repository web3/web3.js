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
// eslint-disable-next-line import/no-extraneous-dependencies
import yargs from 'yargs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hideBin } from 'yargs/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies
import inquirer from 'inquirer';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from 'chalk';

type SectionHeader = 'Added' | 'Changed' | 'Deprecated' | 'Removed' | 'Fixed' | 'Security';
const SECTION_HEADERS = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];

const _getListOfPackageNames = () =>
	readdirSync('./packages', { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

const _addEntry = async (sectionHeader: SectionHeader, args: Record<string, unknown>) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { packageName }: { packageName: string } = await inquirer.prompt([
		{
			type: 'list',
			name: 'packageName',
			message: 'Which package would you like to add your entry to?',
			choices: _getListOfPackageNames(),
		},
	]);
	const filePath = `./packages/${packageName}/CHANGELOG.md`;

	// eslint-disable-next-line no-console
	console.log(`Adding entry under ${sectionHeader} section in ${filePath}`);

	const parsedChangelog = readFileSync(filePath, 'utf8').split(/\n/);
	const unreleasedHeaderIndex = parsedChangelog.findIndex(item => item === '## [Unreleased]');
	const unreleasedSection = parsedChangelog.splice(unreleasedHeaderIndex);

	let sectionHeaderIndex = unreleasedSection.findIndex(item => item === `### ${sectionHeader}`);
	if (sectionHeaderIndex === -1) {
		unreleasedSection.push(...[`### ${sectionHeader}`, '']);
	}
	sectionHeaderIndex = unreleasedSection.findIndex(item => item === `### ${sectionHeader}`);

	// Contains desired section, but could still contain other sections
	const desiredSection = unreleasedSection.slice(sectionHeaderIndex);
	// Remove any sections after desiredSection
	const nextSectionHeaderIndex = desiredSection
		.slice(1)
		.findIndex(item => item.startsWith('### '));
	if (nextSectionHeaderIndex !== -1) desiredSection.splice(nextSectionHeaderIndex);

	const newEntry = `-   ${args.entry as string}`;
	// If last line in desiredSection is a new line, add newEntry before it
	if (desiredSection.length > 2 && desiredSection[desiredSection.length - 1] === '') {
		desiredSection.splice(desiredSection.length - 1, 0, ...[newEntry, '']);
		// If desiredSection only contains sectionHeader and a new line, add newEntry and
		// a new line after
	} else if (desiredSection.length === 2) {
		desiredSection.push(...[newEntry, '']);
	} else desiredSection.push(newEntry);

	// Replace existing desiredSection with modified version
	unreleasedSection.splice(sectionHeaderIndex, desiredSection.length - 1, ...desiredSection);

	// Replace existing Unreleased section with modified version
	parsedChangelog.splice(unreleasedHeaderIndex, 0, ...unreleasedSection);

	writeFileSync(filePath, parsedChangelog.join('\n'));
};

const _getRootGroupedSectionEntryItems = () => {
	const parsedRootChangelog = readFileSync('./CHANGELOG.md', 'utf8').split(/\n/);
	const rootUnreleasedHeaderIndex = parsedRootChangelog.findIndex(
		item => item === '## [Unreleased]',
	);
	const rootUnreleasedSection = parsedRootChangelog.splice(rootUnreleasedHeaderIndex);

	const rootUnreleasedSectionHeaderIndices = [];
	for (const [unreleasedEntryIndex, unreleasedEntry] of rootUnreleasedSection.entries()) {
		if (SECTION_HEADERS.includes(unreleasedEntry.replace(/###\s/, '')))
			rootUnreleasedSectionHeaderIndices.push(unreleasedEntryIndex);
	}

	const rootUnreleasedSections = [];
	for (const [index, sectionHeaderIndex] of rootUnreleasedSectionHeaderIndices.entries()) {
		const section = rootUnreleasedSection.slice(
			sectionHeaderIndex,
			rootUnreleasedSectionHeaderIndices[index + 1],
		);
		rootUnreleasedSections.push(section);
	}

	const rootUnreleasedSectionEntries: Record<string, Record<string, string[]>> = {};
	for (const rootUnreleasedSectionEntry of rootUnreleasedSections) {
		const sectionEntryItemHeaderIndices = [];
		const sectionEntryItemsIndices = [];
		for (const [
			sectionEntryItemIndex,
			sectionEntryItem,
		] of rootUnreleasedSectionEntry.entries()) {
			if (sectionEntryItem.startsWith('#### web3'))
				sectionEntryItemHeaderIndices.push(sectionEntryItemIndex);
			else if (sectionEntryItem.startsWith('- '))
				sectionEntryItemsIndices.push(sectionEntryItemIndex);
		}

		const groupedSectionEntryItems: Record<string, string[]> = {};
		for (const sectionEntryItemHeaderIndex of sectionEntryItemHeaderIndices) {
			const sectionEntryItems = [];
			for (const sectionEntryItemIndex of sectionEntryItemsIndices) {
				sectionEntryItems.push(rootUnreleasedSectionEntry[sectionEntryItemIndex]);
			}

			groupedSectionEntryItems[rootUnreleasedSectionEntry[sectionEntryItemHeaderIndex]] =
				sectionEntryItems;
			rootUnreleasedSectionEntries[rootUnreleasedSectionEntry[0]] = groupedSectionEntryItems;
		}
	}

	return rootUnreleasedSectionEntries;
};

const _getPackageGroupedUnreleasedSectionEntryItems = (packageName: string) => {
	const filePath = `./packages/${packageName}/CHANGELOG.md`;
	const parsedChangelog = readFileSync(filePath, 'utf8').split(/\n/);
	const unreleasedHeaderIndex = parsedChangelog.findIndex(item => item === '## [Unreleased]');
	const unreleasedSection = parsedChangelog.splice(unreleasedHeaderIndex);

	const sectionHeaderIndices = [];
	for (const [unreleasedEntryIndex, unreleasedEntry] of unreleasedSection.entries()) {
		if (SECTION_HEADERS.includes(unreleasedEntry.replace(/###\s/, '')))
			sectionHeaderIndices.push(unreleasedEntryIndex);
	}

	const packageUnreleasedSections = [];
	for (const [index, sectionHeaderIndex] of sectionHeaderIndices.entries()) {
		const section = unreleasedSection.slice(
			sectionHeaderIndex,
			sectionHeaderIndices[index + 1],
		);
		packageUnreleasedSections.push(section);
	}

	const packageGroupedSectionEntryItems: Record<string, string[]> = {};
	for (const packageUnreleasedSection of packageUnreleasedSections) {
		const sectionEntryItems = [];
		for (const sectionEntryItem of packageUnreleasedSection) {
			if (sectionEntryItem.startsWith('- ')) sectionEntryItems.push(sectionEntryItem);
		}

		packageGroupedSectionEntryItems[packageUnreleasedSection[0]] = sectionEntryItems;
	}

	return packageGroupedSectionEntryItems;
};

const _unSyncedReport = (
	whatsMissing: Record<string, Record<string, string[]>>,
	verbose = false,
) => {
	let totalMissingEntryItems = 0;
	const packagesWithMissingEntryItems: string[] = [];

	for (const sectionHeader of Object.keys(whatsMissing)) {
		for (const packageName of Object.keys(whatsMissing[sectionHeader])) {
			totalMissingEntryItems += whatsMissing[sectionHeader][packageName].length;
			if (!packagesWithMissingEntryItems.includes(packageName))
				packagesWithMissingEntryItems.push(packageName);
		}
	}

	// eslint-disable-next-line no-console
	console.log(
		`Root CHANGELOG.md is ${chalk.red('missing')} ${chalk.yellow(
			`${totalMissingEntryItems} total changes`,
		)}, from ${chalk.yellow(`${packagesWithMissingEntryItems.length} packages`)}`,
	);
	// eslint-disable-next-line no-console
	if (verbose) console.log(whatsMissing);
};

const _checkForUnSyncedChanges = (args: Record<string, unknown>) => {
	const whatsMissing: Record<string, Record<string, string[]>> = {};
	const rootGroupedUnreleasedSectionEntries = _getRootGroupedSectionEntryItems();

	for (const packageName of _getListOfPackageNames()) {
		const packageGroupedUnreleasedSectionEntries =
			_getPackageGroupedUnreleasedSectionEntryItems(packageName);

		for (const sectionHeader of SECTION_HEADERS) {
			const formattedSectionHeader = `### ${sectionHeader}`;
			if (packageGroupedUnreleasedSectionEntries[formattedSectionHeader] !== undefined) {
				if (rootGroupedUnreleasedSectionEntries[formattedSectionHeader] === undefined) {
					whatsMissing[sectionHeader] = {
						...whatsMissing[sectionHeader],
						[packageName]:
							packageGroupedUnreleasedSectionEntries[formattedSectionHeader],
					};

					// add section header and package entries
				} else if (
					rootGroupedUnreleasedSectionEntries[formattedSectionHeader][
						`#### ${packageName}`
					] === undefined
				) {
					whatsMissing[sectionHeader] = {
						...whatsMissing[sectionHeader],
						[packageName]:
							packageGroupedUnreleasedSectionEntries[formattedSectionHeader],
					};

					// add package header and entries to existing root section
				} else {
					for (const packageSectionEntryItem of packageGroupedUnreleasedSectionEntries[
						formattedSectionHeader
					]) {
						if (
							!rootGroupedUnreleasedSectionEntries[formattedSectionHeader][
								`#### ${packageName}`
							].includes(packageSectionEntryItem)
						) {
							whatsMissing[sectionHeader] = {
								...whatsMissing[sectionHeader],
								[packageName]: [
									// ...whatsMissing[sectionHeader][packageName],
									packageSectionEntryItem,
								],
							};
						}
					}

					// check existing section for all package entries
				}
			}
		}
	}

	_unSyncedReport(whatsMissing, args.verbose as boolean);
};

// const _sync = () => {

// }

(() => {
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	yargs(hideBin(process.argv))
		.command(
			'added [entry]',
			"Used to add an entry to a specified package's CHANGELOG under the Added section",
			_yargs =>
				_yargs.positional('entry', {
					describe: 'The entry to be added to the CHANGELOG',
				}),
			async argv => {
				await _addEntry('Added', argv);
			},
		)
		.command(
			'changed [entry]',
			"Used to add an entry to a specified package's CHANGELOG under the Changed section",
			_yargs =>
				_yargs.positional('entry', {
					describe: 'The entry to be added to the CHANGELOG',
				}),
			async argv => {
				await _addEntry('Changed', argv);
			},
		)
		.command(
			'deprecated [entry]',
			"Used to add an entry to a specified package's CHANGELOG under the Deprecated section",
			_yargs =>
				_yargs.positional('entry', {
					describe: 'The entry to be added to the CHANGELOG',
				}),
			async argv => {
				await _addEntry('Deprecated', argv);
			},
		)
		.command(
			'removed [entry]',
			"Used to add an entry to a specified package's CHANGELOG under the Removed section",
			_yargs =>
				_yargs.positional('entry', {
					describe: 'The entry to be added to the CHANGELOG',
				}),
			async argv => {
				await _addEntry('Removed', argv);
			},
		)
		.command(
			'fixed [entry]',
			"Used to add an entry to a specified package's CHANGELOG under the Fixed section",
			_yargs =>
				_yargs.positional('entry', {
					describe: 'The entry to be added to the CHANGELOG',
				}),
			async argv => {
				await _addEntry('Fixed', argv);
			},
		)
		.command(
			'security [entry]',
			"Used to add an entry to a specified package's CHANGELOG under the Security section",
			_yargs =>
				_yargs.positional('entry', {
					describe: 'The entry to be added to the CHANGELOG',
				}),
			async argv => {
				await _addEntry('Security', argv);
			},
		)
		.command(
			'check-sync',
			'Used to check for changes listed in packages/ CHANGELOGs but not root CHANGELOG',
			_yargs =>
				_yargs.option('verbose', {
					alias: 'v',
					// type: boolean,
					describe: "Provide detailed log of what's missing from root CHANGELOG",
				}),
			argv => {
				_checkForUnSyncedChanges(argv);
			},
		)
		// .command(
		// 	'sync',
		// 	'Used to combine all CHANGELOGs found in packages/ into the root CHANGELOG',
		// 	{},
		// 	async () => {
		// 		await _checkForUnSyncedChanges();
		// 	},
		// )
		.parse();
})();
