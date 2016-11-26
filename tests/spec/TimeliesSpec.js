describe("timelies", function() {

    it("should be an object", function() {
        expect(typeof timelies).toEqual('object');
    });

    describe("extend_event_api", function() {

        it("should be a function", function() {
            expect(typeof timelies.extend_event_api).toEqual('function');
        });

        it("should parse valid api json", function() {
            const json = '["William Luther Pierce",["William Luther Pierce"],["William Luther Pierce III (September 11, 1933 – July 23, 2002) was an American white nationalist and political activist."],["https://en.wikipedia.org/wiki/William_Luther_Pierce"]]';
            const data = JSON.parse( json );
            var event = {};
            timelies.extend_event_api( event, data )
            expect( u.type( event.date )).toEqual('Array');
            expect( event.date ).toEqual([ [ 1933, 9, 11 ], [ 2002, 7, 23 ] ]);
        });
    });
});
