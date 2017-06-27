var testSubscription = require('./helpers/test.subscription.js');

// TODO discuss the whisper in and outputs with vlad!

// NEW HEADS
var tests = [{
    protocol: 'shh',
    args: ['messages', {
        symKeyID: '0x234567432123423546532134536423134567865432',
        minPow: 0.5,
        topics: ['0x48656c6c','0x576f7264'],
        allowP2P: false
    }],
    firstResult: '0x1234',
    firstPayload: {
        method: "shh_subscribe",
        params: ['messages', {
            symKeyID: '0x234567432123423546532134536423134567865432',
            minPow: 0.5,
            topics: ['0x48656c6c','0x576f7264'],
            allowP2P: false
        }]
    },
    secondResult: true,
    secondPayload: {
        method: "shh_unsubscribe"
    },
    subscriptions: [{
        subscription: '0x1234',
        result: {
            sig: "0x048229fb947363cf13bb9f9532e124f08840cd6287ecae6b537cda2947ec2b23dbdc3a07bdf7cd2bfb288c25c4d0d0461d91c719da736a22b7bebbcf912298d1e6",
            ttl: 12,
            timestamp: 1234567,
            topic: "0x576f7264",
            payload: "0x3456435243142fdf1d2312",
            padding: "0xaaa3df1d231456435243142f456435243142f2",
            pow: 0.4,
            hash: "0xddaa3df1d231456435243142af45aa3df1d2314564352431426435243142f2",
            recipientPublicKey: "0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa0996"
        }
    }],
    subscriptionResults: [{
        sig: "0x048229fb947363cf13bb9f9532e124f08840cd6287ecae6b537cda2947ec2b23dbdc3a07bdf7cd2bfb288c25c4d0d0461d91c719da736a22b7bebbcf912298d1e6",
        ttl: 12,
        timestamp: 1234567,
        topic: "0x576f7264",
        payload: "0x3456435243142fdf1d2312",
        padding: "0xaaa3df1d231456435243142f456435243142f2",
        pow: 0.4,
        hash: "0xddaa3df1d231456435243142af45aa3df1d2314564352431426435243142f2",
        recipientPublicKey: "0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa0996"
    }]
}];

testSubscription.runTests('shh', tests);




