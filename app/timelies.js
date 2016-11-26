/**
 * Timelion analyzing - text parsing library
 *
 * Requires:
 *
 * - polyfill: prototype extensions
 */
(function( root, factory ){
    var timelies = factory()
    root.timelies = {
        extend_event_api: timelies.extend_event_api,
        extend_event_raw: timelies.extend_event_raw,
        _: null
    }
})(this, function(){
    "use strict"

    function _parse_info_for_two_dates( re, info ){
        var
            matches, bd, beg_date, ed, end_date,
            _;

        matches = re.exec( info );
        if ( matches ){
            beg_date = matches[1];
            bd = new Date( beg_date );
            if ( !bd.isValid() ) return;
            end_date = matches.length > 2 ? matches[2] : new Date();
            ed = new Date( end_date );
            if ( !ed.isValid() ) return;
            return [
                [bd.getFullYear(), bd.getMonth()+1, bd.getDate()],
                [ed.getFullYear(), ed.getMonth()+1, ed.getDate()]];
        }
    }

    function _parse_dates_api ( info ){
        var
            re, from_to_dates_pair,
            regexs,
            _;

        regexs = [
            // John Napier of Merchiston (/ˈneɪpɪər/; 1550 – 4 April 1617; also signed as Neper...
            "\\((?:[^)]+);([^);]+)(?:–|-)([^);]+);(?:[^)]+)\\)",

            // "(September 11, 1933 – July 23, 2002)", "September 11, 1933 ", " July 23, 2002"
            "\\(([^)]+)(?:–|-)([^)]+)\\)",

            // Willebrord Snellius (born Willebrord Snel van Royen) (1580 – 30 October 1626, Leiden) was a Dutch astronomer
            "\\(([^)]+)(?:–|-)([^)]+),(?:[^)]+)\\)",

            // "David Vaughan Icke (/aɪk/, born 29 April 1952) is an English...
            "\\([^)]*born([^)]+?)(?:\\s+in\\s+[^)]+)?\\)",

            // "World War I (WWI or WW1)... lasted from 28 July 1914 to 11 November 1918.
            "from (\\d{1,2} \\w+ \\d{4}) to (\\d{1,2} \\w+ \\d{4})",

            '' // Enable trailing comma
        ]
        for (var i = 0; i < regexs.length; i++) {
            if ( regexs[i] ){
                from_to_dates_pair = _parse_info_for_two_dates( new RegExp( regexs[i] ), info );
                if ( from_to_dates_pair && u.isArray(from_to_dates_pair) )
                    return from_to_dates_pair;
            }
        }
        console.log('No date parsed from:'+ info)
    }

    return {

        /**
         * Extend the event object with data found from search using the Wikipedia API
         */
        extend_event_api: function ( event, data ){
            var
                name = data[1][0],
                info = data[2][0],
                _;

            if ( name && !event.title ) event.title = name;

            if ( info === undefined ) {
                console.log('No info found for event:', event, data)
                return
            }

            var from_to_dates_pair = _parse_dates_api( info );
            if ( from_to_dates_pair === undefined ) {
                console.log('Dates could not be parsed from "'+ info +'" for event:', event, data)
                return
            }

            event.date = from_to_dates_pair;
        },

        /**
         * Extend the event object with data found from search using RAW Wikipedia text
         *
         * To do:
         *
         *   {"search": "Viktor Schauberger"},
         */
        // {{Infobox scientist
        // | name        = Nicolaus Copernicus
        // | image       = Nikolaus Kopernikus.jpg
        // | caption     = 1580 portrait (artist unknown) in the Old Town City Hall, [[Toruń]]
        // | birth_date  = {{birth date|df=yes|1473|2|19}}
        // | birth_place = {{nowrap|[[Toruń|Toruń (Thorn)]], [[Royal Prussia]],<br/>[[Kingdom of Poland (1385–1569)|Kingdom of Poland]]}}
        // | death_date  = {{death date and age|df=yes|1543|5|24|1473|2|19}}
        // | death_place = {{nowrap|[[Frombork|Frombork (Frauenburg)]],<br/>[[Prince-Bishopric of Warmia]],<br/>Royal Prussia, Kingdom of<br/>Poland}}
        // | field       = {{hlist|Astronomy |[[Canon law]] |Economics |Mathematics |Medicine |Politics}}
        extend_event_raw: function ( event, text ){
            // console.log(text.substr(0,1999))
            const
                date_rex = "^__!__XXX_date__=.*? {{ .+? ! (#4) (?:!(#2))? (?:!(#2))?",
                // birth_rex = "^__!__birth_date__=.*? {{ .+? ! (#4) (?:!(#2))? (?:!(#2))?",
                // death_rex = "^__!__death_date__=.*? {{ .+? ! (#4) (?:!(#2))? (?:!(#2))?",
                // birth_rex = /^\s*\|\s*birth_date\s*=.*?{{.+?\|(\d{4})(?:\|(\d{1,2}))?(?:\|(\d{1,2}))?/m,
                // death_rex = /^\s*\|\s*death_date\s*=.*?{{.+?\|(\d{4})(?:\|(\d{1,2}))?(?:\|(\d{1,2}))?/m,
                _=undefined;
            var
                re, matches, d, birth_date, death_date;

            // RegExp objects exec as-is, strings get find/replace
            function re_exec ( res ){
                // Arrayify scalars
                if ( !u.isArray( res ))
                    res = [ res ];

                // Loop thru regexs
                for (var i = 0; i < res.length; i++) {
                    var re = res[i];
                    if ( u.type( re ) !== 'RegExp' ){
                        re = re.replace(/___/g, '\\s+'    )
                        re = re.replace( /__/g, '\\s*'    )
                        re = re.replace( /#4/g, '\\d{4}'  )
                        re = re.replace( /#2/g, '\\d{1,2}')
                        re = re.replace(  /!/g, '\\|'     )
                        re = re.replace(  / /g, ''        )
                        re = new RegExp( re, "m" )
                    }
                    var matches = re.exec( text );
                    if ( matches )
                        return matches;
                }
            }

            // Name

            if ( !event.title ){
                matches = re_exec("^__!__name__=__  (.+)  $")  // /^\s*\|\s*name\s*=\s*(.+)$/m
                if ( matches )
                    event.title = matches[1];
            }

            // Birth

            birth_date = [];
            var rexs = [
                "^__!__birth_date__=.*? {{ .+? ! (#4) !(#2) !(#2)",
                "^__!__birth_date__=.*? {{ .+? ! (#4) (?:!(#2))? (?:!(#2))?"
            ];
            matches = re_exec( rexs )
            if ( matches ){
                birth_date = [ parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]) ];
            }
            else {
                matches = re_exec("^\\|\\s*birth_date\\s*=\\s*(.+)$");
                if ( matches ){
                    d = new Date( matches[1] );
                    if ( d.isValid() ){
                        birth_date = [ d.getFullYear(), d.getMonth()+1, d.getDate() ];
                    }
                    else {
                        console.log('No beginning date for', text)
                    }
                }
            }

            // Death

            death_date = [];
            var rexs = [
                "^__!__death_date__=.*? {{ .+? ! (#4) !(#2) !(#2)",
                "^__!__death_date__=.*? {{ .+? ! (#4) (?:!(#2))? (?:!(#2))?"
            ];
            matches = re_exec( rexs )
            if ( matches ){
                death_date = [ parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]) ];
            }
            else {
                matches = re_exec("^!__death_date__=__([\\w,\\d\\s]+?)__(?:,?__age__\\d+)");
                // matches = re_exec("^!__death_date__=__([\\w\\d ]+) (?:age__\\d+)");
                // matches = re_exec("^\\|\\s*death_date\\s*=\\s*([\\w\\d ]+)");
                if ( matches ){
                    d = new Date( matches[1] );
                    if ( d.isValid() ){
                        death_date = [ d.getFullYear(), d.getMonth()+1, d.getDate() ];
                    }
                    else {
                        console.log('No ending date for', text)
                    }
                }
            }

            if ( birth_date.length === 0 && death_date.length === 0 ){
                matches = re_exec(/^'''(.+?)''' \((.+)&ndash;(.+)\)/);
                if ( matches ){
                    if ( !event.title )
                        event.title = matches[1];
                    d = new Date( matches[2] );
                    if ( d.isValid() )
                        birth_date = [ d.getFullYear(), d.getMonth()+1, d.getDate() ];
                    d = new Date( matches[3] );
                    if ( d.isValid() )
                        death_date = [ d.getFullYear(), d.getMonth()+1, d.getDate() ];
                }
            }

            if ( !event.title )
                event.title = event.search;

            event.date = [ birth_date, death_date ];
        }
    }
})
