export const processAsync = async (
	processFunc: (resolver: (value: unknown) => void) => Promise<unknown> | unknown,
) =>
	new Promise(resolve => {
		(async () => {
			await processFunc(resolve);
		})() as unknown;
	});

export const sleep = async (ms: number) =>
	new Promise(resolve => {
		const id = setTimeout(() => {
			resolve(true);
			clearTimeout(id);
		}, ms);
	});
