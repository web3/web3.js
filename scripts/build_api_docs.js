#!/usr/bin/env node
/* eslint-disable header/header */

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

// We only using `fs-extra` in the dev scripts
// eslint-disable-next-line import/no-extraneous-dependencies
const { ensureDir, emptyDir, pathExists } = require('fs-extra');
const { spawn } = require('child_process');
const { resolve } = require('path');
const { version } = require('../packages/web3/package.json');

const exec = (command, args, options) =>
	new Promise((resolve, reject) => {
		const process = spawn(command, args, { ...options, stdio: 'inherit', shell: true });

		process.on('error', reject);

		process.on('close', code => {
			if (code === 0) {
				resolve(code);
			} else {
				reject(code);
			}
		});
	});

(async () => {
	// Build the complete project.
	await exec('yarn', ['build']);

	// Build the api docs
	await exec('yarn', ['build:api:docs']);

	// Remove existing copy of API docs in temp directory
	await ensureDir('./docs/temp/api');
	await emptyDir('./docs/temp/api');

	// Copy API specs from all packages
	await exec('cp', ['packages/**/dist/*.api.json', 'docs/temp/api']);

	const apiDocsPath = resolve(`./docs/versioned_docs/version-${version}/api`);

	if (!(await pathExists(apiDocsPath))) {
		// Create documentation version
		await exec('yarn', ['run', 'docusaurus', 'docs:version', version], { cwd: './docs' });
	}

	// Copy API specs from all packages
	await exec('npx', ['api-documenter', 'markdown', '-i', './docs/temp/api', '-o', apiDocsPath]);

	// Strip out docs files to fix docusaurus parsing errors.
	console.info('Removing empty comments');
	await exec('sed', ['-i', '-e', "'s#<!-- -->##g'", '*.md'], { cwd: apiDocsPath });

	console.info('Changing bold tag with the markup sequence');
	await exec('sed', ['-i', '-e', "'s#<b>#**#g'", '*.md'], { cwd: apiDocsPath });
	await exec('sed', ['-i', '-e', "'s#</b>#**#g'", '*.md'], { cwd: apiDocsPath });

	console.info('Replacing \\_ sequence with _');
	await exec('sed', ['-i', '-e', "'s#\\_#_#g'", '*.md'], { cwd: apiDocsPath });
})().catch(console.error);
