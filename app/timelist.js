/**
 * Timelion listening - add all event handlers
 *
 * Requires:
 *
 * - timeland: dom manipulations
 */
(function( root, factory ){
    var self = factory()
    root.timelist = {
        // Export public API
        handleKeypress: self.handleKeypress
    }
})(this, function(){"use strict"
    return {
        /**
         * Add keypress event handler
         */
        handleKeypress: function ( body ){
            body.addEventListener('keypress', function (e) {
                if ( e.key === "1" && timelion.year_width > 1 )
                    timeland.zoom_out();
                else
                if ( e.key === "2" )
                    timeland.zoom_in();
                else
                if ( e.key === "`" )
                    timeland.advance();
            }, false);
        },
    }
})
