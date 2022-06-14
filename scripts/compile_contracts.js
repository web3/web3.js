#!/usr/bin/env node

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

/* eslint-disable header/header */
/* eslint-disable @typescript-eslint/no-var-requires */

const { promisify } = require('util');
const { resolve } = require('path');
const { compile } = require('solc');
const { rm, readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');

const rmPromise = promisify(rm);

// Fetch path of build
const buildPath = resolve(__dirname, '../fixtures/build');
const contractsPath = resolve(__dirname, '../fixtures/contracts');
const importDir = resolve(__dirname, '../node_modules');

function findImports(path) {
	const importPath = resolve(importDir, path);

	if (existsSync(importPath)) {
		return {
			contents: readFileSync(importPath, 'utf8'),
		};
	}

	return { error: 'File not found' };
}

(async () => {
	try {
		await rmPromise(buildPath, { recursive: true });
	} catch (error) {
		// Ignore if directory does not exists
		if (error.code !== 'ENOENT') {
			throw error;
		}
	}

	// Fetch all Contract files in Contracts folder
	const fileNames = readdirSync(contractsPath);

	// Gets ABI of all contracts into variable input
	const input = fileNames.reduce(
		(previousValue, fileName) => {
			const filePath = resolve(contractsPath, fileName);
			const source = readFileSync(filePath, 'utf8');

			return { sources: { ...previousValue.sources, [fileName]: { content: source } } };
		},
		{ sources: {} },
	);

	const compileInput = {
		...input,
		language: 'Solidity',
		settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } },
	};

	const compileResult = JSON.parse(
		compile(JSON.stringify(compileInput), { import: findImports }),
	);
	if (compileResult.errors) {
		console.error(compileResult.errors);
		console.log('Error while compiling');
	}
	// Compile all contracts
	const output = compileResult.contracts;

	// Re-Create build folder for output files from each contract
	mkdirSync(buildPath);

	console.log(output);

	// Output contains all objects from all contracts
	// Write the contents of each to different files
	for (let contract in output) {
		const contractName = contract.replace('.sol', '');
		const contractBuild = output[contract][contractName];

		if (!contractBuild || (contractBuild && !contractBuild['abi'])) {
			continue;
		}

		const contractTsInterface = `export const ${contractName}Abi = ${JSON.stringify(
			contractBuild['abi'],
		)} as const; \n export const ${contractName}Bytecode = '0x${
			contractBuild['evm']['bytecode']['object']
		}';`;

		writeFileSync(
			resolve(buildPath, contractName + '.json'),
			JSON.stringify(contractBuild, null, '\t'),
		);
		writeFileSync(resolve(buildPath, contractName + '.ts'), contractTsInterface);
	}

	console.info('Compiled successfully');
	process.exit(0);
})().catch(console.error);
