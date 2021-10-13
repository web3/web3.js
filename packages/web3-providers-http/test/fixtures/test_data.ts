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

export const mockBeaconBlockHeaderResponse = {
	data: {
		root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
		canonical: true,
		header: {
			message: {
				slot: '1',
				proposer_index: '1',
				parent_root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
				state_root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
				body_root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
			},
			signature:
				'0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
		},
	},
};
