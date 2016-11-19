/**
 * Timelion listening - add all event handlers
 */
(function( root, factory ){
    var timelist = factory()
    root.timelist = {
        listen: timelist.listen
    }
})(this, function(){
    "use strict"

    return {
        /**
         * Add all event listeners
         */
        listen: function ( body ){

            function zoom ( factor ){
                timelion.config.year_width += factor;
                timelion.config.year_width = Math.max( timelion.config.year_width, 1 );
                timelion.update()
                timescal.keep_right( timelion.$canvas )
            }
            body.addEventListener('keypress', function (e) {
                var sub_factor = timelion.config.year_width > 10 ? 10 : 1;
                if ( e.key === "1" && timelion.config.year_width > 1 )
                    zoom( -1 * sub_factor )
                else
                if ( e.key === "2" )
                    zoom( sub_factor )
            }, false);
        }
    }
})
