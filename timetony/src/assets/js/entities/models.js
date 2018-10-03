/**
 * Class definitions
 */
"use strict"

import calen from './calendar';
import utils from './utils';

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
    let
      $canvas = document.getElementById('TimeL10N'),
      $years = document.createElement('div'),
      show_age = true,
      _;

    $years.id = 'timelion-years';

    const start_dates = this.events.map( event => event.sdate );
    const finis_dates = this.events.map( event => event.edate );
    const first_year = new Date(Math.min(...start_dates, ...finis_dates)).getFullYear();
    const final_year = new Date(Math.max(...start_dates, ...finis_dates)).getFullYear();
    console.log(first_year, final_year)

    for (
      let year = first_year, age = 0;
      year <= final_year + 1;
      year++, age++
    ){
      let
        $year = document.createElement('div'),
        $text = document.createElement('span'),
        _;

      $year.classList.add('year');
      $year.style.width = '55px';
      $text.innerHTML = year + (show_age ? (' <i>(' + age + ')</i>') : '');
      $year.innerHTML = $text.outerHTML;
      $year.setAttribute('data-year', year)
      $years.appendChild( $year )
    }
    $canvas.appendChild( $years )
    this.rendered = true;
  }

}


export default Timelion
