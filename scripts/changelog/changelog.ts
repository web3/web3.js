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

const _getListOfPackageNames = () =>
	readdirSync('./packages', { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

type SectionHeader = 'Added' | 'Changed' | 'Deprecated' | 'Removed' | 'Fixed' | 'Security';
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
		.parse();
})();
