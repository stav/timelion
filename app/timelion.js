/**
 * Timelion
 *
 * Requires:
 *
 * - timelist: listeners
 * - timelies: text parsing
 * - timelast: screen display
 * - httplibe: promise-based url resolution
 * - polyfill: prototype extensions
 */
(function( root, factory ){
    root.timelion = factory()
})(this, function(){"use strict"

    const

        OFFLINE = 0x00,
        WIKIPEDIA_API = 0x01,
        WIKIPEDIA_RAW = 0x02,
        ONLINE_SEARCH = WIKIPEDIA_RAW;

    /**
     * Load year-based data
     *
     * Updates self:
     *
     * - years
     */
    function _load_years (){
        var
            ty = timelion.years,
            _e = timelion.e,
            _events = timelion.events,
            _day_width = timelion.config.year_width/12/30,  // rough numbers
            _byears = _events.map(function(e){return _e.get_beg_triplet(e)[0]}),
            _eyears = _events.map(function(e){return _e.get_end_triplet(e)[0]}),
            _years = _byears.concat(_eyears),
            _first_year = Math.min.apply(null, _years),
            _final_year = Math.max.apply(null, _years),
            _;
        // Loop from first event year to final event year to set yearly data
        for (
            var year = _first_year, age = 0;
            year <= _final_year + 1;
            year++, age++
        ){
            const days = (year % 4 == 0) ? 366 : 365; // rudimentary leap years
            var year_map = ty.has( year ) ? ty.get( year ) : ty.set( year, {} ).get( year );
            year_map.age   = age;
            year_map.days  = days;
            year_map.year  = year;
            year_map.width = (days*_day_width);
        }
    }

    /**
     * Load an event
     *
     * Mogrifies event argument:
     *
     * - offset
     * - width
     */
    function _load_event ( event ){
        var
            _beg_date = timelion.e.get_beg_triplet(event),
            _end_date = timelion.e.get_end_triplet(event),
            _;

        var firstYear = timelion.years.values().next().value.year;
        var yearLength = timelion.config.year_width;
        var monthLength = yearLength/12;
        var dayLength = monthLength/30;

        var startYear  = _beg_date[0];
        var startMonth = _beg_date[1];
        var startDay   = _beg_date[2];
        var endYear    = _end_date[0];
        var endMonth   = _end_date[1];
        var endDay     = _end_date[2];
        var width = 0;

        // Calculate offset
        var startTime = new Date(firstYear, 0, 1);
        var endTime = new Date(startYear, startMonth ? startMonth-1 : 0, startDay || 1);
        var daysDiff = (endTime - startTime)/(24*60*60*1000);
        event.offset = daysDiff*dayLength;

        // Calculate width
        if (endYear){
            var _endMonth = endMonth ? endMonth-1 : 11;
            var _endDay = endDay || new Date(endYear, _endMonth+1, 0).getDate();
            startTime = new Date(startYear, startMonth ? startMonth-1 : 0, startDay || 1);
            endTime = new Date(endYear, _endMonth, _endDay);
            daysDiff = (endTime - startTime)/(24*60*60*1000);
            width = daysDiff*dayLength;
        } else {
            if (startDay){
                width = dayLength;
            } else if (startMonth){
                width = monthLength;
            } else {
                width = yearLength;
            }
        }
        event.width = width;
    }

    /**
     * Load event data
     *
     * Spin thru all the input event data
     */
    function _load_events (){
        timelion.events.forEach(function( event ){
            _load_event( event )
        })
    }

    /**
     * Search Wikipedia for given search term
     */
    function _search ( event ){
        if ( 'search' in event ){
            // Search Wikipedia API on the network
            if ( ONLINE_SEARCH === WIKIPEDIA_API ){
                var url = 'https://en.wikipedia.org/w/api.php'
                    +'?format=json'
                    +'&action=opensearch'
                    +'&search='+ event.search;
                return new Promise(function( resolve, reject ) {
                    httplibe.get_json_data( url )
                    .then(function( data ){
                        timelies.extend_event_api( event, data )
                        resolve()
                    },
                    function( error ){
                        reject( error )
                    })
                })
            }
            else
            // Search Wikipedia RAW pages on the network
            if ( ONLINE_SEARCH === WIKIPEDIA_RAW ){
                var url = 'https://en.wikipedia.org/w/index.php'
                    +'?action=raw'
                    +'&title='+ event.search;
                return new Promise(function( resolve, reject ) {
                    httplibe.get( url )
                    .then(function( text ){
                        timelies.extend_event_raw( event, text )
                        resolve()
                    },
                    function( error ){
                        reject( error )
                    })
                })
            }
            // Fake search results, network not accessed
            else {
                const json = '["William Luther Pierce",["William Luther Pierce"],["William Luther Pierce III (September 11, 1933 – July 23, 2002) was an American white nationalist and political activist."],["https://en.wikipedia.org/wiki/William_Luther_Pierce"]]'
                const data = JSON.parse( json );
                timelies.extend_event_api( event, data )
            }
        }
    }

    /**
     * Setup display canvas
     */
    function _setup_canvas () {
        _load_years()
        _load_events()
        timelion.$canvas = document.getElementById('timelion');
        timelion.$canvas.innerHTML = '';
        timelion.loaded = true
    }

    /**
     * Do the actual loading
     *
     * Note: this only resolves when all requests have been fulfilled.
     *  A better way to do it would be to load the events as they come in.
     */
    function _load ( data ) {
        // Remove all events that don't have either a date or a search
        timelion.events = data.events.filter(function(e){return e.date || e.search});

        // Request all searches up front, needs to be improved with dynamic loading
        var promises = timelion.events.map(function(e){return _search(e)});
        return Promise.all( promises )
            .then(function(){
                // Remove any events that did not resolve dates
                timelion.events = timelion.events.filter(function(e){return e.date && e.date.length > 0});
                _setup_canvas()
            },
            function(error){
                console.log(error)
                // Remove any events that did not resolve dates
                timelion.events = timelion.events.filter(function(e){return e.date && e.date.length > 0});
                _setup_canvas()
            })
    }

    /**
     * return the data tuple
     *
     * Format:
     *
     *  [
     *      Full Year e.g.: 1976,
     *      Month 1-based (1-12) no leading zero e.g.: 1 (January),
     *      Day of month 1-based (1-31) no leading zero e.g.: 9
     *  ]
     */
    function _get_date_triplet ( date_input, month_default, day_default ){
        var date;

        // Check if we have a non-empty array
        if ( date_input.isArray() && date_input.length > 0 ) {
            // Short circuit if first arary element is a number
            if ( date_input[0].isNumber() ){
                return [
                    date_input[0],
                    date_input.length > 1 ? date_input[1] : month_default,
                    date_input.length > 2 ? date_input[2] : day_default
                ]
            }
            // If we have a single string element then try to make it a date
            if ( date_input.length === 1 && date_input[0].isString() ){
               date = new Date( date_input );
            }
        }
        // Maybe we already have a date
        else
        if ( date_input.isDate() )
            date = date_input;

        // Return the the date parts as tuple triple
        if ( date.isValid() )
            return [
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate()
            ]
    }

    /**
     * Now begins the return object
     */
    return {

        years: undefined,
        events: undefined,
        loaded: undefined,
        rendered: undefined,

        config: {
            year_width: 18,  // pixels
            show_age: false  // show age on year axis
        },

        e: {
            get_beg_triplet: function( event ){
                // The beginning date is always the first date given
                return _get_date_triplet( event.date[0], 1, 1 )
            },
            get_end_triplet: function( event ){
                // If we only have one date then it is a single event
                // One day, one month or one year
                if ( event.date.length === 1 )
                    return _get_date_triplet( event.date[0], 12, 30 );

                // If we have two dates then use the second as the end date
                if ( event.date.length > 1 )
                    if ( event.date[1].length )
                        return _get_date_triplet( event.date[1], 12, 30 );

                // We have two dates but the second one is empty so use today
                return _get_date_triplet( new Date() )
            }
        },

        init: function(){
            timelist.handleKeypress( document.getElementsByTagName('body')[0] )
            timelion.events = null;
            timelion.reset()
        },

        reset: function(){
            document.getElementById('timelion').innerHTML = '';
            timelion.years = new Map();
            timelion.loaded = false;
            timelion.rendered = false;
            timelion.$canvas = null;
            timelion.$events = null;
            timelion.$years = null;
        },

        load: function( filename ){
            return new Promise(function( resolve, reject ) {
                httplibe.get_json_data( filename )
                .then(function( data ){
                    if ('events' in data){
                        resolve(_load( data ))
                    }
                    else
                        reject('File contains no "events" ('+ xhr.status +')')
                },
                function( error ){
                    reject( error )
                })
            })
        },

        render: function(){
            return new Promise(function( resolve, reject ) {
                if ( !timelion.loaded ){
                    reject('Timelion not loaded, run load first');
                    return
                }
                var
                    events = document.createElement('div'),
                    years = document.createElement('div'),
                    _;

                // Years

                years.id = 'timelion-years';
                years.class = 'comment_';

                timelion.years.forEach(function( y ){
                    var
                        year = document.createElement('div'),
                        text = document.createElement('span'),
                        _;

                    year.classList.add('year');
                    year.style = 'width:' + y.width.toFixed(2) + 'px';
                    text.innerText = y.year + (timelion.config.show_age ? (' <i>(' + y.age + ')</i>') : '')
                    year.innerHTML = text.outerHTML;
                    years.appendChild( year )
                    y.$element = year;
                })
                timelion.$canvas.appendChild( years )
                timelion.$years = years;

                // Events

                events.id = 'timelion-events';

                timelion.events.forEach(function( event ){
                    var
                        event_container = document.createElement('div'),
                        line = document.createElement('div'),
                        data = document.createElement('b'),
                        text = document.createTextNode( event.title ),
                        _;

                    data.innerHTML = event.date;

                    line.classList.add('line');
                    line.style = 'width:' + event.width.toFixed(2) + 'px';

                    event_container.title = event.title;
                    event_container.style = 'margin-left:' + event.offset.toFixed(2) + 'px';
                    event_container.classList.add('event');
                    event_container.appendChild( line )
                    event_container.appendChild( data )
                    event_container.appendChild( text )

                    if ( event.id )
                        event_container.id = event.id;

                    timelist.handleClick( event_container )
                    events.appendChild( event_container )
                    event_container.timelion_event = event;
                    event.$container = event_container;
                    event.$line = line;
                });

                timelion.$canvas.appendChild( events )
                timelion.$events = events;

                // Resolution

                timelion.rendered = true;
                resolve()
            });
        },

        update: function(){
            // Years
            _load_years()
            timelion.years.forEach(function( year ){
                year.$element.style.width = year.width.toFixed(2) + 'px';
            })

            // Events
            _load_events()
            timelion.events.forEach(function( event ){
                event.$container.style.marginLeft = event.offset.toFixed(2) + 'px';
                event.$line.style.width = event.width.toFixed(2) + 'px';
            })
        }
    }
})
