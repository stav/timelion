/**
 * Timelion heavy lifting
 */
(function( root, factory ){
    root.timelion = factory()
})(this, function(){
    "use strict"

    function load_years (){
        var
            _day_width = timelion.config.year_width/12/30,
            _years = timelion.data.map(function(d){return d.date[0]}),
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

    function load_event ( d ){
        var firstYear = timelion.first_year;
        var yearLength = timelion.config.year_width;
        var monthLength = yearLength/12;
        var dayLength = monthLength/30;

        var startYear = d.date[0];
        var startMonth = d.date[1];
        var startDate = d.date[2];
        var endYear = undefined;
        var endMonth = undefined;
        var endDate = undefined;
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

    function load_events (){
        timelion.data.forEach(function(d){
            load_event( d )
        })
    }

    function load_dom (){
        timelion.$canvas = document.getElementById('timelion');
        timelion.$canvas.innerHTML = '';
    }

    function load ( data ){
        timelion.data = data.data;
        load_years()
        load_events()
        load_dom()
        timelion.loaded = true
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

        init: function(){
            timelion.reset()
        },

        reset: function(){
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
                            resolve(load( data ))
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
                        text = document.createElement('b'),
                        _;

                    text.innerHTML = d.title;

                    time.addClassName('time');
                    time.style = 'width:' + d.width.toFixed(2) + 'px';
                    time.appendChild( text )

                    event.addClassName('event');
                    event.style = 'margin-left:' + d.offset.toFixed(2) + 'px';
                    event.appendChild( time )

                    events.appendChild( event )
                });

                timelion.$canvas.appendChild( events )
                timelion.rendered = true;
                resolve()
            });
        }
    }
})
