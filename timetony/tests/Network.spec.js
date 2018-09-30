const SRC = '../src';
const SENTINEL = 0xff;

describe("Testing async functions", () => {

  it("Should work with async/await", async () => {
    expect(await returnTrueAsync()).toEqual(SENTINEL)
  })

})

function returnAsync() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(SENTINEL)
    }, 1)
  })
}

async function returnTrueAsync () {
  return SENTINEL
}
