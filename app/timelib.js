/**
 * Timelion heavy lifting
 */
(function( root, factory ){
    root.timelion = factory()
})(this, function(){
    "use strict"

    return {

        loaded: false,

        load: function( filename ){
            timelion.loaded = true;
            return {}
        }
    }
})
