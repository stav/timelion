describe("timelion", function() {
    var
        timelion = window.timelion,
        timelion_data_filename = '../app/example.json',
        _;

    it("should be an object", function() {
        expect(typeof timelion).toEqual('object');
    });
    it("should have a valid configuration", function() {
        expect(typeof timelion.config).toEqual('object');
        expect(typeof timelion.config.show_age).toEqual('boolean');
        expect(timelion.config.year_width).toBeGreaterThan(0);
    });
    timelion.init();
    it("should not be loaded", function() {
        expect(timelion.loaded).toBe(false);
        // expect(timelion.html).toEqual('');
    });

    describe("data", function() {

        beforeAll(function(done) {
            timelion.reset();
            setTimeout(function() {
                timelion.load( timelion_data_filename )
                .then(function(response) { done() })
                .catch(function(error) { console.log(error); done() })
            }, 1);
        });

        it("should be loaded", function() {
            expect(timelion.loaded).toBe(true);
        });
        it("should contain at least one record", function() {
            expect(typeof timelion.data).toEqual('object');
            expect(timelion.data.length).toBeGreaterThan(0);
            timelion.data.forEach(function(event){});
        });
        it("should contain valid events", function() {
            timelion.data.forEach(function(event){
                expect(event.date.length).toEqual(3);
                expect(typeof event.date[0]).toEqual('number');
                expect(typeof event.date[1]).toEqual('number');
                expect(typeof event.date[2]).toEqual('number');
                expect(typeof event.offset).toEqual('number');
                expect(typeof event.width).toEqual('number');
                expect(typeof event.title).toEqual('string');
            });
        });
        it("should have valid years", function() {
            expect(typeof timelion.first_year).toEqual('number');
            expect(typeof timelion.last_year).toEqual('number');
            expect(timelion.first_year).toBeGreaterThan(0);
            expect(timelion.last_year).toBeGreaterThan(0);
            expect(timelion.last_year).toBeGreaterThanOrEqual(timelion.first_year);
            expect(typeof timelion.years[timelion.first_year]).toEqual('object');
        });
    });

    describe("render", function() {

        it("should not be rendered", function() {
            expect(timelion.rendered).toBe(false);
        });

        describe("unloaded", function() {

            beforeAll(function(done) {
                timelion.reset();
                setTimeout(function() {
                    timelion.render().then(function(response) {
                      done();
                    }, function(error) {
                      done();
                    })
                }, 1);
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
                    .then(function(response) {
                        timelion.render().then(function(response) {
                          done();
                        }, function(error) {
                          done();
                        })
                    });
                }, 1);
            });

            it("should be rendered", function() {
                expect(timelion.rendered).toBe(true);
            });
        });

    });

});
