const SRC = '../../app/src';

describe("Timelion", function() {
  var Timelion = require(`${SRC}/Timelion`);

  it("should be a function", function() {
      expect(typeof Timelion).toEqual('function');
  });

});
