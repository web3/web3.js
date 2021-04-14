module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'web3-internal-base(.*)$': '<rootDir>/../web3-internal-base/src/$1'
  },
};