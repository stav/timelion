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
            function zoom ( factor ){
                timelion.config.year_width += factor;
                timelion.config.year_width = Math.max( timelion.config.year_width, 1 );
                timelion.update()
                timescal.keep_right( timelion.$canvas )
            }
            body.addEventListener('keypress', function (e) {
                if ( e.key === "1" && timelion.config.year_width > 1 )
                    zoom( timelion.config.year_width / -10 );
                else
                if ( e.key === "2" )
                    zoom( timelion.config.year_width / 10 );
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
