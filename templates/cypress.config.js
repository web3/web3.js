module.exports = {
	screenshotOnRunFailure: false,
	video: false,
	clientCertificates: [
		{
			url: 'https://web3.js',
			certs: [
				{
					cert: './cypress/.cert/cert.pem',
					key: './cypress/.cert/key.pem',
				},
			],
		},
	],
	e2e: {
		port: 8888,
		baseUrl: 'https://localhost:8888',
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.js')(on, config);
		},
		specPattern: 'test/integration/**/**/*.test.ts',
	},
};
