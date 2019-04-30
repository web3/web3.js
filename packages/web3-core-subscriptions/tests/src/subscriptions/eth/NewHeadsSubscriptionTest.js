import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import NewHeadsSubscription from '../../../../src/subscriptions/eth/NewHeadsSubscription';

// Mocks
jest.mock('web3-utils');
jest.mock('web3-core-helpers');

/**
 * NewHeadsSubscription test
 */
describe('NewHeadsSubscriptionTest', () => {
    let newHeadsSubscription;

    beforeEach(() => {
        newHeadsSubscription = new NewHeadsSubscription(Utils, formatters, {});
    });

    it('constructor check', () => {
        expect(newHeadsSubscription.method).toEqual('newHeads');

        expect(newHeadsSubscription.type).toEqual('eth_subscribe');

        expect(newHeadsSubscription.options).toEqual(null);

        expect(newHeadsSubscription.utils).toEqual(Utils);

        expect(newHeadsSubscription.moduleInstance).toEqual({});
    });

    it('onNewSubscriptionItem should call the outputBlockFormatter method', () => {
        formatters.outputBlockFormatter.mockReturnValueOnce({});

        newHeadsSubscription.onNewSubscriptionItem('string');

        expect(formatters.outputBlockFormatter).toHaveBeenCalledWith('string');
    });
});
