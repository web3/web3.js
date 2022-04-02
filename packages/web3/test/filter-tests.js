module.exports = testPaths => {
	const allowedTests = testPaths
		.filter(file => !file.includes('ipc'))
		.map(path => {
			return { test: path };
		});
	return {
		filtered: allowedTests,
	};
};
