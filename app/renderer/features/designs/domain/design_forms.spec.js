"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var en_1 = require("../../../l10n/en");
var design_forms_1 = require("./design_forms");
var comment = function (over) { return (__assign({ design: 'welcome', on: null, text: 'Shorter', by: 'Rohan', at: '2026-11-05T10:00:00Z', resolved: null, sentTo: null }, over)); };
var COMMENTS = [
    comment({ id: 'c1', on: 'headline', text: 'Make the headline shorter,\n it wraps.' }),
    comment({ id: 'c2', text: 'The hero is too tall.' }),
    comment({ id: 'c3', on: 'tip', text: 'Use the jade tip card.', resolved: '2026-11-04T09:00:00Z' }),
    comment({ id: 'c4', text: 'Already sent.', sentTo: '5.4.3' }),
];
var NAMES = { welcome: { name: 'Welcome', layers: { headline: 'Headline', tip: 'Tip card' } } };
var FROM = { label: '5.4.3', folder: '5.4.3' };
var form = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign(__assign({}, (0, design_forms_1.nextFormOf)('Gait-feedback', FROM, COMMENTS, NAMES, ['5.4.3'])), over));
};
(0, vitest_1.describe)('the comments box', function () {
    (0, vitest_1.it)('needs a comment', function () {
        (0, vitest_1.expect)((0, design_forms_1.commentError)('')).toBe('Comment is required.');
        (0, vitest_1.expect)((0, design_forms_1.commentError)('   \n ')).toBe(en_1.t.designs.commentRequired);
    });
    (0, vitest_1.it)('takes 2,000 characters and refuses more', function () {
        (0, vitest_1.expect)((0, design_forms_1.commentError)('x'.repeat(2000))).toBeUndefined();
        (0, vitest_1.expect)((0, design_forms_1.commentError)('x'.repeat(2001))).toBe(en_1.t.designs.commentLong);
    });
    (0, vitest_1.it)('does not count the spaces around a comment', function () {
        (0, vitest_1.expect)((0, design_forms_1.commentError)("  ".concat('x'.repeat(2000), "  "))).toBeUndefined();
    });
});
(0, vitest_1.describe)('the version label', function () {
    (0, vitest_1.it)('is required', function () {
        (0, vitest_1.expect)((0, design_forms_1.labelError)('  ', [])).toBe('Version label is required.');
    });
    (0, vitest_1.it)('can be 40 characters', function () {
        (0, vitest_1.expect)((0, design_forms_1.labelError)('x'.repeat(40), [])).toBeUndefined();
        (0, vitest_1.expect)((0, design_forms_1.labelError)('x'.repeat(41), [])).toBe(en_1.t.designs.labelLong);
    });
    (0, vitest_1.it)('needs a letter or number', function () {
        (0, vitest_1.expect)((0, design_forms_1.labelError)('...', [])).toBe(en_1.t.designs.labelNoLetters);
    });
    (0, vitest_1.it)('names the label that is taken', function () {
        (0, vitest_1.expect)((0, design_forms_1.labelError)('5.4.2', ['5.4.2', '5.4.3'])).toBe('A version called 5.4.2 already exists. Pick another label.');
    });
    (0, vitest_1.it)('counts a label with the same folder as taken', function () {
        (0, vitest_1.expect)((0, design_forms_1.labelError)('Onboarding Pass 2', ['onboarding-pass-2'])).toBe(en_1.t.designs.labelTaken('Onboarding Pass 2'));
    });
    vitest_1.it.each(['5.4.4', 'v6', 'Onboarding pass 3', 'First sketch'])('takes any free label, such as %j', function (label) {
        (0, vitest_1.expect)((0, design_forms_1.labelError)(label, ['5.4.3'])).toBeUndefined();
    });
});
(0, vitest_1.describe)('the quest title', function () {
    (0, vitest_1.it)('is required, and can be 200 characters', function () {
        (0, vitest_1.expect)((0, design_forms_1.titleError)(' ')).toBe('Quest title is required.');
        (0, vitest_1.expect)((0, design_forms_1.titleError)('x'.repeat(200))).toBeUndefined();
        (0, vitest_1.expect)((0, design_forms_1.titleError)('x'.repeat(201))).toBe(en_1.t.designs.questTitleLong);
    });
});
(0, vitest_1.describe)('checking the Next version form', function () {
    (0, vitest_1.it)('gives an error for each field that is wrong', function () {
        (0, vitest_1.expect)((0, design_forms_1.validateNext)(form({ label: '', title: '' }), [])).toEqual({ label: en_1.t.designs.labelRequired, title: en_1.t.designs.questTitleRequired });
    });
    (0, vitest_1.it)('has nothing to say about a good form', function () {
        (0, vitest_1.expect)((0, design_forms_1.validateNext)(form(), ['5.4.3'])).toEqual({});
    });
});
(0, vitest_1.describe)('what the Next version form starts with', function () {
    (0, vitest_1.it)('suggests the label after this one, past those taken', function () {
        (0, vitest_1.expect)((0, design_forms_1.nextFormOf)('Gait-feedback', FROM, COMMENTS, NAMES, ['5.4.3', '5.4.4']).label).toBe('5.4.5');
    });
    (0, vitest_1.it)('titles the quest from the two labels', function () {
        (0, vitest_1.expect)(form().title).toBe("Designs 5.4.4 from 5.4.3's feedback");
    });
    (0, vitest_1.it)('lists one line per open comment, then the version file', function () {
        (0, vitest_1.expect)(form().criteria.split('\n')).toEqual([
            'Welcome · Headline: Make the headline shorter, it wraps.',
            'Welcome: The hero is too tall.',
            'docs/designs/5.4.4/version.json names 5.4.3 as the version it comes from.',
        ]);
    });
    (0, vitest_1.it)('quotes a design or layer it has no name for by its id', function () {
        var criteria = (0, design_forms_1.nextFormOf)('Gait-feedback', FROM, [comment({ id: 'c9', design: 'pair', on: 'left', text: 'Bigger' })], {}, []).criteria;
        (0, vitest_1.expect)(criteria.split('\n')[0]).toBe('pair · left: Bigger');
    });
    (0, vitest_1.it)('asks for a copy of the version it starts from, in the new folder', function () {
        (0, vitest_1.expect)(form().description).toBe(en_1.t.designs.nextDescription('5.4.4', 'Gait-feedback', 'docs/designs/5.4.4/', '5.4.3', 'docs/designs/5.4.3/'));
    });
    (0, vitest_1.it)('suggests "1" for a realm\'s first designs, built from no comments', function () {
        var first = (0, design_forms_1.nextFormOf)('Gait-feedback', null, [], {}, []);
        (0, vitest_1.expect)(first).toMatchObject({ from: null, label: '1', title: en_1.t.designs.firstTitle('Gait-feedback'), criteria: 'docs/designs/1/version.json exists and names this version.', priority: 'mid', edited: {} });
    });
});
(0, vitest_1.describe)('a new label', function () {
    (0, vitest_1.it)('redrafts the title, description and criteria for it', function () {
        var after = (0, design_forms_1.relabel)(form(), '6.0', 'Gait-feedback', COMMENTS, NAMES);
        (0, vitest_1.expect)(after.label).toBe('6.0');
        (0, vitest_1.expect)(after.title).toBe("Designs 6.0 from 5.4.3's feedback");
        (0, vitest_1.expect)(after.criteria).toContain('docs/designs/6.0/version.json');
        (0, vitest_1.expect)(after.description).toContain('docs/designs/6.0/');
    });
    (0, vitest_1.it)('keeps what was changed by hand', function () {
        var edited = form({ title: 'My own title', criteria: 'My own line', edited: { title: true, criteria: true } });
        var after = (0, design_forms_1.relabel)(edited, '6.0', 'Gait-feedback', COMMENTS, NAMES);
        (0, vitest_1.expect)(after.title).toBe('My own title');
        (0, vitest_1.expect)(after.criteria).toBe('My own line');
        (0, vitest_1.expect)(after.description).toContain('docs/designs/6.0/');
    });
});
(0, vitest_1.describe)('the quest it files', function () {
    (0, vitest_1.it)('trims the title, drops blank criteria lines and an empty description', function () {
        var quest = (0, design_forms_1.questOfNext)(form({ title: '  Designs 5.4.4  ', description: '   ', criteria: 'One\n\n  Two  \n', priority: 'high' }));
        (0, vitest_1.expect)(quest).toMatchObject({ title: 'Designs 5.4.4', description: null, criteria: ['One', 'Two'], priority: 'high', parent: { kind: 'none' } });
    });
});
(0, vitest_1.describe)('the helpers on the quest', function () {
    (0, vitest_1.it)('turns on Mocha Mockup, who knows the design format, beside the defaults', function () {
        (0, vitest_1.expect)((0, design_forms_1.questOfNext)(form()).helpers).toEqual(['mocha-mockup', 'tea-dd']);
    });
});
(0, vitest_1.describe)('an inspector field', function () {
    (0, vitest_1.it)('takes a number in range, with spaces round it', function () {
        (0, vitest_1.expect)((0, design_forms_1.numberError)(' 390 ', 1, 10000, en_1.t.designs.what.width)).toBeUndefined();
    });
    vitest_1.it.each(['', 'abc', '0', '10001', 'Infinity'])('says what to enter for %j', function (typed) {
        (0, vitest_1.expect)((0, design_forms_1.numberError)(typed, 1, 10000, en_1.t.designs.what.width)).toBe('Enter a width from 1 to 10000.');
    });
    (0, vitest_1.it)('takes a #RRGGBB colour and refuses anything else', function () {
        (0, vitest_1.expect)((0, design_forms_1.colourError)(' #ddf2e8 ')).toBeUndefined();
        (0, vitest_1.expect)((0, design_forms_1.colourError)('jade')).toBe('Enter a colour like #DDF2E8.');
    });
});
