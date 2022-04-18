export const getSystemTestAccounts = (): string[] =>
	JSON.parse(process.env.WEB3_SYSTEM_TEST_ACCOUNTS ?? '[]') as string[];

export const getSystemTestProvider = (): string => process.env.WEB3_SYSTEM_TEST_PROVIDER ?? '';

export const getSystemTestPassword = (): string => process.env.WEB3_SYSTEM_TEST_PASSWORD ?? '';

export const itIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? test : test.skip;

export const describeIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? describe : describe.skip;
