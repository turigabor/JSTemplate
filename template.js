/*jslint plusplus: true, regexp: true, sloppy: true, unparam: true */

var JSTemplate = function (html) {
    if (html instanceof Array) {
        html = html.join('');
    } else if (arguments.length > 1) {
        html = Array.prototype.join.call(arguments, '');
    }
    this.html = html;
};
JSTemplate.prototype = {
    variableRegexp: /\{\$(\w+)\}/g,
    append: function (values) {
        this.values = values;
        return this;
    },
    fetch: function () {
        var me = this, re = this.variableRegexp;
        return this.html.replace(re, function (match, name) {
			return me.values[name];
        });
    }
};
