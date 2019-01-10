import PromiEvent from '../../src/PromiEvent';

/**
 * PromiEvent test
 */
describe('PromiEventTest', () => {
    let promiEvent;

    beforeEach(() => {
        promiEvent = new PromiEvent();
    });

    it('method resolve resolves the Promise', (done) => {
        promiEvent.then((response) => {
            expect(response).toEqual(true);

            done();
        });

        promiEvent.resolve(true);
    });

    it('method reject rejects the Promise', (done) => {
        promiEvent.catch((error) => {
            expect(error).toEqual(false);

            done();
        });

        promiEvent.reject(false);
    });

    it('method emit emitts an event', (done) => {
        promiEvent.on('test', (response) => {
            expect(response).toEqual(false);

            done();
        });

        promiEvent.emit('test', false);
    });
});
