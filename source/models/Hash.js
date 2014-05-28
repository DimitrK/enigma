var enyo = enyo;
(function(){
    var propStartsWith_to_filter = function(inArg) {
        return inArg.indexOf("to") === 0;
    };
    enyo.kind({
        name: "enigma.Hash",
        kind: enyo.Object,
        published: {
            value: ""
        },
        //* @protected
        constructor: function(hash) {
            this.value = hash;

            var bindings = [this.value];

            var boundFns = enigma.utils.bindObjPropsWithFilter(enigma.encode, bindings, propStartsWith_to_filter);
            
            enyo.mixin(this, boundFns);
        },
        valueChanged: function() {
            var boundFns = enigma.utils.bindObjPropsWithFilter(enigma.encode, [this.value], propStartsWith_to_filter);
            enyo.mixin(this, boundFns);
        }
    });
})();