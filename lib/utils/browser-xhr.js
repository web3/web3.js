'use strict';

// go env doesn't have and need XMLHttpRequest
exports.XMLHttpRequest = typeof XMLHttpRequest === undefined ? {} : XMLHttpRequest; // jshint ignore:line

