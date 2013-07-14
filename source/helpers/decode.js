var enyo = enyo;
enyo.kind({
    name: "enigma.decode",
    kind: enyo.Component,
    statics: (function() {
        /*
         * Convert an array of big-endian or little-endian words to a string
        */
        function bin2rstr(input, big) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8) {
                if (big) {
                    output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
                } else {
                    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
                }
            }
            return output;
        }

        return {
            bigEndianToString: function(inString) {
                return bin2rstr(inString, true);
            },
            littleEndianToString: function(inString) {
                return bin2rstr(inString, false);
            }
        };
    })()
});