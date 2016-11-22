/**
 * Timelion scaling - screen display library
 */
(function( root, factory ){
    var timelast = factory()
    root.timelast = {
        keep_right: timelast.keep_right
    }
})(this, function(){
    "use strict"

    function get_bounding_box_right ( element ){
        return element.getBoundingClientRect().right
    }

    function get_selected_events ( $canvas ){
        // First collect all the selected events into an HTMLCollection
        const $events = $canvas.getElementsByClassName('event');
        var events_selected = [];

        for (var i = 0; i < $events.length; i++) {
            if ( $events[i].style.backgroundColor )
                events_selected.push( $events[i] )
        }
        return events_selected
    }

    return {
        /**
         * http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript#8876069
         * var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
         * var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
         */
        keep_right: function(){
            const
                $canvas = document.getElementById('timelion'),
                events = get_selected_events( $canvas ),
                rights = events.map( get_bounding_box_right ),
                rightest = Math.max.apply( null, rights ),
                amount_obscured = rightest + $canvas.scrollLeft,
                viewport_width = document.documentElement.clientWidth,
                shift = Math.ceil( viewport_width - amount_obscured );

            if ( shift < 0 ){
                $canvas.scrollLeft = Math.abs( shift )
            }
        }
    }
})
