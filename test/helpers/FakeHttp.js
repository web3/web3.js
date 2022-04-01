
var FakeHttp = function Http() {

};

//TODO: check for valid URL

// var generateResponse = function() {
//
// }

FakeHttp.prototype.get = function(queryUrl) {
    console.log('FAKEHTTP');
    return new Promise((resolve) => {
        resolve({
            status: 200,
            method: 'get',
            queryUrl
        });
    });
};

FakeHttp.prototype.post = function(queryUrl, payload) {
    console.log('queryUrl: ', queryUrl);

    if(queryUrl.includes('4xx')) {
        return new Promise((_, reject) => {
            reject({
                status: 400,
                statusText: 'statusText',
                responseText: 'responseText'
            });
        });
    }

    if(queryUrl.includes('5xx')) {
        return new Promise((_, reject) => {
            reject({
                status: 500,
                statusText: 'statusText',
                responseText: 'responseText'
            });
        });
    }


    return new Promise((resolve) => {
        resolve({
            status: 200,
            method: 'post',
            queryUrl,
            payload
        });
    });
};

module.exports = { Http: FakeHttp };
