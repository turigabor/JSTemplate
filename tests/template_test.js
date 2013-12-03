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

    afterEach(function () {
        re.lastIndex = 0;
    });

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
    it('Szuros vatlozo', function () {
        var str = 'Szia {$name:upper}!',
            match = re.exec(str);
        expect(match[0]).toEqual('{$name:upper}');
        expect(match[1]).toEqual('name');
        expect(match[2]).toEqual('upper');
    });
    it('Parameteres vatlozo', function () {
        var str = '{$content:truncate(10)}',
            match = re.exec(str);
        expect(match[0]).toEqual('{$content:truncate(10)}');
        expect(match[1]).toEqual('content');
        expect(match[2]).toEqual('truncate');
        expect(match[3]).toEqual('10');
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
    it('Egyszeru valtozok 3.', function () {
        var str = '{$foo}{$foo}{$foo}{$boo}',
            obj = {
                'foo': 'f',
                'boo': 'b'
            },
            result = 'fffb',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
    it('Undefined', function () {
        var str = 'Szia {$nev}!',
            obj = {
                'name': 'vilag'
            },
            result = 'Szia !',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
	it('Undefined + null + 0 + false', function () {
        var str = '{$undef}-{$null}-{$zero}-{$false}',
            obj = {
                'null': null,
                'zero': 0,
                'false': 'false'
            },
            result = '--0-false',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
});

describe('filters', function () {
    var fn = JSTemplate.filters, str = 'Szia vilag!';
    it('upper', function () {
        expect(fn.upper(str)).toEqual('SZIA VILAG!');
    });
    it('lower', function () {
        expect(fn.lower(str)).toEqual('szia vilag!');
    });
    it('substr', function () {
        expect(fn.substr(str, 5)).toEqual('vilag!');
        expect(fn.substr(str, 0, 5)).toEqual('Szia ');
    });
    it('truncate', function () {
        expect(fn.truncate(str, 100)).toEqual('Szia vilag!');
        expect(fn.truncate(str, 10)).toEqual('Szia vi...');
    });
});

describe('filtered', function () {
    it('Szuros valtozo', function () {
        var str = 'Szia {$name:upper}!',
            obj = {
                'name': 'vilag'
            },
            result = 'Szia VILAG!',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
});

describe('params', function () {
    it('Parameteres valtozo', function () {
        var str = '<div class="{$cls:lower}">{$content:truncate(20)}</div>',
            obj = {
                'cls': 'Content',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            result = '<div class="content">Lorem ipsum dolor...</div>',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
    it('Tobbparameteres valtozo', function () {
        var str = '<p>{$content:substr(6, 5)}</p>',
            obj = {
                'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            result = '<p>ipsum</p>',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
    it('Tobb tobbparameteres valtozo', function () {
        var str = '<p>{$content:substr(6, 5)}</p><p>{$content:substr(6, 11)}</p>',
            obj = {
                'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            result = '<p>ipsum</p><p>ipsum dolor</p>',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
});

describe('regexp2', function () {
    var template = new JSTemplate(),
        re = template.foreachRegexp;

    afterEach(function(){
        re.lastIndex = 0;
    });

    it('Ciklus ellenorzes', function () {
        var str = '<ul><foreach name="$list"><li>{$content}</li></foreach></ul>',
            match = re.exec(str);
        expect(match[0]).toEqual('<foreach name="$list"><li>{$content}</li></foreach>');
        expect(match[1]).toEqual('list');
        expect(match[2]).toEqual('<li>{$content}</li>');
    });
    it('Felesleges white-space-ek', function () {
        var str = '<foreach   name="$list" ></foreach>',
            match = re.exec(str);
        expect(match[0]).toEqual(str);
        expect(match[1]).toEqual('list');
        expect(match[2]).toEqual('');
    });
});

describe('foreach', function () {
    it('Valtozo listaval 1.', function () {
        var str = '<h1>{$header}</h1><ul><foreach name="$list"><li>{$content}</li></foreach></ul>',
            obj = {
                'header': 'Lista',
                'list': [{
                    'content': '1.'
                }, {
                    'content': '2.'
                }, {
                    'content': '3.'
                }]
            },
            result = '<h1>Lista</h1><ul><li>1.</li><li>2.</li><li>3.</li></ul>',
            t = new JSTemplate(str);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
    it('Valtozo listaval 2.', function () {
        var template = [
                '<div class="{$cls}">',
                    '<foreach name="$users">',
                        '<a href="?id={$id}">{$name} ({$age})</a><br />',
                    '</foreach>',
                '</div>'],
            obj = {
                'cls': 'users',
                'users': [{
                    'id': 1,
                    'name': 'John',
                    'age': 21
                }, {
                    'id': 2,
                    'name': 'Bob',
                    'age': 30
                }]
            },
            result = '<div class="users"><a href="?id=1">John (21)</a><br /><a href="?id=2">Bob (30)</a><br /></div>',
            t = new JSTemplate(template);
        t.append(obj);
        expect(t.fetch()).toEqual(result);
    });
});
