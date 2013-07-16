var enyo = enyo;
enyo.kind({
    name: "enigma",
    kind: enyo.Component,
    statics: (function() {
        /**
        *   The main configuration is done here in order 
        */
        var config;
        var getHexCase, setHexCase;
        var getBase64Pad, setBase64Pad;

        config = {
            hexCase: 0, /* Defined the case of the hex output. 0 - lowercase , 1 - uppercase */
            base64Pad: "=" /* base-64 pad character. */
        };

        getHexCase = function() {
            return config.hexCase;
        };
        setHexCase = function(val) {
            config.hexCase = +!!val;
        };
        getBase64Pad = function() {
            return config.base64Pad;
        };
        setBase64Pad = function(val) {
            if (enyo.isString(val)) {
                config.base64Pad = val[0] || "";
            }
        };


        return {
            config: {
                getHexCase: getHexCase,
                setHexCase: setHexCase,
                getBase64Pad: getBase64Pad,
                setBase64Pad: setBase64Pad
            }
        };
    })()
});