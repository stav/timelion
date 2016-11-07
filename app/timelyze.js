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
            if ( !bd.isValid() ) {
                console.log(bd +': "'+ beg_date +'" - '+ info)
                return
            }
            end_date = matches.length > 2 ? matches[2] : new Date();
            ed = new Date( end_date );
            if ( !ed.isValid() ) {
                console.log(ed +': "'+ end_date +'" - '+ info)
                return
            }
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
                // "(September 11, 1933 – July 23, 2002)", "September 11, 1933 ", " July 23, 2002"
                "\\(([^)]+)(?:–|-)([^)]+)\\)",

                // "David Vaughan Icke (/aɪk/, born 29 April 1952) is an English writer and public speaker. A former footballer and sports broadcaster, Icke has made his name since the 1990s as a professional conspiracy theorist, calling himself a "full time investigator into who and what is really controlling the world." He is the author of over 20 books and numerous DVDs, and has lectured in over 25 countries, speaking for up to 10 hours to audiences that cut across the political spectrum."
                "\\([^)]*born([^)]+?)(?:\\s+in\\s+[^)]+)?\\)",

                // "World War I (WWI or WW1), also known as the First World War, or the Great War, was a global war originating in Europe that lasted from 28 July 1914 to 11 November 1918. More than 70 million military personnel, including 60 million Europeans, were mobilised in one of the largest wars in history."
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
        }
    }
})
