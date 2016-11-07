/**
 * Timelion analyzing - text parsing library
 */
(function( root, factory ){
    root.timelyze = factory()
})(this, function(){
    "use strict"

    return {
        parse_dates: function ( info ){
            var
                re, matches, bd, beg_date, ed, end_date,
                _;

            // "(September 11, 1933 – July 23, 2002)", "September 11, 1933 ", " July 23, 2002"
            re = new RegExp("\\(([^)]+)(?:–|-)([^)]+)\\)");
            matches = re.exec( info );
            if ( matches ){
                beg_date = matches[1];
                end_date = matches[2];
                bd = new Date( beg_date );
                if ( !bd.isValid() ) {
                    console.log(bd +': "'+ beg_date +'" - '+ info)
                    return
                }
                ed = new Date( end_date );
                if ( !ed.isValid() ) {
                    console.log(ed +': "'+ end_date +'" - '+ info)
                    return
                }
                return [
                    [bd.getFullYear(), bd.getMonth()+1, bd.getDate()],
                    [ed.getFullYear(), ed.getMonth()+1, ed.getDate()]];
            }

            // "David Vaughan Icke (/aɪk/, born 29 April 1952) is an English writer and public speaker. A former footballer and sports broadcaster, Icke has made his name since the 1990s as a professional conspiracy theorist, calling himself a "full time investigator into who and what is really controlling the world." He is the author of over 20 books and numerous DVDs, and has lectured in over 25 countries, speaking for up to 10 hours to audiences that cut across the political spectrum."
            re = new RegExp("\\([^)]*born([^)]+?)(?:\\s+in\\s+[^)]+)?\\)");
            matches = re.exec( info );
            if ( matches ){
                beg_date = matches[1];
                bd = new Date( beg_date );
                if ( !bd.isValid() ) {
                    console.log(bd +': "'+ beg_date +'" - '+ info)
                    return
                }
                return [
                    [bd.getFullYear(), bd.getMonth()+1, bd.getDate()],
                    [2016]];
            }
        }
    }
})
