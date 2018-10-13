import data from '../src/data/example.json';

describe("Data", function() {

    it("should be an object", function() {
        expect(typeof data).toEqual('object');
    });

    it("should contain events", function() {
        expect(typeof data.events).toEqual('object');
    });

    it("should contain some events", function() {
        expect(data.events.length).toBeGreaterThan(0);
    });

});
