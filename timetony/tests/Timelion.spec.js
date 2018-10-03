import Timelion from '../src/assets/js/entities/models';
import utils    from '../src/assets/js/entities/utils';

describe("Timelion instance", function() {

    let timelion = new Timelion();
    const data = {
      "events": [
        {"date": [[1950]], "title": "1950"},
        {}
      ]
    }

    beforeEach(() => {
        timelion.reset();
    });

    it("should be an object", function() {
        expect(typeof timelion).toEqual('object');
    });

    it("should not be loaded", function() {
        expect(timelion.loaded).toEqual(false);
    });

    it("should load some data", async function() {
        await timelion.load_data(data)
        expect(timelion.loaded).toEqual(true);
    });

    it("should parse some data", async function() {
        await timelion.load_data(data)
        expect(timelion.events.length).toEqual(1);

        const event = timelion.events[0];
        expect(utils.type(event)).toEqual('Event');
        expect(utils.isValidDate(event.sdate)).toBe(true);
        expect(utils.isValidDate(event.edate)).toBe(true);

        expect(event.sdate.getFullYear()).toBe(1950);
        expect(event.sdate.getMonth()).toBe(0);
        expect(event.sdate.getDate()).toBe(1);

        expect(event.edate.getFullYear()).toBe(1950);
        expect(event.edate.getMonth()).toBe(11);
        expect(event.edate.getDate()).toBe(31);
    });

});
