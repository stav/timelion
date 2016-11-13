/**
 * Timelion analyzing - text parsing library
 */
(function( root, factory ){
    root.timelyze = factory()
})(this, function(){
    "use strict"

    function _parse( re, info ){
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

    return {
        parse_dates: function ( info ){
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
                    from_to_dates_pair = _parse( new RegExp( regexs[i] ), info );
                    if ( from_to_dates_pair && from_to_dates_pair.isArray() )
                        return from_to_dates_pair;
                }
            }
            console.log('No date parsed from:'+ info)
        }
    }
})
