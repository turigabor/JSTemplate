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
    fetch: function () {
        return this.html;
    }
};
