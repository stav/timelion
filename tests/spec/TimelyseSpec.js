describe("timelyze", function() {

    it("should be an object", function() {
        expect(typeof timelyze).toEqual('object');
    });

    describe("parse_dates", function() {

        it("should be a function", function() {
            expect(typeof timelyze.parse_dates).toEqual('function');
        });

        it("should parse a valid date range", function() {
            var
                range = '(2016-2017)',
                dates = timelyze.parse_dates( range ),
                _;
            expect(dates.type()).toEqual('Array');
            expect(dates.length).toBeGreaterThan(0);
        });

    });

});
