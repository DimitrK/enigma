var enyo = enyo;
var enigma = enigma;
enyo.kind({
    name: "enigma.encode",
    kind: enyo.Component,
    statics: (function() {
        /**
         * Convert a raw string to a hex string
         */

        function rstr2hex(input) {
            var hex_tab = enigma.config.getHexCase() ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
            }
            return output;
        }

        /**
         * Convert a raw string to a base-64 string
         */

        function rstr2b64(input) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8) {
                        output += enigma.config.getBase64Pad();
                    }
                    else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        }

        /**
         * Convert a raw string to an arbitrary string encoding
         */

        function rstr2any(input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;

            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }

            /**
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0) {
                        quotient[quotient.length] = q;
                    }
                }
                remainders[j] = x;
                dividend = quotient;
            }

            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--) {
                output += encoding.charAt(remainders[i]);
            }
            return output;
        }

        /**
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */

        function str2rstr_utf8(input) {
            var output = "";
            var i = -1;
            var x, y;

            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }

                /* Encode output as utf-8 */
                if (x <= 0x7F) {
                    output += String.fromCharCode(x);
                }
                else if (x <= 0x7FF) {
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                        0x80 | (x & 0x3F));
                }
                else if (x <= 0xFFFF) {
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
                }
                else if (x <= 0x1FFFFF) {
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                        0x80 | ((x >>> 12) & 0x3F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
                }
            }
            return output;
        }
        
        /**
         * Convert a raw string to an array of big-endian or small-endian words depending on the argument `big`.
         * Characters >255 have their high-byte silently ignored.
         */

        function rstr2bin(input, big) {
            var i;
            var output = Array(input.length >> 2);
            for (i = 0; i < output.length; i++) {
                output[i] = 0;
            }
            for (i = 0; i < input.length * 8; i += 8) {
                if (big) {
                    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
                } else {
                    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
                }
                
            }
            return output;
        }

        /**
         * Encode a string as utf-16
         */

        function str2rstr_utf16le(input) {
            var output = "";
            for (var i = 0; i < input.length; i++) {
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            }
            return output;
        }

        function str2rstr_utf16be(input) {
            var output = "";
            for (var i = 0; i < input.length; i++) {
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                    input.charCodeAt(i) & 0xFF);
            }
            return output;
        }

        return {
            toBase64: function(inString) {
                inString = enigma.utils.ensureString(inString);
                return rstr2b64(inString);
            },
            toHex: function(inString) {
                inString = enigma.utils.ensureString(inString);
                return rstr2hex(inString);
            },
            toBigEndians: function(inString) {
                inString = enigma.utils.ensureString(inString);
                return rstr2bin(inString, true);
            },
            toLittleEndians: function(inString) {
                inString = enigma.utils.ensureString(inString);
                return rstr2bin(inString, false);
            },
            toUtf8: function(inString) {
                inString = enigma.utils.ensureString(inString);
                try {
                    return str2rstr_utf8(inString);
                } catch (e) {
                    // This may take long
                    try {
                        return str2rstr_utf8(str2rstr_utf16le(inString));
                    } catch (ex) {
                        return str2rstr_utf8(str2rstr_utf16be(inString));
                    }
                }
            },
            toCustom: function(inString, inEncoding) {
                inString = enigma.utils.ensureString(inString);
                inEncoding = enigma.utils.ensureString(inEncoding);
                return rstr2any(inString, inEncoding);
            }
        };
    })()
});