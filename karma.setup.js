import * as jest from 'jest-mock';
// import expect from 'expect';
// window.test = window.it;
window.it.each = inputs => async (testName, test) => {
	for (const inp of inputs) {
		window.it(testName, async () => await test(...inp));
	}
};
window.jest = jest;
// window.expect = expect;
global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
window.setImmediate = global.setImmediate;
