import Timelion from '../src/assets/js/entities/models';

describe("Timelion class", function() {

    it("should be a function", function() {
        expect(typeof Timelion).toEqual('function');
    });

    describe("Timelion instance", function() {

        const timelion = new Timelion();

        it("should be an object", function() {
            expect(typeof timelion).toEqual('object');
        });

        it("should not be loaded", function() {
            expect(timelion.loaded()).toEqual(false);
        });

    });
});
