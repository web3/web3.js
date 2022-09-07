const config = {
	screenshotOnRunFailure: false,
	video: false,
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.js')(on, config);
		},
		specPattern: 'test/integration/**/**/*.test.ts',
	},
};

if (process.env.WEB3_SYSTEM_TEST_ENGINE === 'firefox') {
	const port = parseInt(String(Math.random() * 10000 + 10000));
	config.clientCertificates = [
		{
			url: 'https://web3.js',
			certs: [
				{
					cert: './cypress/.cert/cert.pem',
					key: './cypress/.cert/key.pem',
				},
			],
		},
	];
	config.e2e.port = port;
	config.e2e.hosts = {
		'web3.js': '127.0.0.1',
	};
	config.e2e.baseUrl = `https://web3.js:${port}`;
}
module.exports = config;
