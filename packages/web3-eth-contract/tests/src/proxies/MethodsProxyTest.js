import PromiEvent from 'web3-core-promievent';
import MethodEncoder from '../../../src/encoders/MethodEncoder';
import MethodOptionsMapper from '../../../src/mappers/MethodOptionsMapper';
import MethodOptionsValidator from '../../../src/validators/MethodOptionsValidator';
import AbiModel from '../../../src/models/AbiModel';
import AbstractContract from '../../../src/AbstractContract';
import MethodsProxy from '../../../src/proxies/MethodsProxy';

// Mocks
jest.mock('../../../src/encoders/MethodEncoder');
jest.mock('../../../src/mappers/MethodOptionsMapper');
jest.mock('../../../src/validators/MethodOptionsValidator');
jest.mock('../../../src/models/AbiModel');
jest.mock('../../../src/AbstractContract');

/**
 * MethodsProxy test
 */
describe('MethodsProxyTest', () => {
    let methodsProxy,
        contractMock,
        abiModelMock,
        methodFactoryMock,
        methodEncoderMock,
        methodOptionsValidatorMock,
        methodOptionsMapperMock,
        promiEvent;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        new MethodFactory();
        methodFactoryMock = MethodFactory.mock.instances[0];

        new MethodEncoder();
        methodEncoderMock = MethodEncoder.mock.instances[0];

        new MethodOptionsValidator();
        methodOptionsValidatorMock = MethodOptionsValidator.mock.instances[0];

        new MethodOptionsMapper();
        methodOptionsMapperMock = MethodOptionsMapper.mock.instances[0];

        promiEvent = new PromiEvent();

        methodsProxy = new MethodsProxy(
            contractMock,
            abiModelMock,
            methodFactoryMock,
            methodEncoderMock,
            methodOptionsValidatorMock,
            methodOptionsMapperMock,
            promiEvent
        );
    });

    it('constructor check', () => {
        expect(methodsProxy.contract)
            .toEqual(contractMock);

        expect(methodsProxy.abiModel)
            .toEqual(abiModelMock);

        expect(methodsProxy.methodFactory)
            .toEqual(methodFactoryMock);

        expect(methodsProxy.methodEncoder)
            .toEqual(methodEncoderMock);

        expect(methodsProxy.methodOptionsValidator)
            .toEqual(methodOptionsValidatorMock);

        expect(methodsProxy.methodOptionsMapper)
            .toEqual(methodOptionsMapperMock);

        expect(methodsProxy.promiEvent)
            .toEqual(promiEvent);

        expect(methodsProxy)
            .toBeInstanceOf(Proxy);
    });

    it('calls a normal method over the proxy', ()  => {

    });

    it('calls the constructor method over the proxy', ()  => {

    });

    it('calls a method that exists with different arguments over the proxy', () => {

    });
});
