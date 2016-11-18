/**
 * HTTP Promise-based request resolution
 */
(function( root, factory ){
    root.httplibe = factory()
})(this, function(){
    "use strict"

    /**
     * Request url and return the result
     */
    function get ( url ){
        return new Promise(function( resolve, reject ) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true)
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
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true)
            xhr.setRequestHeader('Accept', 'application/json')
            xhr.onload = function(){
                if (xhr.status == 200)
                    resolve( xhr.responseText );
                else
                    reject('Could not load ('+ url +') status ('+ xhr.status +')');
            }
            xhr.send()
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
            }, function( error ){
                reject(error)
            })
        })
    }

    // Export

    return {

        get:           get,
        get_json:      get_json,
        get_json_data: get_json_data

    }  // httplibe export

})  // Closure
