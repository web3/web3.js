import AbiModel from '../../../src/models/AbiModel';

/**
 * AbiModel test
 */
describe('AbiModelTest', () => {
    let abiModel, mappedAbi;

    beforeEach(() => {
        mappedAbi = {
            methods: {},
            events: {}
        };

        abiModel = new AbiModel(mappedAbi);
    });

    it('constructor check', () => {
        expect(abiModel.abi).toEqual(mappedAbi);
    });

    it('calls getMethod and returns the expected one', () => {
        abiModel.abi.methods['my_method'] = true;

        expect(abiModel.getMethod('my_method')).toEqual(true);
    });

    it('calls getMethod and returns false', () => {
        expect(abiModel.getMethod('my_method')).toEqual(false);
    });

    it('calls getEvent and returns the expected one', () => {
        abiModel.abi.events['my_event'] = true;

        expect(abiModel.getEvent('my_event')).toEqual(true);
    });

    it('calls getEvent and returns false', () => {
        expect(abiModel.getEvent('my_event')).toEqual(false);
    });

    it('calls getEvents and returns the expected object', () => {
        abiModel.abi.events['my_event'] = true;

        expect(abiModel.getEvents('my_event')).toHaveProperty('my_event', true);
    });

    it('calls getEventBySignature and returns the expected object', () => {
        abiModel.abi.events['my_event'] = {signature: 'true'};

        expect(abiModel.getEventBySignature('true')).toEqual({signature: 'true'});
    });

    it('calls hasMethod and returns false', () => {
        expect(abiModel.hasMethod('name')).toEqual(false);
    });

    it('calls hasMethod and returns true', () => {
        abiModel.abi.methods['name'] = true;

        expect(abiModel.hasMethod('name')).toEqual(true);
    });

    it('calls hasEvent and returns false', () => {
        expect(abiModel.hasEvent('name')).toEqual(false);
    });

    it('calls hasEvent and returns true', () => {
        abiModel.abi.events['name'] = true;

        expect(abiModel.hasEvent('name')).toEqual(true);
    });
});
