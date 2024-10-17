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

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
const { join } = require('path');

const packages = [
	'web3',
	'web3-eth',
	'web3-eth-contract',
	'web3-utils',
	'web3-validator',
	'web3-types',
	'web3-core',
	'web3-errors',
	'web3-net',
	'web3-eth-abi',
	'web3-eth-accounts',
	'web3-eth-ens',
	'web3-eth-iban',
	'web3-eth-personal',
	'web3-providers-http',
	'web3-providers-ws',
	'web3-providers-ipc',
	'web3-account-abstraction',
];

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Web3.js',
	tagline: 'Powerful TypeScript libraries for Ethereum interaction and utility functions',
	url: 'https://docs.web3js.org',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'throw',
	favicon: 'img/favicon.ico',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'ChainSafe', // Usually your GitHub org/user name.
	projectName: 'Web3.js', // Usually your repo name.

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	plugins: [
		'@docusaurus/theme-live-codeblock',
		[
			'docusaurus-plugin-typedoc-api',
			{
				projectRoot: join(__dirname, '..'),
				// Monorepo
				packages: packages.map(p => `packages/${p}`),
				minimal: false,
				debug: true,
				changelogs: true,
				readmes: false,
				tsconfigName: 'docs/tsconfig.docs.json',
				typedocOptions: {
					plugin: [
						'typedoc-monorepo-link-types',
						'typedoc-plugin-extras',
						'typedoc-plugin-mdn-links',
					],
				},
			},
		],
		'docusaurus-lunr-search',
	],
	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					routeBasePath: '/', // Serve the docs at the site's root
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: 'https://github.com/web3/web3.js/tree/4.x/docs',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			navbar: {
				title: 'Web3.js Docs',
				logo: {
					src: 'img/web3js.svg',
				},
				items: [
					{
						to: '/guides/getting_started/quickstart',
						activeBasePath: '/guides',
						label: 'Guides & Tutorials',
						position: 'left',
					},
					{
						to: '/libdocs/ABI',
						activeBasePath: '/libdocs',
						label: 'Packages',
						position: 'left',
					},
					{
						to: '/api', // 'api' is the 'out' directory
						label: 'API',
						position: 'left',
					},
					{
						to: '/glossary',
						activeBasePath: '/glossary',
						label: 'Glossary',
						position: 'left',
					},
					{
						to: '/web3_playground',
						label: 'Playground',
						position: 'right',
					},
					{
						href: 'https://github.com/ChainSafe/web3.js/tree/4.x/',
						label: 'GitHub',
						position: 'right',
					},
					{
						href: 'https://web3js.org/#/',
						label: 'Web3js.org',
						position: 'right',
					},
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Community',
						items: [
							{
								label: 'Stack Overflow',
								href: 'https://stackoverflow.com/questions/tagged/web3js',
							},
							{
								label: 'Discord',
								href: 'https://discord.com/invite/pb3U4zE8ca',
							},
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Web3.js . Built with Docusaurus.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
			liveCodeBlock: {
				/**
				 * The position of the live playground, above or under the editor
				 * Possible values: "top" | "bottom"
				 */
				playgroundPosition: 'bottom',
			},
			image: 'https://pbs.twimg.com/profile_images/1746099108937363456/duG_Pqem_400x400.jpg',
			metadata: [
				{
					name: 'keywords',
					content:
						'web3.js, web3, web3js, ethereum, ethereum json rpc, blockchain development, smart contracts, dapps, dApp development',
				},
				{
					name: 'description',
					content:
						'Collection of comprehensive TypeScript libraries for Interaction with the Ethereum JSON RPC API and utility functions.',
				},
				{ name: 'og:title', content: 'Web3.js Documentation' },
				{
					name: 'og:description',
					content:
						'Collection of comprehensive TypeScript libraries for Interaction with the Ethereum JSON RPC API and utility functions.',
				},
				{ name: 'og:type', content: 'website' },
				{ name: 'og:url', content: 'https://docs.web3js.org' },
				{
					name: 'og:image',
					content:
						'https://pbs.twimg.com/profile_images/1746099108937363456/duG_Pqem_400x400.jpg',
				},
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:title', content: 'Web3.js Documentation' },
				{
					name: 'twitter:description',
					content:
						'Official documentation for web3.js, the Type/JavaScript library for interacting with the Ethereum blockchain.',
				},
				{
					name: 'twitter:image',
					content:
						'https://raw.githubusercontent.com/web3/web3.js/4.x/assets/logo/web3js.jpg',
				},
			],
		}),
};

module.exports = config;
