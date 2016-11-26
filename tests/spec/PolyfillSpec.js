describe("polyfill", function() {

  it("should expose the Date method: toLocaleFormat", function() {
    expect( typeof (new Date()).toLocaleFormat ).toEqual('function');
  });

});
