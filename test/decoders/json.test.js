import decoder from '../../src/decoders';
import isObject from 'lodash/isObject';

let assert = require('chai').assert;


describe('JSONDecoder', () => {
    it('should return an object', ()=> {

        let jsonStringified = '{"key":"value"}';
        assert(isObject(decoder.json(jsonStringified)))
    });
});