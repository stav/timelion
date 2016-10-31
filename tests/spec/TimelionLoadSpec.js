describe("load", function() {
  var
    timelion = window.timelion,
    timelion_data_filename = '../app/timelion.json',
    data,
    _;

  beforeEach(function(done) {
    setTimeout(function() {
      data = timelion.load( timelion_data_filename );
      done();
    }, 1);
  });

  describe("file name", function() {
    it("should be string", function() {
      expect(typeof timelion_data_filename).toEqual('string');
    });
  });

  describe("file data", function() {
    it("should be object", function() {
      expect(typeof data).toEqual('object');
    });
  });
});
