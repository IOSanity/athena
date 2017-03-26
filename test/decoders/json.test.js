import decoder from '../../src/decoders';


describe('JSONDecoder', () => {
    test('should return an object', ()=> {

        let jsonStringed = '{"key":"value"}';
        expect(typeof decoder.json(jsonStringed)).toBe('object')
    });
});