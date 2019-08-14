import Units from '../../../src/types/Units';

/**
 * Units test
 */
describe('UnitsTest', () => {
    it('calls toWei and returns the expected results', () => {
        expect(Units.toWei('1', 'wei')).toEqual('1');

        expect(Units.toWei('1', 'kwei')).toEqual('1000');

        expect(Units.toWei('1', 'Kwei')).toEqual('1000');

        expect(Units.toWei('1', 'babbage')).toEqual('1000');

        expect(Units.toWei('1', 'mwei')).toEqual('1000000');

        expect(Units.toWei('1', 'Mwei')).toEqual('1000000');

        expect(Units.toWei('1', 'lovelace')).toEqual('1000000');

        expect(Units.toWei('1', 'gwei')).toEqual('1000000000');

        expect(Units.toWei('1', 'Gwei')).toEqual('1000000000');

        expect(Units.toWei('1', 'shannon')).toEqual('1000000000');

        expect(Units.toWei('1', 'szabo')).toEqual('1000000000000');

        expect(Units.toWei('1', 'finney')).toEqual('1000000000000000');

        expect(Units.toWei('1', 'ether')).toEqual('1000000000000000000');

        expect(Units.toWei('1', 'kether')).toEqual('1000000000000000000000');

        expect(Units.toWei('1', 'grand')).toEqual('1000000000000000000000');

        expect(Units.toWei('1', 'mether')).toEqual('1000000000000000000000000');

        expect(Units.toWei('1', 'gether')).toEqual('1000000000000000000000000000');

        expect(Units.toWei('1', 'tether')).toEqual('1000000000000000000000000000000');

        expect(Units.toWei('1', 'kwei')).toEqual(Units.toWei('1', 'femtoether'));

        expect(Units.toWei('1', 'szabo')).toEqual(Units.toWei('1', 'microether'));

        expect(Units.toWei('1', 'finney')).toEqual(Units.toWei('1', 'milliether'));

        expect(Units.toWei('1', 'milli')).toEqual(Units.toWei('1', 'milliether'));

        expect(Units.toWei('1', 'milli')).toEqual(Units.toWei('1000', 'micro'));

        expect(() => {
            Units.toWei(1, 'wei');
        }).toThrow('Please pass numbers as strings or BN objects to avoid precision errors.');
    });
});
