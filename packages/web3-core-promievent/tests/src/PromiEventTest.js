import PromiEvent from '../../src/PromiEvent';

/**
 * PromiEvent test
 */
describe('PromiEventTest', () => {
    let promiEvent;

    beforeEach(() => {
        promiEvent = new PromiEvent();
    });

    it('method resolve resolves the Promise', () => {
        promiEvent.then(response => {
            expect(response)
                .toEqual(true);
        })

        promiEvent.resolve(true);
    });

    it('method reject rejects the Promise', () => {
        promiEvent.catch(response => {
            expect(response)
                .toEqual(false);
        })

        promiEvent.reject(false);
    });

    it('method emit emitts an event', () => {
        promiEvent.on('test', response => {
            expect(response)
                .toEqual(false);
        })

        promiEvent.emit('test', false);
    });
});
