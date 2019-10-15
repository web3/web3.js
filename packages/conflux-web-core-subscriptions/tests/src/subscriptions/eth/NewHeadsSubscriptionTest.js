import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import NewHeadsSubscription from '../../../../src/subscriptions/cfx/NewHeadsSubscription';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

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
