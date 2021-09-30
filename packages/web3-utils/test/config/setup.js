// Have to use `require` because of Jest issue https://jestjs.io/docs/ecmascript-modules
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('jest-extended');

// @todo extend jest to have "toHaveBeenCalledOnceWith" matcher.

process.env.NODE_ENV = 'test';
