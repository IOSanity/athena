import decoder from '../../src/decoders';

let assert = require('chai').assert;


describe('JSONDecoder', () => {
    it('should return an object', ()=> {

        let jsonStringed = '{"key":"value"}';
        assert.isObject(decoder.json(jsonStringed))
    });
});