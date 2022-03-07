
var FakeHttp = function Http() {

};

//TODO: check for valid URL

// var generateResponse = function() {
//
// }

FakeHttp.prototype.get = function(queryUrl) {
    console.log('FAKEHTTP');
    return new Promise((resolve, reject) => {
        resolve({
            status: 200,
            result: 'result'
        });
    });
};

FakeHttp.prototype.post = function(queryUrl, payload) {
    return new Promise((resolve, reject) => {
        resolve({
            status: 200,
            result: 'post'
        });
    });
};

module.exports = { Http: FakeHttp };
