const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    XMLHttpRequest: 'xhr2-cookies',
    w3cwebsocket: 'websocket',
    EventEmitter: 'eventemitter3'
});
