const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon').createSandbox();
const formatters = require('web3-core-helpers').formatters;

const PersonalSignMethodModel = require('../../../../src/models/methods/personal/PersonalSignMethodModel');

/**
 * PersonalSignMethodModel test
 */
describe('PersonalSignMethodModelTest', () => {
    let model;
    let formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new PersonalSignMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_sign', () => {
        expect(model.rpcMethod).to.equal('personal_sign');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount).to.equal(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        model.parameters = ['sign', '0x0'];

        formattersMock
            .expects('inputSignFormatter')
            .withArgs('sign')
            .returns('signed')
            .once();

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs('0x0')
            .returns('0x00')
            .once();

        model.beforeExecution();

        formattersMock.verify();

        expect(model.parameters[0]).equal('signed');
        expect(model.parameters[1]).equal('0x00');
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('personalSign')).equal('personalSign');
    });
});
