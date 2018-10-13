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
 * Find the correct stylesheet rule
 */
function getSelectorRule ( text )
{
  let sheet = document.styleSheets[0];  // Assume we only have one stylesheet

  for ( let rule of sheet.cssRules )
  {
    if ( rule.selectorText === text )
      return rule
  }
}

/**
 * Zoom in or out based on the positive or negative factor
 */
function zoom ( timelion, factor )
{
  // Update the years
  const w = timelion.year_width += factor;
  let rule = getSelectorRule('#timelion-years .year');
  rule.style.width = `${w}px`;

  // Update the events
  timelion.setup_events()
  let $events = document.getElementById('timelion-events').getElementsByClassName('event');
  for ( let i = 0; i < timelion.events.length; i++ )
  {
    const event = timelion.events[ i ];
    const width = event.width.toFixed(2);
    const offset = event.offset.toFixed(2);
    let $event = $events[ i ];
    let $line = $event.querySelector('.line');
    let $mark = $event.querySelector('.mark');
    $event.style.marginLeft = offset + 'px';
    $line.style.width = width + 'px';
    $mark.style.left = `-${width}px`;
  }
}

/**
 * Handle keyboard events
 */
function keyPress ( event )
{
  if (event.key === '1') {
      zoom( event.view.timelion, -1 )  // zoom out
  }
  else if (event.key === '2') {
      zoom( event.view.timelion, 1 )  // zoom in
  }
}

function renderYears ( first_year, final_year )
{
  const show_age = true;
  let $years = ele('div');

  $years.id = 'timelion-years';

  for (
    let year = first_year, age = 0;
    year <= final_year + 1;
    year++, age++
  ){
    let $year = ele('div');
    let $text = ele('span');

    $year.classList.add('year');
    // $year.style.width = this.year_width + 'px';
    $text.innerHTML = year + (show_age ? (' <i>(' + age + ')</i>') : '');
    $year.innerHTML = $text.outerHTML;
    $year.setAttribute('data-year', year)
    $years.appendChild( $year )
  }
  add( $years )
}

function renderEvents ( events )
{
  let i = 0;
  let $events = ele('div');

  $events.id = 'timelion-events';

  for ( const event of events )
  {
    console.log(event)
    const w = event.width.toFixed(2);

    let $event = ele('div');
    let $line = ele('div');
    let $mark = ele('span');
    let $data = ele('i');
    let $text = txt( event.title );

    $line.classList.add('line');
    $line.style.width = w + 'px';

    $data.innerHTML = event.sinput + (event.einput ? ` - ${event.einput}` : '');

    $mark.classList.add('mark');
    $mark.appendChild( $data )
    $mark.appendChild( $text )
    $mark.style.left = `-${w}px`;

    $event.title = event.title;
    $event.style.marginLeft = event.offset.toFixed(2) + 'px';
    $event.classList.add('event');
    $event.setAttribute('data-index', i++)
    $event.appendChild( $line )
    $event.appendChild( $mark )

    $events.appendChild( $event )
  }
  add( $events )
}

export default {

    keyPress,
    renderYears,
    renderEvents,

}
