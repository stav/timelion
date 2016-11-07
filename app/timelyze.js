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
                re, matches, b, date_born, d, date_died,
                _;

            // "(September 11, 1933 – July 23, 2002)", "September 11, 1933 ", " July 23, 2002"
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
                return [
                    [b.getFullYear(), b.getMonth()+1, b.getDate()],
                    [d.getFullYear(), d.getMonth()+1, d.getDate()]];
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
                return [
                    [b.getFullYear(), b.getMonth()+1, b.getDate()],
                    [2016]];
            }
        }
    }
})
