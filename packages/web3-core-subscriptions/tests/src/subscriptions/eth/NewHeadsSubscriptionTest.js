import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractWeb3Module from '../../../__mocks__/AbstractWeb3Module';
import GetPastLogsMethod from '../../../__mocks__/GetPastLogsMethod';
import NewHeadsSubscription from '../../../../src/subscriptions/eth/NewHeadsSubscription';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * NewHeadsSubscription test
 */
describe('NewHeadsSubscriptionTest', () => {
    let newHeadsSubscription,
        moduleInstanceMock,
        getPastLogsMethodMock;

    beforeEach(() => {
        moduleInstanceMock = new AbstractWeb3Module();

        getPastLogsMethodMock = new GetPastLogsMethod();

        newHeadsSubscription = new NewHeadsSubscription(Utils, formatters, moduleInstanceMock);
    });

    it('constructor check', () => {
        expect(newHeadsSubscription.method)
            .toBe('logs');

        expect(newHeadsSubscription.type)
            .toBe('eth_subscribe');

        expect(newHeadsSubscription.options)
            .toEqual(null);

        expect(newHeadsSubscription.utils)
            .toEqual(Utils);

        expect(newHeadsSubscription.moduleInstance)
            .toEqual(moduleInstanceMock);
    });


    it('onNewSubscriptionItem should call the outputBlockFormatter method', () => {
        formatters.outputBlockFormatter
            .mockReturnValueOnce({});

        newHeadsSubscription
            .onNewSubscriptionItem('string');

        expect(formatters.outputBlockFormatter)
            .toHaveBeenCalledWith('string');
    });
});
