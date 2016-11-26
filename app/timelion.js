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
 * - utils
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
            _day_width = timelion.year_width / 12 / 30,  // rough numbers
            _byears = _events.map(function(e){return u.first(_e.get_beg_triplet(e))}),
            _eyears = _events.map(function(e){return u.first(_e.get_end_triplet(e))}),
            _years = _byears.concat(_eyears).filter(Boolean),
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
            _beg_date = event.date[0],
            _end_date = event.date[1] || [],
            _daily_ms = 24 * 60 * 60 * 1000,
            first_year = timelion.years.values().next().value.year,
            days_in_month = 30,
            months_in_year = 12,
            year_length = timelion.year_width,
            month_length = year_length / months_in_year,
            day_length = month_length / days_in_month,
            beg_year  = _beg_date[0],
            beg_month = _beg_date[1],
            beg_day   = _beg_date[2],
            end_year  = _end_date[0],
            end_month = _end_date[1],
            end_day   = _end_date[2],
            diff_ms, diff_days,
            _;

        // http://jesusnjim.com/common/julian-gregorian.html
        // number of days must be processed without the epoch or you get the offset of 4719 years or so
        function GregorianToDTime(Y, Mo, D ) {
            var a=Math.floor((14-Mo)/12);
            var y=Y/*+4800*/-a;
            var m=Mo+(12*a)-3;
            var JD = D + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045+32044+60;
            return JD * 1000 * 60 * 60 * 24;
        }
        function GregorianDiffWithoutEpoch( yr1, mo1, dy1,  yr2, mo2, dy2 ) {
            var dt1 = GregorianToDTime( yr1, mo1, dy1 );
            var dt2 = GregorianToDTime( yr2, mo2, dy2 );
            return dt1 - dt2;
        }

        // Calculate offset
        diff_ms = GregorianDiffWithoutEpoch( beg_year, beg_month || 1, beg_day || 1, first_year, 1, 1 );
        diff_days = parseInt( diff_ms / _daily_ms );
        event.offset = diff_days * day_length;

        // Calculate width
        if ( end_year !== undefined ){
            diff_ms = GregorianDiffWithoutEpoch( end_year, end_month || 12, end_day || 30, beg_year, beg_month || 1, beg_day || 1 );
            diff_days = parseInt( diff_ms / _daily_ms );
            event.width = diff_days * day_length;
        } else {
            if (beg_day){
                event.width = day_length;
            } else if (beg_month){
                event.width = month_length;
            } else {
                event.width = year_length;
            }
        }
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
                    function(error){reject(error)})
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
                    function(error){reject(error)})
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
                _load_years()
                _load_events()
                timelion.loaded = true
            },
            function(error){
                // NOTE: refactor for individual requests/responses
                // A 404 response (because it is rejected) will terminate on filter (no dates)
                throw error
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
        if ( u.isFilled( date_input )) {
            // Short circuit if first arary element is a number
            if ( u.isNumber( date_input[0] )){
                return [
                    date_input[0],
                    date_input.length > 1 ? date_input[1] : month_default,
                    date_input.length > 2 ? date_input[2] : day_default
                ]
            }
            // If we have a single string element then try to make it a date
            if ( date_input.length === 1 && u.isString( date_input[0] )){
               date = new Date( date_input );
            }
        }
        // Maybe we already have a date
        else
        if ( u.isDate( date_input ))
            date = date_input;

        // Return the the date parts as tuple triple
        if ( u.isValidDate( date ))
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
                // The first date is always the beginning date
                return _get_date_triplet( event.date[0], 1, 1 )
            },
            get_end_triplet: function( event ){
                // If we only have one date then it is a single event
                // One day, one month or one year
                if ( event.date.length === 1 )
                    return _get_date_triplet( event.date[0], 12, 30 );

                // If we have two dates then use the second as the end date
                if ( event.date.length > 1 )
                    if ( u.isFilled( event.date[1] ) )
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
            timelion.rendered = false;
            timelion.loaded = false;
            timelion.years = new Map();
            timelion.year_width = timelion.config.year_width;
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
                    $canvas = document.getElementById('timelion'),
                    events = document.createElement('div'),
                    $years = document.createElement('div'),
                    _;

                // Years

                $years.id = 'timelion-years';
                $years.class = 'comment_';

                timelion.years.forEach(function( year ){
                    var
                        $year = document.createElement('div'),
                        $text = document.createElement('span'),
                        _;

                    $year.classList.add('year');
                    $year.style.width = year.width.toFixed(2) + 'px';
                    $text.innerText = year.year + (timelion.config.show_age ? (' <i>(' + year.age + ')</i>') : '')
                    $year.innerHTML = $text.outerHTML;
                    $year.setAttribute('data-year', year.year)
                    $years.appendChild( $year )
                })
                $canvas.appendChild( $years )

                // Events

                events.id = 'timelion-events';

                for (var i = 0; i < timelion.events.length; i++) {
                    var
                        event = timelion.events[i],
                        $event = document.createElement('div'),
                        $line = document.createElement('div'),
                        $data = document.createElement('b'),
                        $text = document.createTextNode( event.title ),
                        _;

                    timelist.handleClick( $event )

                    $data.innerHTML = event.date;

                    $line.classList.add('line');
                    $line.style.width = event.width.toFixed(2) + 'px';

                    if ( event.id )
                    $event.id = event.id;
                    $event.title = event.title;
                    $event.style.marginLeft = event.offset.toFixed(2) + 'px';
                    $event.classList.add('event');
                    $event.setAttribute('data-index', i)
                    $event.appendChild( $line )
                    $event.appendChild( $data )
                    $event.appendChild( $text )

                    events.appendChild( $event )
                };

                $canvas.appendChild( events )

                // Resolution

                timelion.rendered = true;
                resolve()
            });
        },

        update: function(){

            // Years

            var
                $years = document.getElementById('timelion-years'),
                years = u.toArray( $years.children ),
                _;

            _load_years()

            years.forEach(function( $year ){
                var
                    year_number = parseInt($year.dataset.year),
                    year = timelion.years.get( year_number ),
                    _;
                $year.style.width = year.width.toFixed(2) + 'px';
            })

            // Events

            var
                $events = document.getElementById('timelion-events'),
                events = u.toArray( $events.children ),
                _;

            _load_events()

            events.forEach(function( $event ){
                var
                    index = $event.dataset.index,
                    event = timelion.events[ index ],
                    $line = $event.querySelector('.line'),
                    _;
                $event.style.marginLeft = event.offset.toFixed(2) + 'px';
                $line.style.width = event.width.toFixed(2) + 'px';
            })
        }
    }
})
