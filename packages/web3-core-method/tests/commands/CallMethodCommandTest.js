var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var CallMethodCommand = require('../../src/commands/CallMethodCommand');
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var ProvidersPackage = require('web3-core-providers');
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
        web3PackageMock,
        methodModel,
        methodModelCallbackSpy,
        methodModelMock;

    beforeEach(function () {
        provider = new ProvidersPackage.WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        web3Package = new AbstractWeb3Object(providerAdapter, ProvidersPackage, null, null);
        web3PackageMock = sinon.mock(web3Package);

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        callMethodCommand = new CallMethodCommand();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('execute calls beforeExecution/afterExecution of the methodModel, ' +
        'the send method of the provider and calls the callback',
        async function () {
            methodModelMock
                .expects('beforeExecution')
                .withArgs(web3Package)
                .once();

            methodModelMock
                .expects('afterExecution')
                .withArgs('response')
                .returns('0x0')
                .once();

            providerAdapterMock
                .expects('send')
                .returns(new Promise(
                    function(resolve) {
                        resolve('response')
                    }
                ))
                .once();
            
            var returnValue = await callMethodCommand.execute(web3Package, methodModel);
            expect(returnValue).to.equal('0x0');

            expect(methodModelCallbackSpy.calledOnce).to.be.true;
            expect(methodModelCallbackSpy.calledWith('0x0')).to.be.true;
        }
    );
});
