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

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Web3.js',
	tagline: 'The ultimate JavaScript library for Ethereum',
	url: 'https://docs.web3js.com',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'ChainSafe', // Usually your GitHub org/user name.
	projectName: 'web3.js', // Usually your repo name.

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	plugins: ['@docusaurus/theme-live-codeblock'],

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: 'https://github.com/ChainSafe/web3.js/tree/main/website/',
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
				title: 'Web3.js',
				logo: {
					alt: 'Logo',
					src: 'img/logo.svg',
				},
				items: [
					{
						to: 'docs/guides/intro',
						activeBasePath: 'docs',
						label: 'Guides',
						position: 'left',
					},
					{
						to: 'docs/api/', // 'api' is the 'out' directory
						activeBasePath: 'docs',
						label: 'API',
						position: 'left',
						sidebarPath: 'apiSidebar',
					},
					{
						href: 'https://github.com/ChainSafe/web3.js',
						label: 'GitHub',
						position: 'right',
					},

					// Right
					{
						type: 'docsVersionDropdown',
						position: 'right',
						dropdownActiveClassDisabled: true,
					},
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Docs',
						items: [
							{
								label: 'Guides',
								to: '/docs/guides/intro',
							},
						],
					},
					{
						title: 'Community',
						items: [
							{
								label: 'Stack Overflow',
								href: 'https://stackoverflow.com/questions/tagged/web3.js',
							},
							{
								label: 'Discord',
								href: 'https://discord.gg/uH8JRuv5',
							},
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Web3.js, Inc. Built with Docusaurus.`,
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
		}),
};

module.exports = config;
