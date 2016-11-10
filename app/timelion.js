/**
 * Timelion
 */
(function(){
    "use strict";

    window.addEventListener("load", function(event) {
        init();
    }, {once: true});

    function init () {
        timelion.init();

        timelion.load('example.json').then(function(response){
            timelion.render().then(function(response) {
            })
        }, function(e){console.log(e)});
        // slider.init();
    }
})();
