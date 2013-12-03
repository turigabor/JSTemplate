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
            var value = me.getValueByName(name), params;
            if (filter && JSTemplate.filters[filter]) {
                params = me.createFilterParams(value, param);
                value = JSTemplate.filters[filter].apply(me, params);
            }
            return value;
        });
    },
    /** @private */
    getValueByName: function (name) {
        return this.values[name] || '';
    },
    /** @private */
    createFilterParams: function (value, param) {
        var result = String(param || '').split(','), i;
        for (i = 0; i < result.length; ++i) {
            result[i] = result[i].trim();
        }
        result.unshift(value);
        return result;
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
