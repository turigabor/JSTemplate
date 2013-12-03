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
    variableRegexp: /\{\$(\w+)(?:\:(\w+)(?:\((.*?)\))?)?\}/g,
    append: function (values) {
        this.values = values;
        return this;
    },
    fetch: function () {
        var me = this, re = this.variableRegexp;
        return this.html.replace(re, function (match, name, filter, param) {
            var value = me.getValueByName(name);
            if (filter && JSTemplate.filters[filter]) {
                value = JSTemplate.filters[filter].call(me, value, param);
            }
            return value;
        });
    },
    /** @private */
    getValueByName: function (name) {
        return this.values[name] || '';
    }
};

JSTemplate.filters = {
    upper: function (str) {
        return String(str).toUpperCase();
    },
    lower: function (str) {
        return String(str).toLowerCase();
    },
    substr: function (str, start, length) {
        return String(str).substr(start, length);
    },
    truncate: function (str, length) {
        str = String(str);
        return str.length > length - 3 ? str.substring(0, length - 3) + '...' : str;
    }
};
