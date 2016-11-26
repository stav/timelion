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
        handleClick:    self.handleClick,
        handleKeypress: self.handleKeypress,
        _: null
    }
})(this, function(){"use strict"

    /**
     * Add keypress event handler
     */
    function handleKeypress ( body ){
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
    }

    /**
     * Add event click event handler
     */
    function handleClick ( container ){
        container.addEventListener("click", function(e) {
            timeland.toggle( this )
        });
    }

    return {
        // Exposed factory functions
        handleClick:    handleClick,
        handleKeypress: handleKeypress,
        _: null  // allow trailing comma
    }
})
