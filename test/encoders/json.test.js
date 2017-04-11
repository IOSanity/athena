import encode from '../../src/encoders';


describe('JSONEncoder', () => {
    test('should return an string', ()=> {

        let object = {key:"value"};

        expect(typeof encode.json(object)).toBe("string")
    });
});