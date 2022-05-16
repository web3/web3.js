
var FakeHttp = function Http() {
};

const generateMockXMLHHTTPRequestObject = (requestContentType = 'application/json; charset=utf-8') => ({
    getResponseHeader: () => {
        return requestContentType;
    }
});

FakeHttp.prototype.get = function(queryUrl) {

    if(queryUrl.includes('contentType')) {
        return new Promise((resolve) => {
            resolve(Object.assign(
                {
                    status: 200,
                },
                generateMockXMLHHTTPRequestObject('not json')
            ));
        });
    }

    if(queryUrl.includes('failedJsonParse')) {
        return new Promise((_, reject) => {
            let mockRequest = generateMockXMLHHTTPRequestObject('not json');
            mockRequest.customError = 'Error parsing resopnse body';
            reject(mockRequest);
        });
    }

    return new Promise((resolve) => {
        resolve(Object.assign(
            {
                status: 200,
                responseBody: {},
                method: 'get',
                data: '0x',
                queryUrl,
            },
            generateMockXMLHHTTPRequestObject()
        ));
    });
};

FakeHttp.prototype.post = function(queryUrl, payload) {
    if(queryUrl.includes('4xx')) {
        return new Promise((_, reject) => {
            reject({
                status: 400,
                statusText: 'statusText',
                responseText: 'responseText',
                responseBody: {
                    message: 'error message'
                },
            });
        });
    }

    if(queryUrl.includes('5xx')) {
        return new Promise((_, reject) => {
            reject({
                status: 500,
                statusText: 'statusText',
                responseText: 'responseText',
                responseBody: {
                    message: 'error message'
                }
            });
        });
    }


    return new Promise((resolve) => {
        resolve({
            status: 200,
            responseBody: {},
            method: 'post',
            queryUrl,
            payload,
            getResponseHeader: () => {
                return 'application/json; charset=utf-8';
            }
        });
    });
};

module.exports = FakeHttp;

