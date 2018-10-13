"use strict";

/**
 * Request url and return the JSON result as an Object
 */
async function get_json_data ( url )
{
  console.log(url)
  return JSON.parse( await get_json( url ))
}

/**
 * Request url and return the JSON result
 */
async function get_json ( url )
{
  return await get( url, 'application/json' )
}

/**
 * Request url and return the result
 */
function get ( url, accept ){
  return new Promise(function( resolve, reject ) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true) // true for async

    if ( accept )
      xhr.setRequestHeader('Accept', accept);

    xhr.onload = function(){
      if (xhr.readyState === 4) {
        if (xhr.status == 200)
            resolve( xhr.responseText );
        else
            reject('Could not load ('+ url +') status ('+ xhr.status +')');
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null)
  })
}

export default {

    get_json_data,

}
