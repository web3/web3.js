#!/usr/bin/env node

'use strict';

var version = require('./lerna.json');
var path = require('path');

var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var bower = require('bower');
var streamify = require('gulp-streamify');
var replace = require('gulp-replace');

var DEST = path.join(__dirname, 'dist/');
var packages = [{
    fileName: 'web3',
    expose: 'Web3',
    src: './src/index.js'
},{
    fileName: 'web3-utils',
    expose: 'Utils',
    src: './packages/web3-utils/src/index.js'
},{
    fileName: 'web3-eth',
    expose: 'Eth',
    src: './packages/web3-eth/src/index.js'
},{
    fileName: 'web3-eth-accounts',
    expose: 'Accounts',
    src: './packages/web3-eth-accounts/src/index.js'
},{
    fileName: 'web3-eth-contract',
    expose: 'Conract',
    src: './packages/web3-eth-contract/src/index.js'
},{
    fileName: 'web3-eth-personal',
    expose: 'Personal',
    src: './packages/web3-eth-personal/src/index.js'
},{
    fileName: 'web3-eth-iban',
    expose: 'EthIban',
    src: './packages/web3-eth-iban/src/index.js'
},{
    fileName: 'web3-eth-abi',
    expose: 'EthAbi',
    src: './packages/web3-eth-abi/src/index.js'
},{
    fileName: 'web3-net',
    expose: 'Net',
    src: './packages/web3-net/src/index.js'
},{
    fileName: 'web3-shh',
    expose: 'Shh',
    src: './packages/web3-shh/src/index.js'
},{
    fileName: 'web3-bzz',
    expose: 'Bzz',
    src: './packages/web3-bzz/src/index.js'
},{
    fileName: 'web3-core-requestManager',
    expose: 'RequestManager',
    src: './packages/web3-core-requestManager/src/index.js'
},{
    fileName: 'web3-providers-ipc',
    expose: 'Web3IpcProvider',
    src: './packages/web3-providers-ipc/src/index.js'
},{
    fileName: 'web3-providers-http',
    expose: 'Web3HttpProvider',
    src: './packages/web3-providers-http/src/index.js',
    ignore: ['xmlhttprequest']
},{
    fileName: 'web3-providers-ws',
    expose: 'Web3WsProvider',
    src: './packages/web3-providers-ws/src/index.js'
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
    compress:{
        dead_code     : true,  // jshint ignore:line
        drop_debugger : true,  // jshint ignore:line
        global_defs   : {      // jshint ignore:line
            "DEBUG": false      // matters for some libraries
        }
    }
};

gulp.task('version', function(){
  gulp.src(['./package.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9\-a-z]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(gulp.dest('./'));
  gulp.src(['./bower.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9\-a-z]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(gulp.dest('./'));
  gulp.src(['./package.js'])
    .pipe(replace(/version\: \'([\.0-9\-a-z]*)\'/, "version: '"+ version.version + "'"))
    .pipe(gulp.dest('./'));
});

gulp.task('bower', ['version'], function(cb){
    bower.commands.install().on('end', function (installed){
        console.log(installed);
        cb();
    });
});

gulp.task('lint', [], function(){
    return gulp.src(['./*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', ['lint'], function(cb) {
    del([ DEST ]).then(cb.bind(null, null));
});

packages.forEach(function(pckg, i){
    var prevPckg = (!i) ? 'clean' : packages[i-1].fileName;

    gulp.task(pckg.fileName, [prevPckg], function () {
        browserifyOptions.standalone = pckg.expose;

        var pipe = browserify(browserifyOptions)
            .require(pckg.src, {expose: pckg.expose})
            .require('bn.js', {expose: 'BN'}) // expose it to dapp developers
            .add(pckg.src);

        if(pckg.ignore) {
            pckg.ignore.forEach(function (ignore) {
                pipe.ignore(ignore);
            });
        }

        return pipe.bundle()
            .pipe(exorcist(path.join( DEST, pckg.fileName + '.js.map')))
            .pipe(source(pckg.fileName + '.js'))
            .pipe(streamify(babel({
                compact: false,
                presets: ['env']
            })))
            .pipe(gulp.dest( DEST ))
            .pipe(streamify(babel({
                compact: true,
                presets: ['env']
            })))
            .pipe(streamify(uglify(ugliyOptions)))
            .on('error', function (err) { console.error(err); })
            .pipe(rename(pckg.fileName + '.min.js'))
            .pipe(gulp.dest( DEST ));
    });
});


gulp.task('watch', function() {
    gulp.watch(['./src/*.js'], ['lint', 'build']);
});

gulp.task('default', ['version', 'lint', 'clean', packages[packages.length-1].fileName]);

