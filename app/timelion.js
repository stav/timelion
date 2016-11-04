/**
 * Timelion
 */
(function(){
    "use strict";

    console.log("main");

    window.addEventListener("load", function(event) {
        console.log("ready");
        init();
        console.log("readyed");
    }, {once: true});

    console.log("mained");

    function init () {
        console.log('init');

        timelion.load('example.json').then(function(response){
            console.log('loaded');
            timelion.render().then(function(response) {
                console.log('rendered');
            })
        });
        // slider.init();
        console.log('inited');
    }
})();
