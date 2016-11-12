/**
 * Timelion scaling - screen display library
 */
(function( root, factory ){
    root.timescal = factory()
})(this, function(){
    "use strict"

    return {
        /**
         * Center an element on the screen
         * var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
         * var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
         * http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript#8876069
         */
        keep_right: function ( element, canvas ){
            var
                viewport_width = document.documentElement.clientWidth,
                element_right = target.getBoundingClientRect().right,
                right_obscured = element_right + canvas.scrollLeft,
                shift = Math.ceil( viewport_width - right_obscured ),
                _;

            // console.log(
            //     '\n',
            //     element, canvas,
            //     target.getBoundingClientRect(),
            //     document.documentElement.clientWidth,
            //     document.documentElement.clientHeight,
            //     ( shift < 0 ),
            //     shift,
            //     ''
            // )
            if ( shift < 0 ){
                canvas.scrollLeft = Math.abs( shift )
            }
        }
    }
})
