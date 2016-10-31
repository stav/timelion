describe("timelion", function() {

  var timelion;

  beforeEach(function(done) {
    setTimeout(function() {
      timelion = window.timelion;
      timelion.load('../timelion/timelion.md');
      done();
    }, 1);
  });

  it("should be a function", function() {
    expect(typeof timelion).toEqual('object');
  });
});
