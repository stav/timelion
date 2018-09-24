const SRC = '../src';
const SENTINEL = 0xff;

describe("Testing async functions", () => {

  it("Should work with async/await", async () => {
    expect(await returnTrueAsync()).toEqual(SENTINEL)
  })

})

describe("Testing http module", () => {

  const http = require(`${SRC}/http`);

  it("Should exist", async () => {
    expect(http).toEqual(Object())
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
