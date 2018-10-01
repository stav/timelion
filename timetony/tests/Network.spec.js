import http from '../src/assets/js/entities/http';

const SENTINEL = 0xff;

describe("Testing async functions", () => {

  it("Should work with async/await", async () => {
    expect(await returnTrueAsync()).toEqual(SENTINEL)
  })

})

describe("Testing http module", () => {

  const filename = 'data/example.json';

  it("Should exist", () => {
    expect(typeof http).toEqual('object')
  })

  // it("Should get JSON", async () => {
  //   const data = await http.get_json_data( filename );
  //   expect(typeof data).toEqual(Object)
  // })

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
