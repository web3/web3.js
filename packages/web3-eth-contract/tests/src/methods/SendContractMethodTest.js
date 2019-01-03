import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {Accounts} from 'web3-eth-accounts';
import {SendTransactionMethod} from 'web3-core-method';
import TransactionConfirmationWorkflow from '../../__mocks__/TransactionConfirmationWorkflow';
import TransactionSigner from '../../__mocks__/TransactionSigner';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';
import SendContractMethod from '../../../src/methods/SendContractMethod';
import AbiItemModel from '../../../src/models/AbiItemModel';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('Accounts');
jest.mock('../../../src/decoders/AllEventsLogDecoder');
jest.mock('../../../src/models/AbiItemModel');

/**
 * SendContractMethod test
 */
describe('SendContractMethodTest', () => {
    let sendContractMethod,
        transactionConfirmationWorkflowMock,
        accountsMock,
        transactionSignerMock,
        allEventsLogDecoderMock,
        abiItemModelMock;

    beforeEach(() => {
        transactionConfirmationWorkflowMock = new TransactionConfirmationWorkflow();

        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        transactionSignerMock = new TransactionSigner();

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        sendContractMethod = new SendContractMethod(
            Utils,
            formatters,
            transactionConfirmationWorkflowMock,
            accountsMock,
            transactionSignerMock,
            allEventsLogDecoderMock,
            abiItemModelMock
        );
    });

    it('constructor check', () => {
        expect(sendContractMethod.utils)
            .toEqual(Utils);

        expect(sendContractMethod.formatters)
            .toEqual(formatters);

        expect(sendContractMethod.transactionConfirmationWorkflow)
            .toEqual(transactionConfirmationWorkflowMock);

        expect(sendContractMethod.accounts)
            .toEqual(accountsMock);

        expect(sendContractMethod.transactionSigner)
            .toEqual(transactionSignerMock);

        expect(sendContractMethod.allEventsLogDecoder)
            .toEqual(allEventsLogDecoderMock);

        expect(sendContractMethod.abiItemModel)
            .toEqual(abiItemModelMock);

        expect(sendContractMethod)
            .toBeInstanceOf(SendTransactionMethod);
    });

    it('calls afterExecution and returns the expected result', () => {
        const response = {
            logs: [
                {
                    event: false,
                },
                {
                    event: 'MyEvent'
                },
                {
                    event: 'MyEvent'
                },
                {
                    event: 'MyEvent'
                }
            ]
        };

        allEventsLogDecoderMock.decode
            .mockReturnValueOnce({event: false});

        allEventsLogDecoderMock.decode
            .mockReturnValueOnce({event: 'MyEvent'});

        allEventsLogDecoderMock.decode
            .mockReturnValueOnce({event: 'MyEvent'});

        allEventsLogDecoderMock.decode
            .mockReturnValueOnce({event: 'MyEvent'});

        const mappedResponse = sendContractMethod.afterExecution(response);

        expect(mappedResponse)
            .toEqual({
                events: {
                    0: {event: false},
                    MyEvent: [
                        {
                            event: 'MyEvent'
                        },
                        {
                            event: 'MyEvent'
                        },
                        {
                            event: 'MyEvent'
                        }
                    ]
                }
            });

        expect(allEventsLogDecoderMock.decode)
            .toHaveBeenNthCalledWith(1, null, {event: false});

        expect(allEventsLogDecoderMock.decode)
            .toHaveBeenNthCalledWith(2, null, {event: 'MyEvent'});

        expect(allEventsLogDecoderMock.decode)
            .toHaveBeenNthCalledWith(3, null, {event: 'MyEvent'});

        expect(allEventsLogDecoderMock.decode)
            .toHaveBeenNthCalledWith(4, null, {event: 'MyEvent'});
    });
});
