import _ from 'lodash';
import { assert } from 'chai';
import errors from '../packages/web3-core-helpers/src/errors.js';

describe('lib/web3/method', () => {
    describe('getCall', () => {
        _.each(errors, (value) => {
            it('should return and error', () => {
                assert.instanceOf(value(), Error);
            });
        });
    });
});
