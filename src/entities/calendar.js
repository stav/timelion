"use strict";

// http://jesusnjim.com/common/julian-gregorian.html
// number of days must be processed without the epoch or you get the offset of 4719 years or so
function GregorianToDTime(Y, Mo, D ) {
    var a=Math.floor((14-Mo)/12);
    var y=Y/*+4800*/-a;
    var m=Mo+(12*a)-3;
    var JD = D + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045+32044+60;
    return JD * 1000 * 60 * 60 * 24;
}
function GregorianDiffWithoutEpoch( yr1, mo1, dy1,  yr2, mo2, dy2 ) {
    var dt1 = GregorianToDTime( yr1, mo1, dy1 );
    var dt2 = GregorianToDTime( yr2, mo2, dy2 );
    return dt1 - dt2;
}

function dateDiff( ...args ) {
    return GregorianDiffWithoutEpoch( ...args );
}


export default {

    JAN: 1,
    FEB: 2,
    MAR: 3,
    APR: 4,
    MAY: 5,
    JUN: 6,
    JUL: 7,
    AUG: 8,
    SEP: 9,
    OCT: 10,
    NOV: 11,
    DEC: 12,

    dateDiff,
}
