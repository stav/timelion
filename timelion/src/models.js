/*
 * Models
 */
"use strict"

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

  async load ( filename )
  {
    const data = await http.get_json_data( filename );
    if ( data && data.events ){
      console.log(data)
      this._loaded = true;
    }
  }

}

/**
 * The browser doesn't understand exports
 */
try {
  module.exports = exports = {
    Timelion,
  };
  // Probably running in node
} catch (e) {
  // Probably running in a browser
}
