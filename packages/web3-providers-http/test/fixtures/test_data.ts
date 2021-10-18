export const validClients = [
	'http://localhost:8545',
	'http://www.localhost',
	'http://localhost',
	'http://foo.com',
	'http://foo.ninja',
	'https://foo.com',
	'http://foo.com:8545',
];

export const invalidClients = [
	'htt://localhost:8545',
	'http//localhost:8545',
	'ws://localhost:8545',
	'',
	null,
	undefined,
	/* eslint-disable @typescript-eslint/no-magic-numbers */
	42,
];

export const httpProviderOptions = {
	providerOptions: {
		body: null,
		cache: 'force-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		integrity: 'foo',
		keepalive: true,
		method: 'GET',
		mode: 'same-origin',
		redirect: 'error',
		referrer: 'foo',
		referrerPolicy: 'same-origin',
		signal: null,
		window: null,
	} as RequestInit,
};

export const mockGetBalanceResponse = {
	id: 1,
	jsonrpc: '2.0',
	result: '0x0234c8a3397aab58', // 158972490234375000
};
