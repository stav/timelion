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
    this._input = event;
    this.sinput = event.date[0];
    this.einput = event.date[1];
    this._input = event;
    this.title = event.title;
    this.sdate = new Date(...this._getStarTriplet( event.date ));
    this.edate = new Date(...this._getEndrTriplet( event.date ));
    this.offset = 0;
    this.width = 0;
  }

  /**
   * Set the offset from the beginning of the timeline
   */
  set_offset( tl )
  {
    const daily_ms = 24 * 60 * 60 * 1000;
    const days_in_month = 30;
    const months_in_year = 12;
    const month_length = tl.year_width / months_in_year;
    const day_length = month_length / days_in_month;
    const day = this.sdate.getDate();
    const year = this.sdate.getFullYear();
    const month = this.sdate.getMonth();
    const diff_ms = calen.dateDiff( year, month, day, tl.first_year, 1, 1 );
    const diff_days = parseInt( diff_ms / daily_ms );

    this.offset = diff_days * day_length;
  }

  /**
   * Set the width based on the timeline factors
   */
  set_width( tl )
  {

    const daily_ms = 24 * 60 * 60 * 1000;
    const days_in_month = 30;
    const months_in_year = 12;
    const month_length = tl.year_width / months_in_year;
    const day_length = month_length / days_in_month;
    const sday = this.sdate.getDate();
    const syear = this.sdate.getFullYear();
    const smonth = this.sdate.getMonth();
    const eday = this.edate.getDate();
    const eyear = this.edate.getFullYear();
    const emonth = this.edate.getMonth();
    const diff_ms = calen.dateDiff( eyear, emonth, eday, syear, smonth, sday );
    const diff_days = parseInt( diff_ms / daily_ms );

    this.width = diff_days * day_length;
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
    this.year_width = 55;
    // document.getElementById('timelion').innerHTML = '';
  }

  async load ( data )
  {
    // Load the data into the events
    for ( const event of data.events )
    {
      if ( !utils.isEmpty( event ))
        this.events.push( new Event( event ))
    }

    // Process the event data
    const start_dates = this.events.map( event => event.sdate );
    const finis_dates = this.events.map( event => event.edate );
    this.first_year = new Date(Math.min(...start_dates)).getFullYear();
    this.final_year = new Date(Math.max(...finis_dates)).getFullYear();

    // Load the events with processed info
    for ( const event of this.events )
    {
      event.set_offset( this );
      event.set_width( this );
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

    for (
      let year = this.first_year, age = 0;
      year <= this.final_year + 1;
      year++, age++
    ){
      let $year = domui.ele('div');
      let $text = domui.ele('span');

      $year.classList.add('year');
      $year.style.width = this.year_width + 'px';
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
      const w = event.width.toFixed(2);

      let $event = domui.ele('div');
      let $line = domui.ele('div');
      let $mark = domui.ele('span');
      let $data = domui.ele('i');
      let $text = domui.txt( event.title );

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
    domui.add( $events )
  }

}


export default Timelion
