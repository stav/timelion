/**
 * HTTP Promise-based request resolution
 */
(function( root, factory ){
    var self = factory();
    root.httplibe = {
        // Export public API
        get:           self.get,
        get_json:      self.get_json,
        get_json_data: self.get_json_data
    }
})(this, function(){
    "use strict"

    /**
     * Request url and return the result
     */
    function get ( url, accept ){
        return new Promise(function( resolve, reject ) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true)
            if ( accept )
                xhr.setRequestHeader('Accept', accept);
            xhr.onload = function(){
                if (xhr.status == 200)
                    resolve( xhr.responseText );
                else
                    reject('Could not load ('+ url +') status ('+ xhr.status +')');
            };
            xhr.send()
        })
    }

    /**
     * Request url and return the JSON result
     */
    function get_json ( url ){
        return new Promise(function( resolve, reject ) {
            get( url, 'application/json' ).then(function( text ){
                resolve( text )
            },
            function(error){reject(error)})
        })
    }

    /**
     * Request url and return the JSON result as an Object
     */
    function get_json_data ( url ){
        return new Promise(function( resolve, reject ) {
            get_json( url ).then(function( json ){
                try{
                    resolve( JSON.parse( json ))
                }
                catch (error){
                    reject('File is not JSON ('+ json +') '+ error);
                }
            },
            function(error){reject(error)})
        })
    }

    return {
        // Exposed factory functions
        get:           get,
        get_json:      get_json,
        get_json_data: get_json_data,
        _: null  // allow trailing comma
    }
})
