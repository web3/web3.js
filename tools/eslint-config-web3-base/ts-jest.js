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
module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'jest'],
	extends: ['./ts', 'plugin:jest/recommended', 'plugin:jest/style'],
	env: {
		'jest/globals': true,
	},
	rules: {
		'jest/valid-title': ['error'],
		'jest/no-conditional-expect': ['error'],
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'jest/consistent-test-it': ['error'],
		'class-methods-use-this': ['error'],
		'@typescript-eslint/no-magic-numbers': 'off',
		'@typescript-eslint/unbound-method': 'off',
		'@typescript-eslint/no-require-imports': ['error'],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-call': ['error'],
		'@typescript-eslint/no-unsafe-return': ['error'],
		'@typescript-eslint/no-empty-function': ['error'],
		'@typescript-eslint/ban-types': 'warn',
		'@typescript-eslint/require-await': ['warn'],
		'@typescript-eslint/restrict-template-expressions': ['warn'],
		'dot-notation': 'off',
		'lines-between-class-members': 'off',
		'arrow-body-style': 'off',
		'no-underscore-dangle': 'off',
	},
};
