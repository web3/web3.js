var chai = require('chai');
var expect = chai.expect;

var ImportRawKeyMethodModel = require('../../../../src/models/methods/personal/ImportRawKeyMethodModel');

/**
 * ImportRawKeyMethodModel test
 */
describe('ImportRawKeyMethodModelTest', function() {
    var model;

    beforeEach(function() {
        model = new ImportRawKeyMethodModel({}, {});
    });

    it('rpcMethod should return personal_importRawKey', function() {
        expect(model.rpcMethod).to.equal('personal_importRawKey');
    });

    it('parametersAmount should return 2', function() {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should do nothing with the parameters', function() {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', function() {
        expect(model.afterExecution('version')).equal('version');
    });
});
