var enyo = enyo;
enyo.kind({
    name: "enigma.utils",
    kind: enyo.Component,
    statics: (function() {

        //* Checks the given argument and handles its stringification according to its type
        var ensureString = function(inArg) {
            var type = Object.prototype.toString.call(inArg);
            if (type === "[object Object]" || type === "[object Array]") {
                return JSON.stringify(inArg);
            } else {
                if ( !! inArg.toString) {
                    return inArg.toString();
                } else {
                    return "" + inArg;
                }
            }
        };

        //* Returns the given argument after it encodes it to string and later to UTF-8 
        var ensureUtf8String = function(inArg) {
            return enigma.encode.toUtf8(ensureString(inArg));
        };


        /**
            source: the object of which certain properties (functions) will be extracted
            bindibgs: an array of variables which will be binded to all of the extracted properties
            filterFn: a function which will be used to filter which properties should be extracted from source
                      also these properties must be functions in order to be bounded.
            context: the context on which the extracted functions will be bounded with along with the variables 
                     from bindings.

            It is used to return a collection of functions represented as an object bounded in certain context
            and possibly bounded with certain arguments predeclared. 
        */
        var bindObjPropsWithFilter = function(source, bindings, filterFn, context) {
            var boundFns = {};
            bindings = bindings || [];
            if (!enyo.isArray(bindings)) {
                throw "Array expected";
            }
            if (!enyo.isFunction(filterFn)) {
                throw "Function expected";
            }
            for (var prop in source) {
                if (enyo.isFunction(source[prop]) && filterFn(prop)) {
                    context = context || this;
                    enyo.forEach(bindings, function(bindArg) {
                        if (boundFns[prop]) {
                            boundFns[prop] = boundFns[prop].bind(context, bindArg);
                        } else {
                            boundFns[prop] = source[prop].bind(context, bindArg);
                        }
                    }, context);
                }
            }
            return boundFns;
        };

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */

        var safeAddition = function(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };

        /*
         * Bitwise rotate a 32-bit number to the left.
         */

        var biwiseRotation = function(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };


        return {
            //* @public
            ensureString: ensureString,

            //* @public
            ensureUtf8String: ensureUtf8String,

            //* @public
            bindObjPropsWithFilter: bindObjPropsWithFilter,

            //* @public
            safeAddition: safeAddition,

            //* @public
            biwiseRotation: biwiseRotation
        };
    })()
});