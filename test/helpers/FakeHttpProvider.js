import _ from 'lodash';
import { assert } from 'chai';

export default class FakeHttpProvider {
    countId = 1;
    response = [];
    error = [];
    validation = [];

    getResponseStub = () => ({
        jsonrpc: '2.0',
        id: this.countId,
        result: null
    })

    getErrorStub = () => ({
        jsonrpc: '2.0',
        id: this.countId,
        error: {
            code: 1234,
            message: 'Stub error'
        }
    })

    send = (payload, callback) => {
        if (payload.id) {
            this.countId = payload.id;
        }

        assert.equal(_.isArray(payload) || _.isObject(payload), true);
        assert.equal(_.isFunction(callback), true);

        const validation = this.validation.shift();

        if (validation) {
            // imitate plain json object
            validation(JSON.parse(JSON.stringify(payload)), callback);
        }

        const response = this.getResponseOrError('response', payload);
        const error = this.getResponseOrError('error', payload);

        setTimeout(() => {
            callback(error, response);
        }, 1);
    }

    getResponseOrError = (type, payload) => {
        let response;

        if (type === 'error') {
            response = this.error.shift();
        } else {
            response = this.response.shift() || this.getResponseStub();
        }

        if (response) {
            if (_.isArray(response)) {
                response = response.map((resp, index) => {
                    // eslint-disable-next-line no-param-reassign
                    resp.id = payload[index]
                        ? payload[index].id
                        : this.countId++;

                    return resp;
                });
            } else {
                response.id = payload.id;
            }
        }

        return response;
    }

    injectBatchResults = (results, error) => {
        this.response.push(results.map((r) => {
            let response;
            if (error) {
                response = this.getErrorStub();
                response.error.message = r;
            } else {
                response = this.getResponseStub();
                response.result = r;
            }

            return response;
        }));
    }

    injectResult = (result) => {
        const response = this.getResponseStub();
        response.result = result;

        this.response.push(response);
    }

    injectError = (error) => {
        const errorStub = this.getErrorStub();
        errorStub.error = error;

        this.error.push(errorStub);
    }

    injectValidation = (callback) => {
        this.validation.push(callback);
    }
}
