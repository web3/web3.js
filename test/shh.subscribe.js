var testSubscription = require('./helpers/test.subscription.js');

// TODO discuss the whisper in and outputs with vlad!

// NEW HEADS
var tests = [{
    protocol: 'shh',
    args: ['messages',{topics: ['Hello','World!']}],
    firstResult: '0x1234',
    firstPayload: {
        method: "shh_subscribe",
        params: ['messages',{topics: ['0x48656c6c6f','0x576f726c6421']}],
    },
    secondResult: true,
    secondPayload: {
        method: "shh_unsubscribe"
    },
    subscriptions: [{
        subscription: '0x1234',
        result: {
            expiry: '0x38658',
            sent: "0x56ffeff8",
            ttl: '0x38658',
            workProved: '0x38658',
            payload: '0x23452',
            topics: ['0x48656c6c6f','0x576f726c6421']
        }
    }],
    subscriptionResults: [{
        expiry: 231000,
        sent: 1459613688,
        ttl: 231000,
        workProved: 231000,
        payload: '0x23452',
        topics: ['Hello','World!']
    }]
}];

testSubscription.runTests('shh', tests);




