describe("timelion", function() {

  var timelion;

  beforeEach(function() {
    timelion = window;
    timelion.fetch('../timelion/timelion.md');
  });

  it("should be a function", function() {
    expect(typeof timelion).toEqual('object');
  });
});
