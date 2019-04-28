import MethodEncoder from '../../../src/encoders/MethodEncoder';
import MethodFactory from '../../../src/factories/MethodFactory';
import MethodOptionsMapper from '../../../src/mappers/MethodOptionsMapper';
import MethodOptionsValidator from '../../../src/validators/MethodOptionsValidator';
import AbiModel from '../../../src/models/AbiModel';
import AbstractContract from '../../../src/AbstractContract';
import MethodsProxy from '../../../src/proxies/MethodsProxy';
import AbiItemModel from '../../../src/models/AbiItemModel';

// Mocks
jest.mock('../../../src/encoders/MethodEncoder');
jest.mock('../../../src/mappers/MethodOptionsMapper');
jest.mock('../../../src/validators/MethodOptionsValidator');
jest.mock('../../../src/models/AbiModel');
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/factories/MethodFactory');
jest.mock('../../../src/models/AbiItemModel');

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
        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];
        contractMock.data = '';
        contractMock.abiModel = abiModelMock;

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
            methodFactoryMock,
            methodEncoderMock,
            methodOptionsValidatorMock,
            methodOptionsMapperMock
        );
    });

    it('constructor check', () => {
        expect(methodsProxy.contract).toEqual(contractMock);

        expect(methodsProxy.methodFactory).toEqual(methodFactoryMock);

        expect(methodsProxy.methodEncoder).toEqual(methodEncoderMock);

        expect(methodsProxy.methodOptionsValidator).toEqual(methodOptionsValidatorMock);

        expect(methodsProxy.methodOptionsMapper).toEqual(methodOptionsMapperMock);
    });

    it('calls a call method over the proxy', async () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        const callMethodMock = {};
        callMethodMock.parameters = [{}];
        callMethodMock.setArguments = jest.fn();
        callMethodMock.execute = jest.fn(() => {
            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(callMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.myMethod(true).call({options: false})).resolves.toEqual(true);

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('myMethod');

        expect(abiItemModelMock.contractMethodParameters[0]).toEqual(true);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'call'
        );

        expect(callMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, callMethodMock);
    });

    it('calls the constructor method over the proxy', async () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        abiItemModelMock.isOfType.mockReturnValue(true);

        const sendMethodMock = {};
        sendMethodMock.parameters = [{}];
        sendMethodMock.setArguments = jest.fn();
        sendMethodMock.execute = jest.fn(() => {
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

        expect(methodsProxy.contract.data).toEqual('0x0');

        expect(abiItemModelMock.contractMethodParameters).toEqual([true]);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'contract-deployment'
        );

        expect(sendMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, sendMethodMock);
    });

    it('calls the constructor method over the proxy if methodArgument does not contains data', async () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        abiItemModelMock.isOfType.mockReturnValue(true);

        const sendMethodMock = {};
        sendMethodMock.parameters = [{}];
        sendMethodMock.setArguments = jest.fn();
        sendMethodMock.execute = jest.fn(() => {
            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(sendMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.contractConstructor({arguments: [true]}).send({options: false})).resolves.toEqual(
            true
        );

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');

        expect(abiItemModelMock.contractMethodParameters).toEqual([true]);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'contract-deployment'
        );

        expect(sendMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, sendMethodMock);
    });

    it('calls the constructor method over the proxy if arguments is undefined', async () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        abiItemModelMock.isOfType.mockReturnValue(true);

        const sendMethodMock = {};
        sendMethodMock.parameters = [{}];
        sendMethodMock.setArguments = jest.fn();
        sendMethodMock.execute = jest.fn(() => {
            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(sendMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.contractConstructor({data: '0x0'}).send({options: false})).resolves.toEqual(true);

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');

        expect(methodsProxy.contract.data).toEqual('0x0');

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'contract-deployment'
        );

        expect(sendMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, sendMethodMock);
    });
    it('calls the constructor method over the proxy if methodArguments are not defined', async () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        abiItemModelMock.isOfType.mockReturnValue(true);

        const sendMethodMock = {};
        sendMethodMock.parameters = [{}];
        sendMethodMock.setArguments = jest.fn();
        sendMethodMock.execute = jest.fn(() => {
            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(sendMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.contractConstructor().send({options: false})).resolves.toEqual(true);

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('contractConstructor');

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');

        expect(abiItemModelMock.contractMethodParameters).toEqual([]);
    });

    it('calls a method that exists with different arguments over the proxy', async () => {
        abiItemModelMock.getInputLength.mockReturnValueOnce(1);

        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce([abiItemModelMock]);

        const sendMethodMock = {};
        sendMethodMock.parameters = [{}];
        sendMethodMock.setArguments = jest.fn();
        sendMethodMock.execute = jest.fn(() => {
            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(sendMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.myMethod(true).send({options: false})).resolves.toEqual(true);

        expect(abiModelMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(abiModelMock.getMethod).toHaveBeenCalledWith('myMethod');

        expect(abiItemModelMock.contractMethodParameters[0]).toEqual(true);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'send'
        );

        expect(sendMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, sendMethodMock);
    });

    it('calls a method that exists with different arguments but with a invalid arguments length and throws an error', async () => {
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
    });

    it('calls executeMethod and returns a rejected PromiEvent', async () => {
        const method = {
            parameters: [],
            callback: jest.fn(),
            setArguments: jest.fn()
        };

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(method);
        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(method);

        methodEncoderMock.encode = jest.fn(() => {
            throw new Error('Nope');
        });

        await expect(methodsProxy.executeMethod(abiItemModelMock, [true], 'send')).rejects.toThrow('Nope');

        expect(method.callback).toHaveBeenCalledWith(new Error('Nope'), null);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'send'
        );

        expect(method.setArguments).toHaveBeenCalledWith([true]);
    });

    it('calls the request method on a contract call method and returns the expect AbstractMethod object', () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        const callMethodMock = {};
        callMethodMock.parameters = [{}];
        callMethodMock.setArguments = jest.fn();
        callMethodMock.execute = jest.fn();

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(callMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        expect(methodsProxy.myMethod(true).call.request({options: false})).toEqual(callMethodMock);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'call'
        );

        expect(callMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, callMethodMock);
    });

    it('calls the request method on a contract send method and returns the expect AbstractMethod object', () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        const callMethodMock = {};
        callMethodMock.parameters = [{}];
        callMethodMock.setArguments = jest.fn();
        callMethodMock.execute = jest.fn();

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(callMethodMock);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        expect(methodsProxy.myMethod(true).send.request({options: false})).toEqual(callMethodMock);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'send'
        );

        expect(callMethodMock.parameters[0]).toEqual({options: true});

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, callMethodMock);
    });

    it('calls the estimateGas method on a contract method and returns the expect value', async () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        const estimateGasMethod = {};
        estimateGasMethod.parameters = [{}];
        estimateGasMethod.setArguments = jest.fn();
        estimateGasMethod.execute = jest.fn(() => {
            return Promise.resolve(true);
        });

        methodFactoryMock.createMethodByRequestType.mockReturnValueOnce(estimateGasMethod);

        methodEncoderMock.encode.mockReturnValueOnce('0x0');

        methodOptionsMapperMock.map.mockReturnValueOnce({options: true});

        await expect(methodsProxy.myMethod(true).estimateGas({options: false})).resolves.toEqual(true);

        expect(methodFactoryMock.createMethodByRequestType).toHaveBeenCalledWith(
            abiItemModelMock,
            contractMock,
            'estimate'
        );

        expect(estimateGasMethod.parameters[0]).toEqual({options: true});

        expect(estimateGasMethod.execute).toHaveBeenCalled();

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);

        expect(methodOptionsMapperMock.map).toHaveBeenCalledWith(contractMock, {data: '0x0'});

        expect(methodOptionsValidatorMock.validate).toHaveBeenCalledWith(abiItemModelMock, estimateGasMethod);
    });

    it('calls the encodeAbi method on a contract method and returns the expected value', () => {
        abiModelMock.hasMethod.mockReturnValueOnce(true);

        abiModelMock.getMethod.mockReturnValueOnce(abiItemModelMock);

        methodEncoderMock.encode.mockReturnValueOnce('encoded');

        expect(methodsProxy.myMethod(true).encodeABI()).toEqual('encoded');

        expect(methodEncoderMock.encode).toHaveBeenCalledWith(abiItemModelMock, contractMock.data);
    });
});
