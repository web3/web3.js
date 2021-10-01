// Have to use `require` because of Jest issue https://jestjs.io/docs/ecmascript-modules
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('../config/setup');

const jestTimeout = 15000;

jest.setTimeout(jestTimeout);
