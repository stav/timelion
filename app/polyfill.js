// Avoid `console` errors in browsers that lack a console.
(function() {
    var
        method,
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
        ],
        noop = function () {},
        length = methods.length,
        console = (window.console = window.console || {}),
        _;

    while (length--) {
        method = methods[length];
        if (!console[method]) {  // Only stub undefined methods.
            console[method] = noop;
        }
    }
}());

// Element class manupulation
// http://stackoverflow.com/questions/14104881/add-remove-class-to-a-dom-element-using-only-javascript-and-best-of-these-2-way#answer-14105170
(function() {
    Element.prototype.hasClassName = function(name) {
        return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
    };
    Element.prototype.addClassName = function(name) {
        if (!this.hasClassName(name)) {
            this.className = this.className ? [this.className, name].join(' ') : name;
        }
    };
    Element.prototype.removeClassName = function(name) {
        if (this.hasClassName(name)) {
            var c = this.className;
            this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
        }
    };
}());

// http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.2
(function() {
      Object.prototype.type = function() {
        var type = Object.prototype.toString.call(this);
        matches = new RegExp("\\[object (\\w+)\\]").exec(type);
        return matches && matches.length === 2 ? matches[1] : 'Unknown'
      }
      Object.prototype.isObject = function() {
        return Object.prototype.toString.call(this) === '[object Object]'
      }
      Object.prototype.isArray = function() {
        return Object.prototype.toString.call(this) === '[object Array]'
      }
      Object.prototype.isString = function() {
        return Object.prototype.toString.call(this) === '[object String]'
      }
      Object.prototype.isNumber = function() {
        return (
            Object.prototype.toString.call(this) === '[object Number]'
            &&  !isNaN(this)
        )
      }
}());

// Dates
(function() {
      Date.prototype.isValid = function() {
        return this.toString() != 'Invalid Date'
      }
}());
