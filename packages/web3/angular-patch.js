const fs = require('fs');
const f = '../../node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

// This is because we have to replace the `node:false` in the `/angular-cli-files/models/webpack-configs/browser.js` 
// with `node: {crypto: true, stream: true}` to allow web3 to work with angular (as they enforce node: false.)
// as explained here - https://github.com/ethereum/web3.js/issues/2260#issuecomment-458519127
if (fs.existsSync(f)) {
    fs.readFile(f, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');
        fs.writeFile(f, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}
