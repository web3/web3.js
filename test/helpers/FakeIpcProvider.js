import FakeHttpProvider from './FakeHttpProvider';

export default class FakeIpcProvider extends FakeHttpProvider {
    notificationCount = 1;
    notificationCallbacks = [];

    on = (type, callback) => {
        if (type === 'data') {
            this.notificationCallbacks.push(callback);
        }
    };

    injectNotification = (notification) => {
        setTimeout(() => {
            this.notificationCallbacks.forEach((cb) => {
                if (notification && cb) {
                    cb(null, notification);
                }
            });
        }, 100 + this.notificationCount);

        this.notificationCount += 10;
    };
}
