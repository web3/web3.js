const utils = require('./helpers/test.utils');
const gatewayServer = require('./helpers/ccipReadServer').default;
const Web3 = utils.getWeb3();
var Token = require('./sources/Token');

const assert = require('assert');

