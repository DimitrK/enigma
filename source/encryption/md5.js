var enyo = enyo;
var enigma = enigma;
enyo.kind({
    name: "enigma.md5",
    kind: enyo.Component,
    statics: (function() {
        var safe_add = enigma.utils.safeAddition;
        var bit_rol = enigma.utils.biwiseRotation;
        /**
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */

        function rstr_hmac_md5(key, data) {
            var bkey = enigma.encode.toLittleEndians(key);
            if (bkey.length > 16) {
                bkey = binl_md5(bkey, key.length * 8);
            }
            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binl_md5(ipad.concat(enigma.encode.toLittleEndians(data)), 512 + data.length * 8);
            var hmachash = binl_md5(opad.concat(hash), 512 + 128);
            return enigma.decode.littleEndianToString(hmachash);
        }

        /**
         * Calculate the MD5 by transforming the input in an array of little-endian words, and a bit length.
         */

        function binl_md5(key, len) {
            var bkey;
            if(typeof key == "string" && !len ) {
                bkey = enigma.encode.toLittleEndians(key);
                len = key.length * 8;
            } else {
                bkey = key;
            }
            /* append padding */
            bkey[len >> 5] |= 0x80 << ((len) % 32);
            bkey[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < bkey.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = md5_ff(a, b, c, d, bkey[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, bkey[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, bkey[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, bkey[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, bkey[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, bkey[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, bkey[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, bkey[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, bkey[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, bkey[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, bkey[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, bkey[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, bkey[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, bkey[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, bkey[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, bkey[i + 15], 22, 1236535329);

                a = md5_gg(a, b, c, d, bkey[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, bkey[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, bkey[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, bkey[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, bkey[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, bkey[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, bkey[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, bkey[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, bkey[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, bkey[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, bkey[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, bkey[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, bkey[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, bkey[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, bkey[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, bkey[i + 12], 20, -1926607734);

                a = md5_hh(a, b, c, d, bkey[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, bkey[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, bkey[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, bkey[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, bkey[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, bkey[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, bkey[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, bkey[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, bkey[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, bkey[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, bkey[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, bkey[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, bkey[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, bkey[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, bkey[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, bkey[i + 2], 23, -995338651);

                a = md5_ii(a, b, c, d, bkey[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, bkey[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, bkey[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, bkey[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, bkey[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, bkey[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, bkey[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, bkey[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, bkey[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, bkey[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, bkey[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, bkey[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, bkey[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, bkey[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, bkey[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, bkey[i + 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        }

        /*
         * These functions implement the four basic operations the algorithm uses.
         */

        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
        return {
            hash: function(inString) {
                inString = enigma.utils.ensureUtf8String(inString);
                var endianHash = binl_md5(inString);
                var stringHash = enigma.decode.littleEndianToString(endianHash);
                return new enigma.Hash(stringHash);
            },

            hmac: function(inString, inData) {
                inString = enigma.utils.ensureUtf8String(inString);
                inData = enigma.utils.ensureUtf8String(inData);
                var stringHash = rstr_hmac_md5(inString, inData);
                return new enigma.Hash(stringHash);
            }
        };
    })()
});