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

  async load_file ( filename )
  {
    const data = await http.get_json_data( filename );
    if ( data && data.events ){
      console.log(data)
      this._loaded = true;
    }
  }

  async load_data ( data )
  {
    if ( data && data.events ){
      console.log(data)
      this._loaded = true;
    }
  }

}

export default Timelion
