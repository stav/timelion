/**
 * Class definitions
 */
"use strict"

import calen from './calendar';
import utils from './utils';
import domui from './domui';

const TODAY = new Date();

/**
 * Event parses dates from an object to calculate a start date & end date
 */
class Event
{
  /**
   * Accept a an array of date triplets of the form [ year, month, day ]
   */
  constructor ( event )
  {
    this.offset = 100;
    this.width = 100;
    this.sdate = new Date(...this._getStarTriplet( event.date ));
    this.edate = new Date(...this._getEndrTriplet( event.date ));
    this.title = event.title;
    this._input = event;
  }

  /**
   * Make sure we have an actual triplet (Array of length 3)
   */
  _getTriplet( triplet )
  {
    const _triplet = triplet || [];
    const month = _triplet[1];
    const year = _triplet[0];
    const day = _triplet[2];
    return [ year, month, day ]
  }

  /**
   * Parse out our start date
   */
  _getStarTriplet( dates_as_pair_of_triplets )
  {
    const start_triplet = this._getTriplet( dates_as_pair_of_triplets[0] );
    const month = start_triplet[1] || calen.JAN;  // One-based index: January = 1
    const year = start_triplet[0] || TODAY.getFullYear();
    const day = start_triplet[2] || 1;
    return [ year, month - 1, day ]  // Convert month to zero-based index: January = 0
  }

  /**
   * Parse out our end date
   */
  _getEndrTriplet( dates_as_pair_of_triplets )
  {
    const
      start_triplet = this._getStarTriplet( dates_as_pair_of_triplets ),
      start_date = dates_as_pair_of_triplets[0],
      start_month = start_date && start_date[1],
      start_year = start_date && start_date[0],
      start_day = start_date && start_date[2],
      end_date = dates_as_pair_of_triplets[1],
      end_triplet = this._getTriplet( end_date ),
      year = end_date ? (end_triplet[0]) : start_triplet[0],
      month = end_date ? (end_triplet[1] || calen.DEC) : (start_month ? start_month : calen.DEC),  // One-based index: January = 1
      last_day = new Date( year, month, 0).getDate(),  // month is used here as a zero-based index by not adding 1 with the day of 0
      day = end_date ? (end_triplet[2] || last_day) : (start_day ? start_day : last_day);
    return [ year, month - 1, day ]  // Convert month to zero-based index: January = 0
  }

}


class Timelion
{
  constructor ()
  {
    this.reset()
  }

  reset ()
  {
    this.events = [];
    this.loaded = false;
    this.rendered = false;
    this.years = new Map();
    // document.getElementById('timelion').innerHTML = '';
  }

  async load_file ( filename )
  {
    const data = await http.get_json_data( filename );
    if ( data && data.events ){
      this.loaded = true;
    }
  }

  async load_data ( data )
  {
    for ( const event of data.events ){
      if ( !utils.isEmpty( event ))
        this.events.push( new Event( event ))
    }
    this.loaded = true;
  }

  async render ()
  {
    this.render_years()
    this.render_events()
    this.rendered = true;
  }

  render_years ()
  {
    const show_age = true;
    let $years = domui.ele('div');

    $years.id = 'timelion-years';

    const start_dates = this.events.map( event => event.sdate );
    const finis_dates = this.events.map( event => event.edate );
    const first_year = new Date(Math.min(...start_dates)).getFullYear();
    const final_year = new Date(Math.max(...finis_dates)).getFullYear();
    console.log(first_year, final_year)

    for (
      let year = first_year, age = 0;
      year <= final_year + 1;
      year++, age++
    ){
      let $year = domui.ele('div');
      let $text = domui.ele('span');

      $year.classList.add('year');
      $year.style.width = '55px';
      $text.innerHTML = year + (show_age ? (' <i>(' + age + ')</i>') : '');
      $year.innerHTML = $text.outerHTML;
      $year.setAttribute('data-year', year)
      $years.appendChild( $year )
    }
    domui.add( $years )
  }

  render_events ()
  {
    let i = 0;
    let $events = domui.ele('div');

    $events.id = 'timelion-events';

    for ( const event of this.events )
    {
      console.log(event)
      let $event = domui.ele('div');
      let $line = domui.ele('div');
      let $data = domui.ele('b');
      let $text = domui.txt( event.title );

      $data.innerHTML = event.sdate;
      $line.classList.add('line');
      $line.style.width = event.width.toFixed(2) + 'px';

      $event.title = event.title;
      $event.style.marginLeft = event.offset.toFixed(2) + 'px';
      $event.classList.add('event');
      $event.setAttribute('data-index', i++)
      $event.appendChild( $line )
      $event.appendChild( $data )
      $event.appendChild( $text )
      $events.appendChild( $event )
    }
    domui.add( $events )
  }

}


export default Timelion
