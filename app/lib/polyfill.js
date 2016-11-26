// Avoid `console` errors in browsers that lack a console
(function() {"use strict"
    var
        method,
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
        ],
        noop = function () {},
        length = methods.length,
        console = (window.console = window.console || {}),
        _;

    while (length--) {
        method = methods[length];
        if (!console[method]) {  // Only stub undefined methods.
            console[method] = noop;
        }
    }
}());

// Date formatters
(function() {"use strict"

    if (!Date.prototype.toLocaleFormat) {
        (function() {
            Date.prototype.toLocaleFormat = function( formatString ) {
                if ( this.isValid() )
                    return this.toISOString().split('T')[0];
                else
                    return '';
            }
        }())
    }

    if (!Date.prototype.isValid) {
        (function() {
            Date.prototype.isValid = function() {
                return this.toString() != 'Invalid Date'
            }
        }())
    }

}());
