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
export const packageUnreleasedSection = [
	'## [Unreleased]',
	'',
	'### Added',
	'',
	'-   random text (#425)',
	'',
	'### Removed',
	'',
	'-   `build` entry from `package.json` (#420)',
	'-   `bar` (#424)',
	'',
	'### Changed',
	'',
	'-   `tsc` compiled files moved to `lib/` directory from `dist/` (#421)',
	'-   `foo` (#423)',
	'',
];

export const parsedPackageChangelog = [
	'# Changelog',
	'',
	'All notable changes to this project will be documented in this file.',
	'',
	'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),',
	'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).',
	'',
	'<!-- EXAMPLE',
	'',
	'## [1.0.0]',
	'',
	'### Added',
	'',
	"- I've added feature XY (#1000)",
	'',
	'### Changed',
	'',
	"- I've cleaned up XY (#1000)",
	'',
	'### Deprecated',
	'',
	"- I've deprecated XY (#1000)",
	'',
	'### Removed',
	'',
	"- I've removed XY (#1000)",
	'',
	'### Fixed',
	'',
	"- I've fixed XY (#1000)",
	'',
	'### Security',
	'',
	"- I've improved the security in XY (#1000)",
	'',
	'-->',
	'',
	'## [4.0.0-alpha.1]',
	'',
	'### Breaking Changes',
	'',
	'#### Connection close is not supported',
	'',
	'In `1.x` user had access to raw connection object and can interact with it. e.g.',
	'',
	'```ts',
	'web3.currentProvider.connection.close();',
	'```',
	'',
	'But this internal behavior is not exposed any further. Though you can achieve same with this approach.',
	'',
	'```ts',
	'web3.currentProvider.disconnect();',
	'```',
	'',
	'## [4.0.1-alpha.2]',
	'',
	'### Changed',
	'',
	'-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)',
	'',
	'## [4.0.1-alpha.5]',
	'',
	'### Removed',
	'',
	'-   `build` entry from `package.json` (#5755)',
	'',
	...packageUnreleasedSection,
];

export const packageGroupedUnreleasedEntries = {
	'### Added': ['-   random text (#425)'],
	'### Removed': ['-   `build` entry from `package.json` (#420)', '-   `bar` (#424)'],
	'### Changed': [
		'-   `tsc` compiled files moved to `lib/` directory from `dist/` (#421)',
		'-   `foo` (#423)',
	],
};
