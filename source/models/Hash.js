var enyo = enyo;
enyo.kind({
    name: "enigma.Hash",
    kind: enyo.Object,
    published: {
        value: ""
    },
    //* @protected
    constructor: function(hash) {
        this.value = hash;

        var propStartsWith_to_filter = function(inArg) {
            return inArg.indexOf("to") === 0;
        };
        var bindings = [hash];

        var boundFns = enigma.utils.bindObjPropsWithFilter(enigma.encode, bindings, propStartsWith_to_filter);
        
        enyo.mixin(this, boundFns);
    }
});