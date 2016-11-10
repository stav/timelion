/**
 * Timelion heavy lifting
 *
 * Requires:
 *
 * - timelyze: text parseing
 * - httplibe: promise-based url resolution
 */
(function( root, factory ){
    root.timelion = factory()
})(this, function(){
    "use strict"

    /**
     * Load year-based data
     *
     * Updates self:
     *
     * - year_first
     * - year_last
     * - years_hash
     * - years_list
     */
    function _load_years (){
        var
            _e = timelion.e,
            _events = timelion.events,
            _day_width = timelion.config.year_width/12/30,  // rough numbers
            _byears = _events.map(function(e){return _e.get_beg_triplet(e)[0]}),
            _eyears = _events.map(function(e){return _e.get_end_triplet(e)[0]}),
            _years = _byears.concat(_eyears),
            _;

        timelion.years_hash = {};
        timelion.years_list = [];
        timelion.year_first = Math.min.apply(null, _years);
        timelion.year_last = Math.max.apply(null, _years);

        for (
            var year = timelion.year_first, age = 0;
            year <= timelion.year_last + 1;
            year++, age++
        ){
            var days = (year % 4 == 0) ? 366 : 365; // rudimentary leap years
            timelion.years_list.push( year );
            timelion.years_hash[year] = {
                age: age,
                days: days,
                width: (days*_day_width)
            };
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

        var firstYear = timelion.year_first;
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

    function _get_search ( event ){
        if ( 'search' in event ){
            var url = 'https://en.wikipedia.org/w/api.php'
                +'?format=json'
                +'&action=opensearch'
                +'&search='+ event.search;
            return new Promise(function( resolve, reject ) {
                httplibe.get_json( url )
                .then(function( data ){
                    _extend_event( event, data )
                    resolve()
                },
                function( error ){
                    reject( error )
                })
            })
        }
    }

    function _extend_event ( event, data ){
        var
            name = data[1][0],
            info = data[2][0],
            _;

        if ( name ) event.title = name;

        if ( info === undefined ) {
            console.log('No info found for event:', event, data)
            return
        }

        var from_to_dates_pair = timelyze.parse_dates( info );
        if ( from_to_dates_pair === undefined ) {
            console.log('Dates could not be parsed from "'+ info +'" for event:', event, data)
            return
        }

        event.date = from_to_dates_pair;
    }

    function _fake_search ( event ){
        if ( 'search' in event ){
            // const json = '['
            //     +'"William_Luther_Pierce",'
            //     +'["William Luther Pierce"],'
            //     +'["William Luther Pierce III (September 11, 1933 – July 23, 2002) was an American white nationalist and political activist."],'
            //     +'["https://en.wikipedia.org/wiki/William_Luther_Pierce"]]';
            // const json = '["David Icke",["David Icke","David Icke, the Lizards and the Jews","David McKellar","David McKenzie (footballer)","Dave Dickenson","David McKey","David Hickernell","David Vickers","David McKee","David McKenzie (economist)"],["David Vaughan Icke (/aɪk/, born 29 April 1952) is an English writer and public speaker. A former footballer and sports broadcaster, Icke has made his name since the 1990s as a professional conspiracy theorist, calling himself a \\"full time investigator into who and what is really controlling the world.\\" He is the author of over 20 books and numerous DVDs, and has lectured in over 25 countries, speaking for up to 10 hours to audiences that cut across the political spectrum.","","David McKellar is a retired Scottish football goalkeeper and manager, best remembered for his time in the Football League with Carlisle United, making over 160 appearances for the club over two spells.","David McKenzie (born 1 September 1942) is a former Australian rules footballer who played with Fitzroy in the Victorian Football League (VFL).","David Dickenson (born January 11, 1973) is a Canadian football head coach with the Calgary Stampeders and former professional Canadian football player with the Stampeders and the BC Lions.","David McKey (born December 3, 1954) coached women`s basketball at St. Edward`s University (1984–1994) and Lamar University (1995-1998).","David S. \\"Dave\\" Hickernell (born January 2, 1959) is a Republican member of the Pennsylvania House of Representatives for the 98th District and was elected in 2002. He currently sits on the House Agriculture and Rural Affairs, Local Government, and Transportation Committees.","David Vickers is a fictional character from the American soap opera One Life to Live portrayed by Tuc Watkins.","David McKee (born 2 January 1935) is a British writer and illustrator, chiefly of children`s books and animations.","David McKenzie is a lead economist at the World Bank`s Development Research Group, Finance and Private Sector Development Unit in Washington, D.C.."],["https://en.wikipedia.org/wiki/David_Icke","https://en.wikipedia.org/wiki/David_Icke,_the_Lizards_and_the_Jews","https://en.wikipedia.org/wiki/David_McKellar","https://en.wikipedia.org/wiki/David_McKenzie_(footballer)","https://en.wikipedia.org/wiki/Dave_Dickenson","https://en.wikipedia.org/wiki/David_McKey","https://en.wikipedia.org/wiki/David_Hickernell","https://en.wikipedia.org/wiki/David_Vickers","https://en.wikipedia.org/wiki/David_McKee","https://en.wikipedia.org/wiki/David_McKenzie_(economist)"]]'
            const json = '["William Luther Pierce",["William Luther Pierce"],["William Luther Pierce III (September 11, 1933 – July 23, 2002) was an American white nationalist and political activist."],["https://en.wikipedia.org/wiki/William_Luther_Pierce"]]'
            const data = JSON.parse(json);
            _extend_event( event, data )
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
        var promises = timelion.events.map(function(e){return _get_search(e)});
        return Promise.all( promises )
            .then(function(){
                // Remove any events that did not resolve dates
                timelion.events = timelion.events.filter(function(e){return e.date && e.date.length > 0});
                _setup_canvas()
            },
            function(error){
                console.log(error)
            })
    }

    function _get_date_triplet ( date_input, month_default, day_default ){
        if ( date_input && date_input.isArray() && date_input.length > 0 ) {
            if ( date_input.length === 1 && date_input[0].isString() ){
               var date = new Date( date_input );
               if ( date.isValid() )
                   return [
                       date.getFullYear(),
                       date.getMonth() + 1,
                       date.getDate()
                   ]
            }
            else if ( date_input[0].isNumber() ){
                return [
                    date_input[0],
                    date_input.length > 1 ? date_input[1] : month_default,
                    date_input.length > 2 ? date_input[2] : day_default
                ]
            }
        }
        console.log('Date input invalid: ', date_input.type(), date_input)

        return [ timelion.year_first ];
    }

    return {

        events: undefined,
        loaded: undefined,
        rendered: undefined,
        year_last: undefined,
        year_first: undefined,

        config: {
            year_width: 100, // pixels
            show_age: false   // show age on year axis
        },

        e: {
            get_beg_triplet: function( event ){
                return _get_date_triplet( event.date[0], 1, 1 )
            },
            get_end_triplet: function( event ){
                if ( event.date.length === 1 )
                    return _get_date_triplet( event.date[0], 12, 30 );
                if ( event.date.length > 1 )
                    return _get_date_triplet( event.date[1], 12, 30 )
            }
        },

        init: function(){
            var body = document.getElementsByTagName('body')[0];
            body.addEventListener('keypress', function (e) {
                // console.log('keypress', e.key, e)
                if ( e.key === "1" && timelion.config.year_width > 10 ){
                    timelion.reset()
                    timelion.config.year_width -= 10;
                    _setup_canvas()
                    timelion.render();
                }
                else
                if ( e.key === "2" ){
                    timelion.reset()
                    timelion.config.year_width += 10;
                    _setup_canvas()
                    timelion.render();
                }
            }, false);

            timelion.events = null;
            timelion.reset()
        },

        reset: function(){
            document.getElementById('timelion').innerHTML = '';
            timelion.$canvas = null;
            timelion.year_first = 0;
            timelion.year_last = 0;
            timelion.loaded = false;
            timelion.rendered = false;
        },

        load: function( filename ){
            return new Promise(function( resolve, reject ) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', filename, true);
                xhr.onload = function(){
                    var data;
                    if (xhr.status == 200){
                        try{
                            data = JSON.parse( xhr.responseText );
                        }
                        catch (e){
                            reject('File is not JSON ('+xhr.responseText+')');
                        }
                        if ('events' in data){
                            resolve(_load( data ))
                        }
                        else
                            reject('File contains no "events" ('+ xhr.status +')')
                    }
                    else
                        reject('Could not load ('+ filename +') status ('+ xhr.status +')')
                };
                xhr.send();
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

                events.id = 'timelion-events';
                years.id = 'timelion-years';
                years.class = 'comment_';

                timelion.years_list.forEach(function( y ){
                    var
                        year = document.createElement('div'),
                        text = document.createElement('span'),
                        _;

                    year.classList.add('year');
                    year.style = 'width:' + timelion.years_hash[y].width.toFixed(2) + 'px';
                    text.innerHTML = y + (timelion.config.show_age ? (' <i>(' + timelion.years_hash[y].age + ')</i>') : '')
                    year.innerHTML = text.outerHTML;
                    years.appendChild( year );
                })
                events.appendChild( years )

                timelion.events.forEach(function(event){
                    var
                        event_container = document.createElement('div'),
                        time = document.createElement('div'),
                        data = document.createElement('b'),
                        text = document.createTextNode( event.title ),
                        _;

                    data.innerHTML = event.date;

                    time.classList.add('time');
                    time.style = 'width:' + event.width.toFixed(2) + 'px';

                    event_container.title = event.title;
                    event_container.style = 'margin-left:' + event.offset.toFixed(2) + 'px';
                    event_container.classList.add('event');
                    event_container.appendChild( time )
                    event_container.appendChild( data )
                    event_container.appendChild( text )

                    if ( event.id )
                        event_container.id = event.id;

                    event_container.addEventListener("click", function(e) {
                        this.style.backgroundColor = this.style.backgroundColor ? '' : 'black';
                        console.log('click',
                            e.target.offsetTop,
                            e.target.offsetLeft,
                            e.target.offsetWidth,
                            e.target.offsetHeight,
                            ''
                        )
                    });

                    events.appendChild( event_container )
                });

                timelion.$canvas.appendChild( events )
                timelion.rendered = true;
                resolve()
            });
        }
    }
})
