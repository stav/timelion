/**
 * Timelion
 */
(function(){
    "use strict";

    console.log('main');

    window.addEventListener("load", function(event) {
        console.log('ready');
        init();
        console.log('readyed');
    }, {once: true});

    console.log('mained');

    function init () {
        console.log('init');

        timelion.load('example.json').then(function(response){
            console.log('load');
            timelion.render().then(function(response) {
                console.log('rendered');
            })
            console.log('loaded');
        }, function(e){console.log(e)});
        // slider.init();
        console.log('inited');
    }
})();
