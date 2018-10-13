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
