/**
 * Timelion listening - add all event handlers
 *
 * Requires:
 *
 * - timeland: dom manipulations
 */
(function( root, factory ){
    var timelist = factory()
    root.timelist = {
        handleClick: timelist.handleClick,
        handleKeypress: timelist.handleKeypress,
        _: null
    }
})(this, function(){
    "use strict"

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

        /**
         * Add event click event handler
         */
        handleClick: function ( container ){
            container.addEventListener("click", function(e) {
                timeland.toggle( this )
            });
        }
    }
})
