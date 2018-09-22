
/*
 * Timelion
 */
class Timelion
{
  constructor ()
  {
    this._loaded = false;
  }

  loaded ()
  {
    return this._loaded
  }

}

try {
  module.exports = exports = Timelion;
} catch (e) {
  // Probably running in a browser
}
