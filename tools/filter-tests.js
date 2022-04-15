/* eslint-disable @typescript-eslint/no-unsafe-call */
module.exports = testPaths => {
	const conditions = ['ipc'];
	const allowedTests = testPaths
		.filter(file => !conditions.some(con => file.includes(con)))
		.map(path => {
			return { test: path };
		});
	return {
		filtered: allowedTests,
	};
};
