/**
 * Timelion
 */
(function(){
    "use strict";

    window.addEventListener("load", function(event) {
        init();
        console.log("LOAD: main");
    }, {once: true});

    function init () {
        console.log('init');

        timelion.fetch('timelion.md');
        // slider.init();
    }
})();
