describe("timelion", function() {
    var
        timelion = window.timelion,
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
        // expect(timelion.html).toEqual('');
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
            expect(timelion.data.isArray()).toBe(true);
            expect(timelion.data.length).toBeGreaterThan(0);
        });
        it("should contain valid events", function() {
            timelion.data.forEach(function( event ){
                var
                    btrip = timelion.e.get_beg_triplet( event ),
                    etrip = timelion.e.get_end_triplet( event ),
                    _;
                expect(btrip.length).toEqual(3);
                expect(etrip.length).toEqual(3);

                expect(btrip[0].isNumber()).toBe(true);
                expect(btrip[1].isNumber()).toBe(true);
                expect(btrip[2].isNumber()).toBe(true);
                expect(etrip[0].isNumber()).toBe(true);
                expect(etrip[1].isNumber()).toBe(true);
                expect(etrip[2].isNumber()).toBe(true);

                expect(event.offset.isNumber()).toBe(true);
                expect(event.width.isNumber()).toBe(true);
                expect(typeof event.title).toEqual('string');
            });
        });
        it("should have valid years", function() {
            expect(typeof timelion.first_year).toEqual('number');
            expect(typeof timelion.last_year).toEqual('number');
            expect(timelion.first_year).toBeGreaterThan(0);
            expect(timelion.last_year).toBeGreaterThan(0);
            expect(timelion.last_year).toBeGreaterThanOrEqual(timelion.first_year);
            expect(typeof timelion.years_list).toEqual('object');
            expect(typeof timelion.years_hash).toEqual('object');
            expect(typeof timelion.years_hash[timelion.first_year]).toEqual('object');
        });
    });

    describe("DOM", function() {

        beforeAll(function(done) {
            timelion.reset();
            setTimeout(function(){ load( done ) }, 1)
        });

        it("should contain a valid empty canvas", function() {
            expect(timelion.$canvas.nodeName).toEqual('SECTION');
            expect(timelion.$canvas.children.length).toEqual(0);
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
                expect(timelion.$canvas.children.length).toBeGreaterThan(0);
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
