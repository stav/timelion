describe("timelion", function() {
    var
        timelion_data_filename = '../app/example.json',
        _;

    function load( done ) {
        timelion.load( timelion_data_filename )
        .then(function(response){ done() })
        .catch(function(error) { console.log(error); done() })
    }

    function render( done ) {
        timelion.render()
        .then(function(response) { done() })
        .catch(function(error) { console.log(error); done() })
    }

    it("should be an object", function() {
        expect(typeof timelion).toEqual('object');
    });
    it("should have a valid configuration", function() {
        expect(typeof timelion.config).toEqual('object');
        expect(typeof timelion.config.show_age).toEqual('boolean');
        expect(timelion.config.year_width).toBeGreaterThan(0);
    });
    it("should not be loaded", function() {
        timelion.init();
        expect(timelion.loaded).toBe(false);
    });

    describe("data", function() {

        beforeAll(function( done ) {
            timelion.reset()
            setTimeout(function(){ load( done ) }, 1)
        });

        it("should be loaded", function() {
            expect(timelion.loaded).toBe(true);
        });
        it("should contain at least one record", function() {
            expect( u.isArray( timelion.events )).toBe(true);
            expect(timelion.events.length).toBeGreaterThan(0);
        });
        it("should contain valid events", function() {
            timelion.events.forEach(function( event ){
                var
                    btrip = timelion.e.get_beg_triplet( event ),
                    etrip = timelion.e.get_end_triplet( event ),
                    _;
                expect(btrip.length).toEqual(3);
                expect(etrip.length).toEqual(3);

                expect( u.isNumber( btrip[0] )).toBe(true);
                expect( u.isNumber( btrip[1] )).toBe(true);
                expect( u.isNumber( btrip[2] )).toBe(true);
                expect( u.isNumber( etrip[0] )).toBe(true);
                expect( u.isNumber( etrip[1] )).toBe(true);
                expect( u.isNumber( etrip[2] )).toBe(true);

                expect( u.isNumber( event.offset )).toBe(true);
                expect( u.isNumber( event.width )).toBe(true);
                expect(typeof event.title).toEqual('string');
            });
        });
        it("should have valid years", function() {
            expect( timelion.years.size ).toBeGreaterThan(0);
            expect( u.type( timelion.years )).toEqual('Map');
            expect( u.type(timelion.years.values().next().value) ).toEqual('Object');
            // expect(
            //     timelion.years.every(function(y){
            //         return typeof y.year == 'number'
            //     })).toBe(true);
            // var
            //     first_year = timelion.years[0].year,
            //     final_year = timelion.years[timelion.years.length-1].year,
            //     _;
            // expect(first_year).toBeLessThanOrEqual(final_year);
        });
    });

    describe("DOM", function() {

        var $canvas;

        beforeAll(function(done) {
            timelion.reset();
            $canvas = document.getElementById('timelion');
            setTimeout(function(){ load( done ) }, 1)
        });

        it("should contain a valid empty canvas", function() {
            expect( $canvas.nodeName ).toEqual('SECTION');
            expect( $canvas.children.length ).toEqual(0);
        });

        describe("render", function() {

            beforeAll(function(done) {
                timelion.reset();
                setTimeout(function() {
                    timelion.load( timelion_data_filename )
                    .then(function(response) { render( done ) });
                }, 1);
            });

            it("should be rendered", function() {
                expect(timelion.rendered).toBe(true);
            });
            it("should have some children", function() {
                expect( $canvas.children.length ).toBeGreaterThan(0);
            });

        });

    });

    describe("render", function() {

        it("should not be rendered", function() {
            timelion.reset();
            expect(timelion.rendered).toBe(false);
        });

        describe("unloaded", function() {

            beforeAll(function(done) {
                timelion.reset();
                setTimeout(render( done ), 1);
            });

            it("should not be rendered", function() {
                expect(timelion.rendered).toBe(false);
            });

        });

        describe("loaded", function() {

            beforeAll(function(done) {
                timelion.reset();
                setTimeout(function() {
                    timelion.load( timelion_data_filename )
                    .then(function(response) { render( done ) });
                }, 1);
            });

            it("should be rendered", function() {
                expect(timelion.rendered).toBe(true);
            });

        });

    });

    afterAll(function(done) {
        timelion.reset();
        done();
    });

});
