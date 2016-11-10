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
    return {

        get_json: function ( url ){
            return new Promise(function( resolve, reject ) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.onload = function(){
                    var data;
                    if (xhr.status == 200){
                        try{
                            data = JSON.parse( xhr.responseText );
                            console.log(xhr)
                            resolve( data )
                        }
                        catch (error){
                            reject('File is not JSON ('+ xhr.responseText +') '+ error);
                        }
                    }
                    else
                        reject('Could not load ('+ url +') status ('+ xhr.status +')')
                };
                xhr.send();
            })
        }
    }
})
