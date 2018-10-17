var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var CallMethodCommand = require('../../src/commands/CallMethodCommand');
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var ProvidersPackage = require('web3-providers');
var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;

/**
 * CallMethodCommand test
 */
describe('CallMethodCommandTest', function () {
    var callMethodCommand,
        provider,
        providerMock,
        providerAdapter,
        providerAdapterMock,
        web3Package,
        methodModel,
        methodModelCallbackSpy,
        methodModelMock;

    beforeEach(function () {
        provider = new ProvidersPackage.WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        web3Package = new AbstractWeb3Object(providerAdapter, ProvidersPackage, null, null);

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        callMethodCommand = new CallMethodCommand();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls execute', async function () {
        methodModelMock
            .expects('beforeExecution')
            .withArgs(web3Package)
            .once();

        providerAdapterMock
            .expects('send')
            .returns(new Promise(
                function (resolve) {
                    resolve('response')
                }
            ))
            .once();

        methodModelMock
            .expects('afterExecution')
            .withArgs('response')
            .returns('0x0')
            .once();

        var returnValue = await callMethodCommand.execute(web3Package, methodModel);
        expect(returnValue).to.equal('0x0');

        expect(methodModelCallbackSpy.calledOnce).to.be.true;
        expect(methodModelCallbackSpy.calledWith(false, '0x0')).to.be.true;

        methodModelMock.verify();
        providerAdapterMock.verify();
    });

    it('calls execute and throws error', async function () {
        methodModelMock
            .expects('beforeExecution')
            .withArgs(web3Package)
            .once();

        providerAdapterMock
            .expects('send')
            .returns(new Promise(
                function (resolve, reject) {
                    reject('error')
                }
            ))
            .once();

        try {
            await callMethodCommand.execute(web3Package, methodModel);
        } catch (error) {
            expect(error).to.equal('error');
        }

        expect(methodModelCallbackSpy.calledOnce).to.be.true;
        expect(methodModelCallbackSpy.calledWith('error', null)).to.be.true;

        methodModelMock.verify();
        providerAdapterMock.verify();
    });
});
