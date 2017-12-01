import { assert } from 'chai';

export default class FakeXHR2 {
    responseText = undefined;
    readyState = 4;
    onreadystatechange = null;
    async = true;
    headers = {
        'Content-Type': 'text/plain'
    };

    open = (method, host, async) => {
        assert.equal(method, 'POST');
        assert.notEqual(host, null);
        this.async = async;
    };

    setRequestHeader = (name, value) => {
        this.headers[name] = value;
    };

    send = (payload) => {
        this.responseText = payload;

        assert.equal(typeof payload, 'string');
        if (this.async) {
            assert.equal(typeof this.onreadystatechange, 'function');
            this.onreadystatechange();
        }
    };
}
