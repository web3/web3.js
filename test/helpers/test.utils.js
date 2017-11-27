import { assert } from 'chai';

export default {
    methodExists,
    propertyExists
};

function methodExists(object, method) {
    it(`should have method ${method} implemented`, () => {
        assert.equal('function', typeof object[method], `method ${method} is not implemented`);
    });
}

function propertyExists(object, property) {
    it(`should have property ${property} implemented`, () => {
        assert.notEqual('undefined', typeof object[property], `property ${property} is not implemented`);
    });
}
