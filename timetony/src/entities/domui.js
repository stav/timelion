"use strict";

/**
 * Return a DOM element
 */
function ele ( tag )
{
  return document.createElement( tag )
}

/**
 * Return a DOM text node
 */
function txt ( text )
{
  return document.createTextNode( text )
}

/**
 * Add the supplied element to the DOM
 */
function add ( element )
{
  let $canvas = document.getElementById('timelion');
  $canvas.appendChild( element )
}

export default {

    add,
    ele,
    txt,

}
