"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var note_bookmarks_1 = require("../../../../shared/note_bookmarks");
var bookmark_1 = require("./bookmark");
var URL_ = 'https://example.com/post';
(0, vitest_1.describe)('a bookmark link', function () {
    (0, vitest_1.it)('is a web link, trimmed of the space around it', function () {
        (0, vitest_1.expect)((0, note_bookmarks_1.bookmarkUrlOf)('https://example.com/a?b=1#c')).toBe('https://example.com/a?b=1#c');
        (0, vitest_1.expect)((0, note_bookmarks_1.bookmarkUrlOf)('  http://example.com/\n')).toBe('http://example.com/');
        (0, vitest_1.expect)((0, note_bookmarks_1.bookmarkUrlOf)('HTTPS://Example.com/Café')).toBe('HTTPS://Example.com/Café');
    });
    (0, vitest_1.it)('is nothing for other schemes, text that is not a link, or a link with space inside', function () {
        for (var _i = 0, _a = ['', '   ', 'example.com', 'not a url', 'ftp://example.com/', 'file:///etc/passwd', 'javascript:alert(1)', 'mailto:rohan@example.com', 'https://exa mple.com', 'https://example.com/a\nb', 'https://', 'see https://example.com']; _i < _a.length; _i++) {
            var text = _a[_i];
            (0, vitest_1.expect)((0, note_bookmarks_1.bookmarkUrlOf)(text)).toBeNull();
        }
    });
    (0, vitest_1.it)('takes a link of 2,048 characters but not one longer', function () {
        var base = 'https://example.com/';
        (0, vitest_1.expect)((0, note_bookmarks_1.bookmarkUrlOf)(base + 'a'.repeat(2048 - base.length))).not.toBeNull();
        (0, vitest_1.expect)((0, note_bookmarks_1.bookmarkUrlOf)(base + 'a'.repeat(2049 - base.length))).toBeNull();
    });
});
(0, vitest_1.describe)('a page’s preview', function () {
    (0, vitest_1.it)('takes the Open Graph title and description before Twitter’s and the page’s own', function () {
        var html = '<title>Page title</title><meta name="description" content="Plain"><meta name="twitter:description" content="Tweet"><meta property="og:description" content="Graph"><meta name="twitter:title" content="Tweet title"><meta property="og:title" content="Graph title"><meta property="og:site_name" content="Example">';
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, html)).toEqual({ url: URL_, title: 'Graph title', description: 'Graph', site: 'Example' });
    });
    (0, vitest_1.it)('falls back to Twitter’s tags, then the <title> and description', function () {
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<title>Page title</title><meta name="twitter:title" content="Tweet title"><meta name="twitter:description" content="Tweet"><meta name="description" content="Plain">')).toMatchObject({ title: 'Tweet title', description: 'Tweet' });
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<title lang="en">\n  Page title\n</title><meta name="description" content="Plain">')).toMatchObject({ title: 'Page title', description: 'Plain', site: null });
    });
    (0, vitest_1.it)('skips an empty tag for the next one', function () {
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<meta property="og:title" content="  "><meta property="og:description" content=""><title>Page title</title><meta name="description" content="Plain">')).toMatchObject({ title: 'Page title', description: 'Plain' });
    });
    (0, vitest_1.it)('keeps the first of two tags with the same name', function () {
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<meta property="og:title" content="First"><meta property="og:title" content="Second">').title).toBe('First');
    });
    (0, vitest_1.it)('reads attributes in any order, any case, and with single, double or no quotes', function () {
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<meta content="Content first" property="og:title">').title).toBe('Content first');
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, "<meta property='og:title' content='It is \"quoted\"'>").title).toBe('It is "quoted"');
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<meta property=og:title content=Bare>').title).toBe('Bare');
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<META PROPERTY="OG:TITLE" CONTENT="Shouted" />').title).toBe('Shouted');
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<meta name="og:site_name" content="By name">').site).toBe('By name');
    });
    (0, vitest_1.it)('decodes named, numeric and hex entities, and leaves unknown or impossible ones as written', function () {
        var html = '<meta property="og:title" content="Tom &amp; Jerry &lt;3 &quot;hi&quot; &#39;a&#x27; &#8217;s &#x1F375; &AMP;"><meta property="og:description" content="&copy; &#0; &#x110000; &bogus;">';
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, html)).toMatchObject({ title: 'Tom & Jerry <3 "hi" \'a\' ’s 🍵 &', description: '&copy; &#0; &#x110000; &bogus;' });
    });
    (0, vitest_1.it)('collapses runs of whitespace and control characters to one space', function () {
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<title>\n\tOne&nbsp;\u0007 two \r\n three \u007f</title>').title).toBe('One two three');
    });
    (0, vitest_1.it)('shows tags as text, never as markup', function () {
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, '<meta property="og:title" content="&lt;img src=x onerror=alert(1)&gt;">').title).toBe('<img src=x onerror=alert(1)>');
    });
    (0, vitest_1.it)('cuts the title at 200, the description at 300 and the site at 80 characters, ending with …', function () {
        var html = "<meta property=\"og:title\" content=\"".concat('t'.repeat(201), "\"><meta property=\"og:description\" content=\"").concat('d'.repeat(301), "\"><meta property=\"og:site_name\" content=\"").concat('s'.repeat(81), "\">");
        var preview = (0, bookmark_1.bookmarkOf)(URL_, html);
        (0, vitest_1.expect)(preview.title).toBe("".concat('t'.repeat(199), "\u2026"));
        (0, vitest_1.expect)(preview.description).toBe("".concat('d'.repeat(299), "\u2026"));
        (0, vitest_1.expect)(preview.site).toBe("".concat('s'.repeat(79), "\u2026"));
    });
    (0, vitest_1.it)('keeps text that is exactly at the limit whole', function () {
        (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, "<title>".concat('t'.repeat(200), "</title>")).title).toBe('t'.repeat(200));
    });
    (0, vitest_1.it)('is empty for a page with nothing to show', function () {
        for (var _i = 0, _a = ['', '<html><body>Hi</body></html>', '<title> </title><meta name="description" content="&#32;">']; _i < _a.length; _i++) {
            var html = _a[_i];
            (0, vitest_1.expect)((0, bookmark_1.bookmarkOf)(URL_, html)).toEqual({ url: URL_, title: null, description: null, site: null });
        }
    });
});
