
var FakeHttp = function Http() {
};

//TODO: check for valid URL

// var generateResponse = function() {
//
// }

/*
    normal server response
    {status: request.status
    response: json parsed server response)

    error response

    response:  { status: 400, response: { message: 'Invalid request format' } }

 */

FakeHttp.prototype.get = function(queryUrl) {
    return new Promise((resolve) => {
        resolve({
            status: 200,
            responseBody: {},
            request: {},
            method: 'get',
            data: '0x',
            queryUrl,
        });
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
            request: {},
            method: 'post',
            queryUrl,
            payload
        });
    });
};

module.exports = { Http: FakeHttp };
