import encode from '../../src/encoders';

let assert = require('chai').assert;


describe('JSONEncoder', () => {
    it('should return an string', ()=> {

        let object = {key:"value"};

        assert.isString(encode.json(object))
    });
});