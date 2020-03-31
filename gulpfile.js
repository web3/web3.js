#!/usr/bin/env node

'use strict';

var lernaJSON = require('./lerna.json');
var path = require('path');

var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var streamify = require('gulp-streamify');
var replace = require('gulp-replace');
var exec = require('child_process').exec;

var DEST = path.join(__dirname, 'dist/');
var WEB3_PACKAGE_DEST = path.join(__dirname, 'packages/web3/dist');

var packages = [{
    fileName: 'web3',
    expose: 'Web3',
    src: './packages/web3/src/index.js',
    ignore: ['xmlhttprequest']
}, {
    fileName: 'web3-utils',
    expose: 'Web3Utils',
    src: './packages/web3-utils/src/index.js'
}, {
    fileName: 'web3-eth',
    expose: 'Web3Eth',
    src: './packages/web3-eth/src/index.js'
}, {
    fileName: 'web3-eth-accounts',
    expose: 'Web3EthAccounts',
    src: './packages/web3-eth-accounts/src/index.js'
}, {
    fileName: 'web3-eth-contract',
    expose: 'Web3EthContract',
    src: './packages/web3-eth-contract/src/index.js'
}, {
    fileName: 'web3-eth-personal',
    expose: 'Web3EthPersonal',
    src: './packages/web3-eth-personal/src/index.js'
}, {
    fileName: 'web3-eth-iban',
    expose: 'Web3EthIban',
    src: './packages/web3-eth-iban/src/index.js'
}, {
    fileName: 'web3-eth-abi',
    expose: 'Web3EthAbi',
    src: './packages/web3-eth-abi/src/index.js'
}, {
    fileName: 'web3-eth-ens',
    expose: 'EthEns',
    src: './packages/web3-eth-ens/src/index.js'
}, {
    fileName: 'web3-net',
    expose: 'Web3Net',
    src: './packages/web3-net/src/index.js'
}, {
    fileName: 'web3-shh',
    expose: 'Web3Shh',
    src: './packages/web3-shh/src/index.js'
}, {
    fileName: 'web3-bzz',
    expose: 'Web3Bzz',
    src: './packages/web3-bzz/src/index.js'
}, {
    fileName: 'web3-providers-ipc',
    expose: 'Web3IpcProvider',
    src: './packages/web3-providers-ipc/src/index.js'
}, {
    fileName: 'web3-providers-http',
    expose: 'Web3HttpProvider',
    src: './packages/web3-providers-http/src/index.js',
    ignore: ['xmlhttprequest']
}, {
    fileName: 'web3-providers-ws',
    expose: 'Web3WsProvider',
    src: './packages/web3-providers-ws/src/index.js'
}, {
    fileName: 'web3-core-subscriptions',
    expose: 'Web3Subscriptions',
    src: './packages/web3-core-subscriptions/src/index.js'
}, {
    fileName: 'web3-core-requestmanager',
    expose: 'Web3RequestManager',
    src: './packages/web3-core-requestmanager/src/index.js'
}, {
    fileName: 'web3-core-promievent',
    expose: 'Web3PromiEvent',
    src: './packages/web3-core-promievent/src/index.js'
}, {
    fileName: 'web3-core-method',
    expose: 'Web3Method',
    src: './packages/web3-core-method/src/index.js'
}];

var browserifyOptions = {
    debug: true,
    // standalone: 'Web3',
    derequire: true,
    insertGlobalVars: false, // jshint ignore:line
    detectGlobals: true,
    bundleExternal: true
};

var ugliyOptions = {
    compress: {
        dead_code: true,  // jshint ignore:line
        drop_debugger: true,  // jshint ignore:line
        global_defs: {      // jshint ignore:line
            'DEBUG': false      // matters for some libraries
        }
    }
};

gulp.task('version', function() {
    if (!lernaJSON.version) {
        throw new Error('version property is missing from lerna.json');
    }

    var version = lernaJSON.version;
    var jsonPattern = /"version": "[.0-9\-a-z]*"/;
    var jsPattern = /version: '[.0-9\-a-z]*'/;
    var glob = [
        './package.json',
    ];

    return gulp.src(glob, {base: './'})
        .pipe(replace(jsonPattern, '"version": "' + version + '"'))
        .pipe(replace(jsPattern, 'version: \'' + version + '\''))
        .pipe(gulp.dest('./'));
});

gulp.task('lint', function() {
    return gulp.src(['./*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', gulp.series('lint', function(cb) {
    del([DEST]).then(cb.bind(null, null));
}));

packages.forEach(function(pckg, i) {
    var prevPckg = (!i) ? 'clean' : packages[i - 1].fileName;

    gulp.task(pckg.fileName, gulp.series(prevPckg, function() {
        browserifyOptions.standalone = pckg.expose;

        var stream = browserify(browserifyOptions)
            .require(pckg.src, {expose: pckg.expose})
            .require('bn.js', {expose: 'BN'}) // expose it to dapp developers
            .add('./node_modules/regenerator-runtime')
            .add(pckg.src);

        if (pckg.ignore) {
            pckg.ignore.forEach(function(ignore) {
                stream.ignore(ignore);
            });
        }

        var bundle = stream.transform(
            "babelify",
            {
                global: true,
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            useBuiltIns: 'entry',
                            corejs: 3,
                            targets: {
                                ie: 10
                            }
                        }
                    ]
                ]
            }
        ).bundle();

        stream = bundle
            .pipe(exorcist(path.join(DEST, pckg.fileName + '.js.map')));

        if (pckg.fileName === 'web3') {
            bundle
                .pipe(exorcist(path.join(WEB3_PACKAGE_DEST, pckg.fileName + '.js.map')));
        }

        stream = stream.pipe(source(pckg.fileName + '.js'));

        if (pckg.fileName === 'web3') {
            stream = stream
                .pipe(gulp.dest(WEB3_PACKAGE_DEST));
        }

        stream = stream
            .pipe(gulp.dest(DEST))
            .pipe(streamify(uglify(ugliyOptions)))
            .on('error', function(err) {
                console.error(err);
            })
            .pipe(rename(pckg.fileName + '.min.js'));

        if (pckg.fileName === 'web3') {
            stream = stream
                .pipe(gulp.dest(WEB3_PACKAGE_DEST));
        }

        return stream
            .pipe(gulp.dest(DEST));
    }));
});

gulp.task('publishTag', function() {
    exec('git commit -am "add tag v' + lernaJSON.version + '"; git tag v' + lernaJSON.version + '; git push origin v' + lernaJSON.version + ';');
});

gulp.task('watch', function() {
    gulp.watch(['./packages/web3/src/*.js'], gulp.series('lint', 'default'));
});

gulp.task('all', gulp.series('version', 'lint', 'clean', packages[packages.length - 1].fileName));

gulp.task('default', gulp.series('version', 'lint', 'clean', packages[0].fileName));
