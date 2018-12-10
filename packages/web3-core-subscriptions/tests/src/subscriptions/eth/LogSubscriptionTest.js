import LogSubscription from '../../../../src/subscriptions/eth/LogSubscription';
import AbstractWeb3Module from '../../../__mocks__/AbstractWeb3Module';
import GetPastLogsMethod from '../../../__mocks__/GetPastLogsMethod';

// Mocks

jest.mock('');

/**
 * LogSubscription test
 */
describe('LogSubscriptionTest', () => {
    let logSubscription,
        moduleInstanceMock,
        getPastLogsMethodMock;

    beforeEach(() => {
        moduleInstanceMock = new AbstractWeb3Module();
        getPastLogsMethodMock = new GetPastLogsMethod();

        logSubscription = new LogSubscription({}, Utils, formatters, moduleInstanceMock, getPastLogsMethodMock);
    });

    it('', () => {

    });
});
