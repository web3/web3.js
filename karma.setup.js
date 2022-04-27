import * as jest from 'jest-mock';
import expect from 'expect';
// window.test = window.it;
// window.test.each = inputs => async (testName, test) => {
// 	for (const inp of inputs) {
// 		await window.it(testName, async () => await test(...args));
// 	}
// };
window.jest = jest;
// window.expect = expect;
global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
window.setImmediate = global.setImmediate;
