/**
 * Timelion heavy lifting
 */
(function( root, factory ){
    root.timelion = factory()
})(this, function(){
    "use strict"

    function _load_years (){
        var
            _e = timelion.e,
            _data = timelion.data,
            _day_width = timelion.config.year_width/12/30,
            _byears = _data.map(function(e){return _e.get_beg_triplet(e)[0]}),
            _eyears = _data.map(function(e){return _e.get_end_triplet(e)[0]}),
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

    function _load_event ( d ){
        var
            _beg_date = timelion.e.get_beg_triplet(d),
            _end_date = timelion.e.get_end_triplet(d),
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
        d.offset = daysDiff*dayLength;

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
        d.width = width;
    }

    function _load_events (){
        timelion.data.forEach(function( e ){
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
            re, matches, b, date_born, d, date_died,
            _;

        if ( name ) event.title = name;

        if ( info === undefined ) {
            console.log('No info found for event:', event, data)
            return
        }

        // ["(September 11, 1933 – July 23, 2002)", "September 11, 1933 ", " July 23, 2002"]
        re = new RegExp("\\(([^)]+)(?:–|-)([^)]+)\\)");
        matches = re.exec( info );
        if ( matches ){
            date_born = matches[1];
            date_died = matches[2];
            b = new Date( date_born );
            if ( !b.isValid() ) {
                console.log(b +': "'+ date_born +'" - '+ info)
                return
            }
            d = new Date( date_died );
            if ( !d.isValid() ) {
                console.log(d +': "'+ date_died +'" - '+ info)
                return
            }
            event.date = [
                [b.getFullYear(), b.getMonth()+1, b.getDate()],
                [d.getFullYear(), d.getMonth()+1, d.getDate()]];
            return
        }

        // "David Vaughan Icke (/aɪk/, born 29 April 1952) is an English writer and public speaker. A former footballer and sports broadcaster, Icke has made his name since the 1990s as a professional conspiracy theorist, calling himself a "full time investigator into who and what is really controlling the world." He is the author of over 20 books and numerous DVDs, and has lectured in over 25 countries, speaking for up to 10 hours to audiences that cut across the political spectrum."
        re = new RegExp("\\([^)]*born([^)]+?)(?:\\s+in\\s+[^)]+)?\\)");
        matches = re.exec( info );
        if ( matches ){
            date_born = matches[1];
            b = new Date( date_born );
            if ( !b.isValid() ) {
                console.log(b +': "'+ date_born +'" - '+ info)
                return
            }
            event.date = [
                [b.getFullYear(), b.getMonth()+1, b.getDate()],
                [2016]];
            return
        }

        console.log('Dates could not be parsed from "'+ info +'" for event:', event, data)
    }

    function _fake_search ( event ){
        if ( 'search' in event ){
            // const json = '['
            //     +'"William_Luther_Pierce",'
            //     +'["William Luther Pierce"],'
            //     +'["William Luther Pierce III (September 11, 1933 – July 23, 2002) was an American white nationalist and political activist."],'
            //     +'["https://en.wikipedia.org/wiki/William_Luther_Pierce"]]';
            const json = '["David Icke",["David Icke","David Icke, the Lizards and the Jews","David McKellar","David McKenzie (footballer)","Dave Dickenson","David McKey","David Hickernell","David Vickers","David McKee","David McKenzie (economist)"],["David Vaughan Icke (/aɪk/, born 29 April 1952) is an English writer and public speaker. A former footballer and sports broadcaster, Icke has made his name since the 1990s as a professional conspiracy theorist, calling himself a \\"full time investigator into who and what is really controlling the world.\\" He is the author of over 20 books and numerous DVDs, and has lectured in over 25 countries, speaking for up to 10 hours to audiences that cut across the political spectrum.","","David McKellar is a retired Scottish football goalkeeper and manager, best remembered for his time in the Football League with Carlisle United, making over 160 appearances for the club over two spells.","David McKenzie (born 1 September 1942) is a former Australian rules footballer who played with Fitzroy in the Victorian Football League (VFL).","David Dickenson (born January 11, 1973) is a Canadian football head coach with the Calgary Stampeders and former professional Canadian football player with the Stampeders and the BC Lions.","David McKey (born December 3, 1954) coached women`s basketball at St. Edward`s University (1984–1994) and Lamar University (1995-1998).","David S. \\"Dave\\" Hickernell (born January 2, 1959) is a Republican member of the Pennsylvania House of Representatives for the 98th District and was elected in 2002. He currently sits on the House Agriculture and Rural Affairs, Local Government, and Transportation Committees.","David Vickers is a fictional character from the American soap opera One Life to Live portrayed by Tuc Watkins.","David McKee (born 2 January 1935) is a British writer and illustrator, chiefly of children`s books and animations.","David McKenzie is a lead economist at the World Bank`s Development Research Group, Finance and Private Sector Development Unit in Washington, D.C.."],["https://en.wikipedia.org/wiki/David_Icke","https://en.wikipedia.org/wiki/David_Icke,_the_Lizards_and_the_Jews","https://en.wikipedia.org/wiki/David_McKellar","https://en.wikipedia.org/wiki/David_McKenzie_(footballer)","https://en.wikipedia.org/wiki/Dave_Dickenson","https://en.wikipedia.org/wiki/David_McKey","https://en.wikipedia.org/wiki/David_Hickernell","https://en.wikipedia.org/wiki/David_Vickers","https://en.wikipedia.org/wiki/David_McKee","https://en.wikipedia.org/wiki/David_McKenzie_(economist)"]]'
            const data = JSON.parse(json);
            _extend_event( event, data )
        }
    }

    function _load ( data ) {
        // Remove all events that don't have either a date or a search
        timelion.data = data.data.filter(function(e){return e.date || e.search});

        // Request all searches up front, needs to be improved with dynamic loading
        var promises = timelion.data.map(function(e){return _get_search(e)});
        return Promise.all( promises )
            .then(function(){
                // Remove any events that did not resolve dates
                timelion.data = timelion.data.filter(function(e){return e.date && e.date.length > 0});
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

        data: undefined,
        loaded: undefined,
        rendered: undefined,
        last_year: undefined,
        first_year: undefined,

        config: {
            year_width: 50, // pixels
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
            timelion.data = null;
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
                        if ('data' in data){
                            resolve(_load( data ))
                        }
                        else
                            reject('File contains no "data" ('+ xhr.status +')')
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

                timelion.data.forEach(function(d){
                    var
                        event = document.createElement('div'),
                        time = document.createElement('div'),
                        data = document.createElement('b'),
                        text = document.createTextNode( d.title ),
                        _;

                    data.innerHTML = d.date;

                    time.addClassName('time');
                    time.style = 'width:' + d.width.toFixed(2) + 'px';

                    event.title = d.title;
                    event.style = 'margin-left:' + d.offset.toFixed(2) + 'px';
                    event.addClassName('event');
                    event.appendChild( time )
                    event.appendChild( data )
                    event.appendChild( text )

                    events.appendChild( event )
                });

                timelion.$canvas.appendChild( events )
                timelion.rendered = true;
                resolve()
            });
        }
    }
})
