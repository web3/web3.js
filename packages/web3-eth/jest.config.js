module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'web3-utils(.*)$': '<rootDir>/../web3-utils/src/$1'
  },
};