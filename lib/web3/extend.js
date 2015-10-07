var formatters = require('./formatters');
var utils = require('./../utils/utils');
var Method = require('./method');
var Property = require('./property');

/// creates methods in a given object based on method description on input
/// setups api calls for these methods
var setupMethods = function (obj, methods) {
    methods.forEach(function (method) {
        method.attachToObject(obj);
    });
};

/// creates properties in a given object based on properties description on input
/// setups api calls for these properties
var setupProperties = function (obj, properties) {
    properties.forEach(function (property) {
        property.attachToObject(obj);
    });
};

var extend = function (web3, extension) {

    var extendedObject;
    if (extension.property && !web3[extension.property]) {
        this[extension.property] = {};
        extendedObject = this[extension.property];
    } else {
        extendedObject = this;
    }

    setupMethods(extendedObject, extension.methods || []);
    setupProperties(extendedObject, extension.properties || []);
};

extend.formatters = formatters; 
extend.utils = utils;
extend.Method = Method;
extend.Property = Property;

module.exports = extend;

