const SRC = '../src';

describe("Timelion", function() {

  const Timelion = require(`${SRC}/Timelion`);

  it("should be a function", function() {
      expect(typeof Timelion).toEqual('function');
  });

});
