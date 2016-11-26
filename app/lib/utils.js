/**
 * Utility functions
 */
(function( root, factory ){
    root.u = factory()
})(this, function(){"use strict"

// http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.2

    return {

        /**
         * Return the first elemenet in an array
         */
        first: function ( array ){
            if ( u.isFilled( array ))
                return array[0]
        },

        /**
         * Determine the type of objecct provided: Date, Array, String, etc.
         */
        type: function ( o ){
            var
                type = Object.prototype.toString.call( o ),
                matches = new RegExp("\\[object (\\w+)\\]").exec(type);
            return matches && matches.length === 2 ? matches[1] : 'Unknown'
        },

        /**
         * Check if the given array is non-empty
         */
        isFilled: function ( array ) {
            return u.isArray( array ) && array.length
        },

        /**
         * Convert iterable to Array
         */
        toArray: function ( o ){
            return [].slice.call( o )
        },

        /**
         *
         */
        isArray: function ( o ){
            return Object.prototype.toString.call( o ) === '[object Array]'
        },

        /**
         *
         */
        isValidDate: function ( o ) {
            return u.isDate( o ) && o.isValid()
        },

        /**
         *
         */
        isDate: function ( o ){
            return Object.prototype.toString.call( o ) === '[object Date]'
        },

        /**
         *
         */
        isString: function ( o ){
            return Object.prototype.toString.call( o ) === '[object String]'
        },

        /**
         *
         */
        isNumber: function ( o ) {
            if ( !isNaN( o ) )
                return Object.prototype.toString.call( o ) === '[object Number]'
        }
    }
})
