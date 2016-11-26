/**
 * Timelion landing - dom manipulation
 */
(function( root, factory ){
    var self = factory()
    root.timeland = {
        // Export public API
        select:   self.select,
        toggle:   self.toggle,
        advance:  self.advance,
        zoom_in:  self.zoom_in,
        zoom_out: self.zoom_out,
        _: null
    }
})(this, function(){"use strict"

    /**
     * Unselect all events
     */
    function _unselect_all ( events_container ){
        for (var i = 0; i < events_container.children.length; i++) {
            var
                $event = events_container.children[i];

            if ( $event.style.backgroundColor )
                $event.style.backgroundColor = '';
        }
    }

    /**
     * Display the text in the corner of the screen
     */
    function _display ( text ){
        document.getElementById('footer').innerText = text;
    }

    /**
     * Zoom in / out
     */
    function _zoom ( factor ){
        timelion.year_width += factor;
        timelion.year_width = Math.max( timelion.year_width, 1 );
        timelion.update()
        timelast.keep_right()
    }

    /**
     *
     */
    function zoom_in (){
        _zoom( timelion.year_width / 10 );
    }

    /**
     *
     */
    function zoom_out (){
        _zoom( timelion.year_width / -10 );
    }

    /**
     * Unselect the current event and select the next one down
     */
    function advance (){
        var
            found_selected = false,
            events = document.getElementById('timelion-events'),
            _;

        for (var i = 0; i < events.children.length; i++) {
            var
                event = events.children[i];

            if ( found_selected ){
                select( event )
                return
            }
            if ( event.style.backgroundColor ){
                event.style.backgroundColor = '';
                found_selected = true;
            }
        }
        select( events.children[0] )
    }

    /**
     * Display description of the given event to the screen
     */
    function _display_event ( event ){
        var
            beg_date = event.date[0],
            beg_stng = new Date( beg_date ).toLocaleFormat('%Y %b %e %A'),
            end_date = event.date.length > 1 ? event.date[1] : [],
            end_stng = u.isFilled( end_date ) ? new Date( end_date ).toLocaleFormat('%Y %b %e %A') : '',
            event_desc = event.title + ': ' + beg_stng + (end_stng ? ' - ' + end_stng : ''),
            _;

         _display( event_desc )
    }

    /**
     * Select the given event container
     */
    function select ( $event ){
        var
            index = $event.dataset.index,
            event = timelion.events[ index ];

        _display_event( event );
        _unselect_all( $event.parentElement )
        $event.style.backgroundColor = 'black';
    }

    /**
     * Toggle event selection
     */
    function toggle ( $event ){
        if ( $event.style.backgroundColor ){
            $event.style.backgroundColor = '';
            _display('');
        }
        else
            select( $event );
    }

    return {
        // Exposed factory functions
        select:   select,
        toggle:   toggle,
        advance:  advance,
        zoom_in:  zoom_in,
        zoom_out: zoom_out,
        _: null  // allow trailing comma
    }
})
