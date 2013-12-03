/*jslint plusplus: true, ass: true, sloppy: true */
/*global describe, it, afterEach, expect, JSTemplate */

describe('init', function () {
    it('Kezdeti parameteratadas', function () {
        var str = 'Szia vilag!', t;
        t = new JSTemplate(str);
        expect(t.fetch()).toEqual(str);
        t = new JSTemplate(str, str);
        expect(t.fetch()).toEqual(str + str);
        t = new JSTemplate([str, str]);
        expect(t.fetch()).toEqual(str + str);
    });
});

describe('regexp1', function () {
    var template = new JSTemplate(),
        re = template.variableRegexp;

    it('Szuro nelkuli vatlozok', function () {
        var str = '<div id="{$id}" class="{$class}">{$content}</div>',
            matches = [],
            names = [],
            match;
        while ((match = re.exec(str)) !== null) {
            matches.push(match[0]);
            names.push(match[1]);
        }
        expect(matches).toEqual(['{$id}', '{$class}', '{$content}']);
        expect(names).toEqual(['id', 'class', 'content']);
    });
});

describe('simple', function () {
    it('Egyszeru valtozok 1.', function () {
        var str = 'Szia {$name}!',
            obj = {
                'name': 'vilag'
            },
            result = 'Szia vilag!',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
    it('Egyszeru valtozok 2.', function () {
        var str = '<div id="{$id}" class="{$cls}">{$content}</div>',
            obj = {
                'id': 'v1',
                'cls': 'title',
                'content': 'Hello!'
            },
            result = '<div id="v1" class="title">Hello!</div>',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
});
