ui
/**
 * User interface
 */
=(function(){"use strict";

/**
 * Add keypress event handler
 */
function handleKeypress ( body ){
    body.addEventListener('keypress', function (e) {
      console.log(e)
    }, false);
}

/////////////////////////////////////////////////////////////////////////////
// Declare Public interface

return {
    handleKeypress,
}

}())
