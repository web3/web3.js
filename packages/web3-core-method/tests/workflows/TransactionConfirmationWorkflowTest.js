var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var ProvidersPackage = require('web3-providers');
var PromiEventPackage = require('web3-core-promievent');
var formatters = require('web3-core-helpers').formatters;
var TransactionConfirmationModel = require('../../src/models/TransactionConfirmationModel');
var TransactionReceiptValidator = require('../../src/validators/TransactionReceiptValidator');
var NewHeadsWatcher = require('../../src/watchers/NewHeadsWatcher');
var TransactionConfirmationWorkflow = require('../../src/workflows/TransactionConfirmationWorkflow');

/**
 * TransactionConfirmationWorkflow test
 */
describe('TransactionConfirmationWorkflowTest', function () {
    var transactionConfirmationWorkflow,
        transactionConfirmationModel,
        transactionConfirmationModelMock,
        transactionReceiptValidator,
        transactionReceiptValidatorMock,
        newHeadsWatcher,
        newHeadsWatcherMock,
        formattersMock,
        methodModel,
        methodModelMock,
        methodModelCallbackSpy,
        provider,
        providerMock,
        providerAdapter,
        providerAdapterMock,
        web3Package,
        web3PackageMock,
        promiEvent,
        promiEventMock;

    beforeEach(function () {
        transactionConfirmationModel = new TransactionConfirmationModel();
        transactionConfirmationModelMock = sinon.mock(transactionConfirmationModel);

        transactionReceiptValidator = new TransactionReceiptValidator();
        transactionReceiptValidatorMock = sinon.mock(transactionReceiptValidator);

        newHeadsWatcher = new NewHeadsWatcher();
        newHeadsWatcherMock = sinon.mock(newHeadsWatcher);

        formattersMock = sinon.mock(formatters);

        methodModel = new AbstractMethodModel();
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        provider = new ProvidersPackage.WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        web3Package = new AbstractWeb3Object(providerAdapter, ProvidersPackage, null, null);
        web3PackageMock = sinon.mock(web3Package);

        promiEvent = PromiEventPackage.createPromiEvent();
        promiEventMock = sinon.mock(promiEvent);

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow(
            transactionConfirmationModel,
            transactionReceiptValidator,
            newHeadsWatcher,
            formatters
        );
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls executes and receipt does already exists', function () {
        providerAdapterMock
            .expects('send')
            .withArgs('eth_getTransactionReceipt', ['0x0'])
            .returns(new Promise(
                function (resolve) {
                    resolve({});
                }
            ))
            .once();

        formattersMock
            .expects('outputTransactionReceiptFormatter')
            .withArgs({})
            .returns({blockHash: '0x0'})
            .once();

        transactionReceiptValidatorMock
            .expects('validate')
            .withArgs({blockHash: '0x0'})
            .returns(true)
            .once();

        newHeadsWatcherMock
            .expects('stop')
            .once();

        methodModelMock
            .expects('afterExecution')
            .withArgs({blockHash: '0x0'})
            .returns({blockHash: '0x00'})
            .once();

        transactionConfirmationWorkflow.execute(
            methodModel,
            web3Package,
            '0x0',
            promiEvent
        );

        promiEvent.eventEmitter.on('receipt', function (receipt) {
            expect(receipt).to.has.an.property('blockHash', '0x00');
        }).then(function (response) {
            expect(methodModelCallbackSpy.calledOnce).to.be.true;
            expect(methodModelCallbackSpy.calledWith(false, {blockHash: '0x00'}));
            expect(response).to.has.an.property('blockHash', '0x00');

            providerMock.verify();
            formattersMock.verify();
            transactionReceiptValidatorMock.verify();
            newHeadsWatcherMock.verify();
            methodModelMock.verify();
        });
    });
});
