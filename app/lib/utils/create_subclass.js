'use strict';

module.exports = createSubClass;

function createSubClass(Superclass, name, methods) {
    var Subclass;

    eval('Subclass = function '
            + name +
        '(){ this.initialize.apply(this, arguments); }');

    Subclass.prototype = new Superclass();

    for (var key in methods) {
        if (methods.hasOwnProperty(key)) {
            Subclass.prototype[key] = methods[key];
        }
    }

    return Subclass;

}
