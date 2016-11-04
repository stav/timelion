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
            _byears = _data.map(function(d){return _e.get_beg_triplet(d)[0]}),
            _eyears = _data.map(function(d){return _e.get_end_triplet(d)[0]}),
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
            var days = (year % 4 == 0) ? 366 : 365; // leap years
            timelion.years_list.push( year );
            timelion.years_hash[year] = {
                age: age,
                days: days,
                width: (days*_day_width)
            };
        }
    }

    function _load_event ( d ){
        var firstYear = timelion.first_year;
        var yearLength = timelion.config.year_width;
        var monthLength = yearLength/12;
        var dayLength = monthLength/30;

        var startYear  = timelion.e.get_beg_triplet(d)[0];
        var startMonth = timelion.e.get_beg_triplet(d)[1];
        var startDate  = timelion.e.get_beg_triplet(d)[2];
        var endYear    = timelion.e.get_end_triplet(d)[0];
        var endMonth   = timelion.e.get_end_triplet(d)[1];
        var endDate    = timelion.e.get_end_triplet(d)[2];
        var width = 0;

        // Calculate offset
        var startTime = new Date(firstYear, 0, 1);
        var endTime = new Date(startYear, startMonth ? startMonth-1 : 0, startDate || 1);
        var daysDiff = (endTime - startTime)/(24*60*60*1000);
        d.offset = daysDiff*dayLength;

        // Calculate width
        if (endYear){
            var _endMonth = endMonth ? endMonth-1 : 11;
            var _endDate = endDate || new Date(endYear, _endMonth+1, 0).getDate();
            startTime = new Date(startYear, startMonth ? startMonth-1 : 0, startDate || 1);
            endTime = new Date(endYear, _endMonth, _endDate);
            daysDiff = (endTime - startTime)/(24*60*60*1000);
            width = daysDiff*dayLength;
        } else {
            if (startDate){
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
        timelion.data.forEach(function(d){
            _load_event( d )
        })
    }

    function _load_dom (){
        timelion.$canvas = document.getElementById('timelion');
        timelion.$canvas.innerHTML = '';
    }

    function _load ( data ){
        timelion.data = data.data;
        _load_years()
        _load_events()
        _load_dom()
        timelion.loaded = true
    }

    function _get_date_triplet ( date, month_default, day_default ){
        return [
            date[0],
            date.length > 1 ? date[1] : month_default,
            date.length > 2 ? date[2] : day_default
        ]
    }

    return {

        data: undefined,
        loaded: undefined,
        rendered: undefined,
        last_year: undefined,
        first_year: undefined,

        config: {
            year_width: 120, // pixels
            show_age: true   // show age on year axis
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
                            data = JSON.parse(xhr.responseText);
                        }
                        catch (e){
                            reject('File is not JSON ('+xhr.responseText+')');
                        }
                        if ('data' in data){
                            resolve(_load( data ))
                        }
                        else
                            reject('File contains no "data" ('+xhr.status+')')
                    }
                    else
                        reject('Could not load ('+filename+') status ('+xhr.status+')')
                };
                xhr.send();
            });
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

                    event.addClassName('event');
                    event.style = 'margin-left:' + d.offset.toFixed(2) + 'px';
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
