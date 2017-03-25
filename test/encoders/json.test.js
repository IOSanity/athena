import encode from '../../src/encoders';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

let assert = require('chai').assert;


describe('JSONEncoder', () => {
    it('should return an string', ()=> {

        let object = {key:"value"};

        assert(isString(encode.json(object)), 'JSON encoded')
    });
});