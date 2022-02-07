export const validConnectionStrings = [
	'ws://localhost:8545',
	'ws://www.localhost',
	'ws://localhost',
	'wss://foo.com',
	'ws://foo.ninja',
	'wss://foo.com',
	'ws://foo.com:8545',
];

export const invalidConnectionStrings = [
	'htt://localhost:8545',
	'http//localhost:8545',
	'ipc://localhost:8545',
	'',
	null,
	undefined,
	42,
];

export const wsProviderOptions = {
	followRedirects: true,
	handshakeTimeout: 1500,
	maxRedirects: 3,
	perMessageDeflate: true,
};
