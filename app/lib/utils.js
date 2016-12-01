/**
 * Utility functions
 */
(function( root, factory ){
    root.u = factory()
})(this, function(){"use strict"

// http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.2

    function _is ( o, type ){
        return Boolean( Object.prototype.toString.call( o ) === type )
    }

    return {

        /**
         * Return the first element in an array
         */
        first: function ( array ){
            if ( u.isFilled( array ))
                return array[0]
        },

        /**
         * Determine the type of object provided: Date, Array, String, etc.
         */
        type: function ( o ){
            var
                type = Object.prototype.toString.call( o ),
                matches = new RegExp("\\[object (\\w+)\\]").exec(type);

            return matches && matches.length === 2 ? matches[1] : 'Unknown'
        },

        /**
         * Check if the given thing is non-empty
         */
        isFilled: function ( o ) {
            return Boolean( o && Object.keys( o ).length )
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
            return _is( o, '[object Array]')
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
            return _is( o, '[object Date]')
        },

        /**
         *
         */
        isString: function ( o ){
            return _is( o, '[object String]')
        },

        /**
         *
         */
        isObject: function ( o ){
            return _is( o, '[object Object]')
        },

        /**
         *
         */
        isNumber: function ( o ) {
            if ( !isNaN( o ) )
                return _is( o, '[object Number]')
        }
    }
})
