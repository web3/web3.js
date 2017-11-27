import _ from 'lodash';
import { assert } from 'chai';
import FakeIpcProvider from './FakeIpcProvider';
import Web3 from '../../packages/web3';

export default {
    runTests
};

function runTests(protocol, tests) {
    describe('web3.shh.subscribe', () => {
        tests.forEach((test) => {
            it(`should create a subscription for "${test.args[0]}"`, (done) => {
                // given
                let sub;
                const provider = new FakeIpcProvider();
                const web3 = new Web3(provider);
                let dataCount = 0;
                let changedCount = 0;

                provider.injectResult(test.firstResult);
                provider.injectResult(test.datadResult);

                provider.injectValidation((payload) => {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, `${protocol}_subscribe`);
                    assert.deepEqual(payload.params, test.firstPayload.params);
                });
                provider.injectValidation((payload) => {
                    assert.equal(payload.method, test.secondPayload.method);

                    done();
                });

                // add callback
                test.args.push((_err, result) => {
                    if (test.err) {
                        // TODO add subscription error check

                    } else if (test.subscriptionResults) {
                        const subRes = test.subscriptionResults.shift();

                        assert.deepEqual(result, subRes);
                    }

                    if (!test.subscriptionResults || !test.subscriptionResults.length) {
                        if (_.isFinite(test.dataCount)) {
                            assert.equal(dataCount, test.dataCount);
                        }
                        if (_.isFinite(test.changedCount)) {
                            assert.equal(changedCount, test.changedCount);
                        }

                        sub.unsubscribe();
                    }
                });

                // when
                sub = web3[test.protocol].subscribe(...test.args)
                    .on('data', () => {
                        dataCount++;
                    })
                    .on('changed', () => {
                        changedCount++;
                    });

                // fire subscriptions
                test.subscriptions.forEach((subscription) => {
                    provider.injectNotification({
                        method: `${protocol}_subscription`,
                        params: subscription
                    });
                });
            });
        });
    });
}
