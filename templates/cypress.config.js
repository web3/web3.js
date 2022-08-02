const port = parseInt(Math.random() * 40000 + 10000);
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
		port,
		baseUrl: `https://localhost:${port}`,
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.js')(on, config);
		},
		specPattern: 'test/integration/**/**/*.test.ts',
	},
};
