describe("polyfill", function() {

  it("should expose the Object method: type", function() {
    expect( typeof Object.type ).toEqual('function');
  });

});
