describe("timelion", function() {
  var
    timelion = window.timelion;

  it("should be an object", function() {
    expect(typeof timelion).toEqual('object');
  });

  it("should not be loaded", function() {
    expect(timelion.loaded).toBe(false);
  });

  describe("load", function() {
    var
      timelion = window.timelion,
      timelion_data_filename = '../app/example.json',
      data,
      _;

    beforeEach(function(done) {
      setTimeout(function() {
        data = timelion.load( timelion_data_filename );
        done();
      }, 1);
    });

    it("should be loaded", function() {
      expect(timelion.loaded).toBe(true);
    });

    describe("file name", function() {
      it("should be a string", function() {
        expect(typeof timelion_data_filename).toEqual('string');
      });
    });

    describe("file data", function() {
      it("should be an object", function() {
        expect(typeof data).toEqual('object');
      });
    });
  });

});
