/**
 * Timelion listening - add all event handlers
 */
(function( root, factory ){
    var timelist = factory()
    root.timelist = {
        click: timelist.click,
        keypress: timelist.keypress,
        _: null
    }
})(this, function(){
    "use strict"

    return {
        /**
         * Add keypress event handler
         */
        keypress: function ( body ){
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
            }, false);
        },

        /**
         * Add event click event handler
         */
        click: function ( container, event_binding, display_panel ){
            container.addEventListener("click", function(e) {
                this.style.backgroundColor = this.style.backgroundColor ? '' : 'black';
                display_panel.innerText = event_binding.date + ': ' + event_binding.title;
            });
        }
    }
})
