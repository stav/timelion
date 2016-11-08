/**
 * Timelion heavy lifting
 *
 * Requires:
 *
 * - timelyze: text parseing
 */
(function( root, factory ){
    root.timelion = factory()
})(this, function(){
    "use strict"

    function _load_years (){
        var
            _e = timelion.e,
            _events = timelion.events,
            _day_width = timelion.config.year_width/12/30,
            _byears = _events.map(function(e){return _e.get_beg_triplet(e)[0]}),
            _eyears = _events.map(function(e){return _e.get_end_triplet(e)[0]}),
            _years = _byears.concat(_eyears),
            _;

        timelion.years_hash = {};
        timelion.years_list = [];
        timelion.first_year = Math.min.apply(null, _years);
        timelion.last_year = Math.max.apply(null, _years);

        for (
            var year = timelion.first_year, age = 0;
            year <= timelion.last_year + 1;
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

    function _load_event ( event ){
        var
            _beg_date = timelion.e.get_beg_triplet(event),
            _end_date = timelion.e.get_end_triplet(event),
            _;

        var firstYear = timelion.first_year;
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

    function _load_events (){
        timelion.events.forEach(function( e ){
            _load_event( e )
        })
    }

    function _load_dom (){
        timelion.$canvas = document.getElementById('timelion');
        timelion.$canvas.innerHTML = '';
    }

    function _get_search ( event ){
        if ( 'search' in event ){
            var url = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search='+ event.search;

            return new Promise(function( resolve, reject ) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onload = function(){
                    var data;
                    if (xhr.status == 200){
                        try{
                            data = JSON.parse( xhr.responseText );
                            console.log(xhr)
                            _extend_event( event, data )
                            resolve( data )
                        }
                        catch (error){
                            reject('File is not JSON ('+ xhr.responseText +') '+ error);
                        }
                    }
                    else
                        reject('Could not load ('+ url +') status ('+ xhr.status +')')
                };
                xhr.send();
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

    function _load ( data ) {
        // Remove all events that don't have either a date or a search
        timelion.events = data.events.filter(function(e){return e.date || e.search});

        // Request all searches up front, needs to be improved with dynamic loading
        var promises = timelion.events.map(function(e){return _get_search(e)});
        return Promise.all( promises )
            .then(function(){
                // Remove any events that did not resolve dates
                timelion.events = timelion.events.filter(function(e){return e.date && e.date.length > 0});
                _load_years()
                _load_events()
                _load_dom()
                timelion.loaded = true
            })
    }

    function _get_date_triplet ( date_tuple, month_default, day_default ){
        if ( date_tuple && date_tuple[0].isNumber() )
            return [
                date_tuple[0],
                date_tuple.length > 1 ? date_tuple[1] : month_default,
                date_tuple.length > 2 ? date_tuple[2] : day_default
            ];
        else
            return [ timelion.first_year ];
    }

    return {

        events: undefined,
        loaded: undefined,
        rendered: undefined,
        last_year: undefined,
        first_year: undefined,

        config: {
            year_width: 10, // pixels
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
            timelion.reset()
        },

        reset: function(){
            document.getElementById('timelion').innerHTML = '';
            timelion.$canvas = null;
            timelion.events = null;
            timelion.loaded = false;
            timelion.rendered = false;
            timelion.last_year = 0;
            timelion.first_year = 0;
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

        render: function( filename ){
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

                    year.addClassName('year');
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

                    time.addClassName('time');
                    time.style = 'width:' + event.width.toFixed(2) + 'px';

                    event_container.title = event.title;
                    event_container.style = 'margin-left:' + event.offset.toFixed(2) + 'px';
                    event_container.addClassName('event');
                    event_container.appendChild( time )
                    event_container.appendChild( data )
                    event_container.appendChild( text )

                    events.appendChild( event_container )
                });

                timelion.$canvas.appendChild( events )
                timelion.rendered = true;
                resolve()
            });
        }
    }
})
