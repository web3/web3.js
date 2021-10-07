export const validClients = [
    'http://localhost:8545',
    'http://www.localhost',
    'http://localhost',
    'http://foo.com',
    'http://foo.ninja',
    'https://foo.com',
    'http://foo.com:8545',
];

export const invalidClients = [
    'htt://localhost:8545',
    'http//localhost:8545',
    'ws://localhost:8545',
    '',
    null,
    undefined,
    42
];
