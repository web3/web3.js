// Simple check to make sure window.web3 is defined for the karma min loading tests
describe('window.web3 is defined', function () {

  // Referencing `process` throws w/out browserify.
  // We want to be skipped during the browserified units tests here.
  try { if (process) return } catch (e) {}

  if (!window.Web3) throw new Error('"window.Web3" was not defined');
})
