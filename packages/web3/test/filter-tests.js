module.exports = testPaths => {
	let conditions = ['ipc'];
	const allowedTests = testPaths
		.filter(file => !conditions.some(con => file.includes('ipc')))
		.map(path => {
			return { test: path };
		});
	console.log('**********\n', allowedTests);
	return {
		filtered: allowedTests,
	};
};
