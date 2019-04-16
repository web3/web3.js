const Web3 = require('..');
const TestSuite = require('./generic-tests');
const nodes = [
    {host: 'ganache', protocols: [
        {protocol: 'http', port: 8545},
    ]},
    {host: 'geth', protocols: [
        {protocol: 'http', port: 8545},
        {protocol: 'ws', port: 8546}
    ]},
    {host: 'parity', protocols: [
        {protocol: 'http', port: 8545},
        {protocol: 'ws', port: 8546}
    ]}
]
describe('Web3 e2e tests', () => {
    for(const node of nodes) {
        const {protocols, host} = node;
        for(const {protocol, port} of protocols) {
            TestSuite(protocol, host, port);
        }
    }
});
