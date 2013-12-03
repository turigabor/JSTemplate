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
