import {PromiEvent} from 'web3-core-promievent';
import {EstimateGasMethod} from 'web3-core-method';
import MethodEncoder from '../../../src/encoders/MethodEncoder';
import MethodFactory from '../../../src/factories/MethodFactory';
import MethodOptionsMapper from '../../../src/mappers/MethodOptionsMapper';
import MethodOptionsValidator from '../../../src/validators/MethodOptionsValidator';
import AbiModel from '../../../src/models/AbiModel';
import AbstractContract from '../../../src/AbstractContract';
import MethodsProxy from '../../../src/proxies/MethodsProxy';
import AbiItemModel from '../../../src/models/AbiItemModel';
import CallContractMethod from '../../../src/methods/CallContractMethod';
import SendContractMethod from '../../../src/methods/SendContractMethod';

// Mocks
jest.mock('../../../src/encoders/MethodEncoder');
jest.mock('../../../src/mappers/MethodOptionsMapper');
jest.mock('../../../src/validators/MethodOptionsValidator');
jest.mock('../../../src/models/AbiModel');
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/factories/MethodFactory');
jest.mock('../../../src/models/AbiItemModel');
jest.mock('../../../src/methods/CallContractMethod');
jest.mock('../../../src/methods/SendContractMethod');
jest.mock('EstimateGasMethod');

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
        abiItemModelMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];
        contractMock.options = {data: ''};

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

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        methodsProxy = new MethodsProxy(
            contractMock,
            abiModelMock,
            methodFactoryMock,
            methodEncoderMock,
            methodOptionsValidatorMock,
            methodOptionsMapperMock,
            PromiEvent
        );
    });

    it('constructor check', () => {
        expect(methodsProxy.contract).toEqual(contractMock);

        expect(methodsProxy.abiModel).toEqual(abiModelMock);

        expect(methodsProxy.methodFactory).toEqual(methodFactoryMock);

        expect(methodsProxy.methodEncoder).toEqual(methodEncoderMock);

        expect(methodsProxy.methodOptionsValidator).toEqual(methodOptionsValidatorMock);

        expect(methodsProxy.methodOptionsMapper).toEqual(methodOptionsMapperMock);

        expect(methodsProxy.PromiEvent).toEqual(PromiEvent);
    });

    it('calls a call method over the proxy', async () => {
        abiItemModelMock.requestType = 'call';

        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        new CallContractMethod();
        const callMethodMock = CallContractMethod.mock.instances[0];
        callMethodMock.parameters = [{}];

        callMethodMock.execute = jest.fn((contractInstance) => {
            expect(contractInstance).toEqual(contractMock);

            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(callMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.myMethod(true).call({options: false})).resolves.toEqual(true);

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('myMethod');

        expect(abiItemModelMock.contractMethodParameters[0]).toEqual(true);

        expect(abiItemModelMock.givenParametersLengthIsValid).toHaveBeenCalled();

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'call'
        );

        expect(callMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.options.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, callMethodMock);
    });

    it('calls the constructor method over the proxy', async () => {
        abiItemModelMock.requestType = 'send';

        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        abiItemModelMock.isOfType.mockReturnValue(true);

        new SendContractMethod();
        const sendMethodMock = SendContractMethod.mock.instances[0];
        sendMethodMock.parameters = [{}];

        sendMethodMock.execute = jest.fn((contractInstance, promiEventInstance) => {
            expect(contractInstance).toEqual(contractMock);

            expect(promiEventInstance).toBeInstanceOf(PromiEvent);

            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(sendMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(
            methodsProxy.contractConstructor({arguments: [true], data: '0x0'}).send({options: false})
        ).resolves.toEqual(true);

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');

        expect(methodsProxy.contract.options.data).toEqual('0x0');

        expect(abiItemModelMock.contractMethodParameters).toEqual([true]);

        expect(abiItemModelMock.givenParametersLengthIsValid).toHaveBeenCalled();

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'contract-deployment'
        );

        expect(sendMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.options.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, sendMethodMock);
    });

    it('calls a method that exists with different arguments over the proxy', async () => {
        abiItemModelMock.requestType = 'send';

        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce([abiItemModelMock]);

        new SendContractMethod();
        const sendMethodMock = SendContractMethod.mock.instances[0];
        sendMethodMock.parameters = [{}];

        sendMethodMock.execute = jest.fn((contractInstance, promiEventInstance) => {
            expect(contractInstance).toEqual(contractMock);

            expect(promiEventInstance).toBeInstanceOf(PromiEvent);

            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(sendMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.myMethod(true).send({options: false})).resolves.toEqual(true);

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('myMethod');

        expect(abiItemModelMock.contractMethodParameters[0]).toEqual(true);

        expect(abiItemModelMock.givenParametersLengthIsValid).toHaveBeenCalled();

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'send'
        );

        expect(sendMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.options.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, sendMethodMock);
    });

    it('calls a method that exists with different arguments but also not with the given and throws an error', async () => {
        abiItemModelMock.requestType = 'send';

        abiItemModelMock.givenParametersLengthIsValid = jest.fn(() => {
            throw new Error('ERROR');
        });

        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce([abiItemModelMock]);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        expect(() => {
            methodsProxy.myMethod({arguments: [true], data: '0x0'});
        }).toThrow('Methods with name "myMethod" found but the given parameters are wrong');

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('myMethod');

        expect(abiItemModelMock.contractMethodParameters[0]).toEqual({arguments: [true], data: '0x0'});

        expect(abiItemModelMock.givenParametersLengthIsValid).toHaveBeenCalled();
    });

    it('calls executeMethod and returns a rejected PromiEvent', async () => {
        abiItemModelMock.givenParametersLengthIsValid = jest.fn(() => {
            throw new Error('Nope');
        });

        const method = {
            callback: jest.fn()
        };

        methodFactoryMock.createMethodByRequestType.mockReturnValue(method);

        await expect(methodsProxy.executeMethod(abiItemModelMock, [true], 'send')).rejects.toThrow('Nope');

        expect(method.callback).toHaveBeenCalledWith(new Error('Nope'), null);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'send'
        );

        expect(method.arguments).toEqual([true]);
    });

    it('calls the request method on a contract method and returns the expect AbstractMethod object', () => {
        abiItemModelMock.requestType = 'call';

        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce([abiItemModelMock]);

        new CallContractMethod();
        const callMethodMock = CallContractMethod.mock.instances[0];
        callMethodMock.parameters = [{}];

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(callMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        expect(methodsProxy.myMethod(true).call.request({options: false})).toEqual(callMethodMock);

        expect(abiItemModelMock.givenParametersLengthIsValid).toHaveBeenCalled();

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'call'
        );

        expect(callMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.options.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, callMethodMock);
    });

    it('calls the estimateGas method on a contract method and returns the expect value', async () => {
        abiItemModelMock.requestType = 'call';

        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce([abiItemModelMock]);

        new EstimateGasMethod();
        const estimateGasMethod = EstimateGasMethod.mock.instances[0];
        estimateGasMethod.parameters = [{}];

        estimateGasMethod.execute = jest.fn((contractInstance) => {
            expect(contractInstance).toEqual(contractMock);

            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(estimateGasMethod);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.myMethod(true).estimateGas({options: false})).resolves.toEqual(true);

        expect(abiItemModelMock.givenParametersLengthIsValid).toHaveBeenCalled();

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'estimate'
        );

        expect(estimateGasMethod.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.options.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, estimateGasMethod);
    });

    it('calls the encodeAbi method on a contract method and returns the expected value', () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        methodEncoderMock.encode.mockReturnValueOnce('encoded');

        expect(methodsProxy.myMethod(true).encodeABI()).toEqual('encoded');

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.options.data);
    });
});
