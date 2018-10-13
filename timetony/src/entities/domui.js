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

/**
 * Zoom the years
 */
function zoom ( timelion, factor )
{
  const w = timelion.year_width += factor;
  let sheet = document.styleSheets[0];
  let rule = sheet.cssRules[36];
  rule.style.width = `${w}px`;

  timelion.setup_events()
  const $events = document.getElementById('timelion-events');
  for ( let $event of $events.getElementsByClassName('event') )
  {
    console.log($event)
  }
}

/**
 * Handle keyboard events
 */
function keyPress ( event )
{
  if (event.key === '1') {
      zoom( event.view.timelion, 1 )
  }
  else if (event.key === '2') {
      zoom( event.view.timelion, -1 )
  }
}

export default {

    add,
    ele,
    txt,
    keyPress,

}
