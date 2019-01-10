import Websocket from './Websocket';

export default class W3CWebsocket extends Websocket {
    constructor(host, protocol, origin, headers, requestOptions, config) {
        super(host, protocol);
        this.origin = origin;
        this._client = {
            headers,
            requestOptions,
            config
        };
    }
}
