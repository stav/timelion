/*
 * Timelion
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

  init ()
  {
    handleKeypress( document.getElementsByTagName('body')[0] )
  }

  async load ( filename )
  {
    console.log(filename)
    const data = await http.get_json_data( filename );
    if ( 'events' in data ){
      this._loaded = true;
    }
  }

}

/**
 * Add keypress event handler
 */
function handleKeypress ( body )
{
    body.addEventListener('keypress', function (e) {
      console.log(e)
    }, false);
}

/**
 * The browser doesn't understand exports
 */
try {
  module.exports = exports = Timelion;
  // Probably running in node
} catch (e) {
  // Probably running in a browser
}