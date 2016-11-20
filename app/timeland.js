/**
 * Timelion landing - dom manipulation
 */
(function( root, factory ){
    var timeland = factory()
    root.timeland = {
        select:   timeland.select,
        toggle:   timeland.toggle,
        advance:  timeland.advance,
        zoom_in:  timeland.zoom_in,
        zoom_out: timeland.zoom_out,
        _: null
    }
})(this, function(){
    "use strict"

    /**
     * Unselect all events
     */
    function _unselect_all ( events_container ){
        for (var i = 0; i < events_container.children.length; i++) {
            var
                event_container = events_container.children[i];

            if ( event_container.style.backgroundColor )
                event_container.style.backgroundColor = '';
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
        timelion.config.year_width += factor;
        timelion.config.year_width = Math.max( timelion.config.year_width, 1 );
        timelion.update()
        timelast.keep_right( timelion.$canvas )
    }

    /**
     *
     */
    function zoom_in (){
        _zoom( timelion.config.year_width / 10 );
    }

    /**
     *
     */
    function zoom_out (){
        _zoom( timelion.config.year_width / -10 );
    }

    /**
     * Unselect the current event and select the next one down
     */
    function advance (){
        var found_selected = false;

        for (var i = 0; i < timelion.$events.children.length; i++) {
            var
                event = timelion.$events.children[i];

            if ( found_selected ){
                timeland.select( event )
                return
            }
            if ( event.style.backgroundColor ){
                event.style.backgroundColor = '';
                found_selected = true;
            }
        }
        select( timelion.$events.children[0] )
    }

    /**
     * Select the given event container
     */
    function select ( event_container ){
        var
            event = event_container.timelion_event;

        _display( event.date + ': ' + event.title );
        _unselect_all( event_container.parentElement )
        event_container.style.backgroundColor = 'black';
    }

    /**
     * Toggle event selection
     */
    function toggle ( event_container ){
        if ( event_container.style.backgroundColor ){
            event_container.style.backgroundColor = '';
            _display('');
        }
        else
            select( event_container );
    }

    return {
        select:   select,
        toggle:   toggle,
        advance:  advance,
        zoom_in:  zoom_in,
        zoom_out: zoom_out,
        _: null
    }
})
