describe("Promise", function() {

  it("should be a Promise", function() {
    expect( typeof Promise ).toEqual('function');
    expect( Promise.name ).toEqual('Promise');
  });

  describe("resolution", function() {
      var
        promise, result;

    beforeEach(function(done) {
      setTimeout(function() {
        promise = new Promise(function( resolve, reject ) { resolve(null) });
        promise.then(function(response) {
          result = response
          done();
        }, function(error) {
          done();
        })
      }, 1);
    });

    it("should resolve", function() {
      expect(result).toBe(null);
    });
  });

  describe("rejection", function() {
      var
        promise, result;

    beforeEach(function(done) {
      setTimeout(function() {
        promise = new Promise(function( resolve, reject ) { reject(null) });
        promise.then(function(response) {
          done();
        }, function(error) {
          result = error
          done();
        })
      }, 1);
    });

    it("should reject", function() {
      expect(result).toBe(null);
    });
  });
});
