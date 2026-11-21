import { describe, it, expect, beforeAll } from 'vitest';
import i18next from '../../src/i18next.js';

/** @type {import('i18next').i18n} */
const instance = i18next.createInstance();

describe('i18next.interpolation.nesting', () => {
  beforeAll(async () => {
    await instance.init({
      lng: 'en',
      resources: {
        en: {
          translation: {
            test1: 'test $t(nest1) {{a}}',
            nest1: 'nest value',
            // options
            test2: 'test $t(nest2, { "b": "{{a}}" })',
            nest2: 'nest {{b}}',
            // 2 options
            test3: 'test $t(nest3, { "b": "{{a}}", "c": "{{b}}" })',
            nest3: 'nest {{b}} {{c}}',
            // , in key
            test102: '$t(test102, is, {"key": "success"})',
            'test102, is': 'this test is {{key}}',
            // , in key and two options , separated
            test103: '$t(test103, is, {"key": "success", "key2": "full"})',
            'test103, is': 'this test is {{key2}} {{key}}',
            keyA1: '{{text}} interpolated',
            keyB1: 'Text to interpolate => $t(keyA1, { "text": "foo" })',
            keyA1rec: '{{text}} interpolated | $t(keyB1rec)',
            keyB1rec: 'Text to interpolate => $t(keyA1rec, { "text": "foo" })',
            test_foo: "foo $t(test, { 'context': 'bar' })",
            test_bar: "bar $t(test, { 'context': 'baz' })",
            test_baz: 'baz',
            foo: '$t(bar, {"firstName": "{{firstName}}", "lastName": "{{lastName}}" })',
            fooSingle: `$t(bar, {'firstName': '{{firstName}}', 'lastName': '{{lastName}}' })`,
            fooMultiline: '$t(bar, {\n  "firstName": "Marc",\n  "lastName": "Weber"\n})',
            bar: '{{firstName}} {{lastName}}',

            item_one: 'item',
            item_other: 'items',
            thing_one: 'thing',
            thing_other: 'things',
            phrase: 'A: $t(thing, { "count": 1 }) B: $t(item)',
            phrase2: 'A: $t(thing, { "count": 2 }) B: $t(item)',

            date_MMDD: 'DD/MM/YY',
            dateTest: '$t({{format}}, customdDateFormatter)',

            nestingWithBracketsFirst: '$t(nestingWithBracketsSecond, {"name": "foo (bar)"})',
            nestingWithBracketsSecond: 'Hello {{name}}!',

            // $& $` $' $$ are String.replace patterns and must stay literal in nested values
            replacementPattern: 'Band: $t(replacementPatternValue)',
            replacementPatternValue: 'Rock $& Roll',
            replacementPatternOption: 'Hi $t(replacementPatternInner, { "n": "{{n}}" })',
            replacementPatternInner: 'name={{n}}',
            nestedFormatterNumber: 'Count: $t(nestedFormatterWord, len)',
            nestedFormatterWord: 'abc',
          },
        },
      },
    });
    instance.services.formatter.add('customdDateFormatter', (value, lng) => `${value} | ${lng}`);
    instance.services.formatter.add('len', (value) => value.length);
  });

  describe('nesting', () => {
    const tests = [
      {
        args: ['test1', { a: 'foo' }],
        expected: 'test nest value foo',
      },
      {
        args: ['test2', { a: 'foo' }],
        expected: 'test nest foo',
      },
      {
        args: ['test3', { a: 'foo', b: 'bar' }],
        expected: 'test nest foo bar',
      },
      {
        args: ['test102'],
        expected: 'this test is success',
      },
      {
        args: ['test103'],
        expected: 'this test is full success',
      },
      {
        args: ['$t(test1)', { a: 'foo' }],
        expected: 'test nest value foo',
      },
      {
        args: ['$t(translation:test1)', { a: 'foo' }],
        expected: 'test nest value foo',
      },
      {
        args: ['something $t(test1)', { a: 'foo' }],
        expected: 'something test nest value foo',
      },
      {
        args: ['something $t(translation:test1)', { a: 'foo' }],
        expected: 'something test nest value foo',
      },
      {
        args: ['keyB1'],
        expected: 'Text to interpolate => foo interpolated',
      },
      {
        args: ['keyB1rec'],
        expected: 'Text to interpolate => foo interpolated | ',
      },
      {
        args: ['test', { context: 'foo' }],
        expected: 'foo bar baz',
      },
      {
        args: [
          'foo',
          { firstName: `Cool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `Cool O'Dood`,
      },
      {
        args: [
          'foo',
          { firstName: `C'ool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `C'ool O'Dood`,
      },
      {
        args: [
          'fooSingle',
          { firstName: `Cool`, lastName: `Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `Cool Dood`,
      },
      {
        args: ['fooMultiline'],
        expected: `Marc Weber`,
      },
      {
        args: [
          'bar',
          { firstName: `Cool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `Cool O'Dood`,
      },
      {
        args: [
          'bar',
          { firstName: `C'ool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `C'ool O'Dood`,
      },
      {
        args: ['phrase'],
        expected: 'A: thing B: item',
      },
      {
        args: ['phrase2'],
        expected: 'A: things B: item',
      },
      {
        args: ['dateTest', { format: 'date_MMDD' }],
        expected: 'DD/MM/YY | en',
      },
      {
        args: ['nestingWithBracketsFirst'],
        expected: 'Hello foo (bar)!',
      },
      {
        args: ['replacementPattern'],
        expected: 'Band: Rock $& Roll',
      },
      {
        args: ['replacementPatternOption', { n: 'X$&Y', interpolation: { escapeValue: false } }],
        expected: 'Hi name=X$&Y',
      },
      {
        args: ['nestedFormatterNumber'],
        expected: 'Count: 3',
      },
    ];

    tests.forEach((test) => {
      it(`correctly nests for ${JSON.stringify(test.args)} args`, () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});

describe('i18next.interpolation.nesting: values passed on in $t() options', () => {
  const resources = {
    en: {
      translation: {
        greet: 'Say Hi {{name}}',
        test: '$t(greet, { "name": "{{name}}" })',
        testUnescaped: '$t(greet, { "name": "{{- name}}" })',
        testSingleQuotes: "$t(greet, { 'name': '{{name}}' })",
        item_one: '{{count}} item for {{name}}',
        item_other: '{{count}} items for {{name}}',
        testCount: '$t(item, { "count": {{count}}, "name": "{{name}}" })',
        testDefaultValue: '$t(missing, { "defaultValue": "<b>{{name}}</b>" })',
        list: ['a', 'b'],
        testJoinArrays: '$t(list, { "joinArrays": "{{separator}}" })',
        // the formatter returns the whole $t() argument (react-i18next#1952)
        testFormatter: 'Size: $t({{value, bytes}})',
        testFormatterUnescaped: 'Size: $t({{- value, bytes}})',
        byte_one: '{{count}} byte',
        byte_other: '{{count}} bytes',
      },
    },
  };

  const create = async (interpolation) => {
    const instance = i18next.createInstance();
    await instance.init({ lng: 'en', resources, interpolation });
    instance.services.formatter.add('bytes', (value) => `byte, { "count": ${value} }`);
    return instance;
  };

  describe('with escapeValue: true', () => {
    let instance;
    beforeAll(async () => {
      instance = await create();
    });

    it('escapes a value once, as a direct t() call does', () => {
      expect(instance.t('test', { name: 'Tom & Jerry' })).toBe('Say Hi Tom &amp; Jerry');
      expect(instance.t('greet', { name: 'Tom & Jerry' })).toBe('Say Hi Tom &amp; Jerry');
      expect(instance.t('testSingleQuotes', { name: "O'Dood & Co" })).toBe(
        'Say Hi O&#39;Dood &amp; Co',
      );
      expect(instance.t('testCount', { count: 2, name: 'Tom & Jerry' })).toBe(
        '2 items for Tom &amp; Jerry',
      );
    });

    it('passes on a value with quotes, backslashes and braces unchanged', () => {
      expect(instance.t('test', { name: 'C:\\new "q", {b} it\'s' })).toBe(
        'Say Hi C:\\new &quot;q&quot;, {b} it&#39;s',
      );
    });

    it('interpolates a value once (skipOnVariables)', () => {
      expect(instance.t('test', { name: '{{other}}', other: 'X' })).toBe('Say Hi {{other}}');
    });

    it('keeps {{- }} unescaped there, escaped once by the nested t()', () => {
      expect(instance.t('testUnescaped', { name: 'Tom & Jerry' })).toBe('Say Hi Tom &amp; Jerry');
    });

    it('escapes a value once in defaultValue and joinArrays, which are not interpolated again', () => {
      expect(instance.t('testDefaultValue', { name: '<i>' })).toBe('<b>&lt;i&gt;</b>');
      expect(instance.t('testJoinArrays', { separator: '<br>' })).toBe('a&lt;br&gt;b');
    });

    it('parses $t() options a formatter returns only with {{- }}', () => {
      expect(instance.t('testFormatter', { value: 3 })).not.toContain('3 bytes');
      expect(instance.t('testFormatterUnescaped', { value: 3 })).toBe('Size: 3 bytes');
    });
  });

  describe('with escapeValue: false', () => {
    let instance;
    beforeAll(async () => {
      instance = await create({ escapeValue: false });
    });

    it('passes on a value unchanged', () => {
      expect(instance.t('test', { name: 'Tom & Jerry' })).toBe('Say Hi Tom & Jerry');
      expect(instance.t('test', { name: 'C:\\new "q", {b} it\'s' })).toBe(
        'Say Hi C:\\new "q", {b} it\'s',
      );
      expect(instance.t('testSingleQuotes', { name: "O'Dood & Co" })).toBe("Say Hi O'Dood & Co");
      expect(instance.t('testDefaultValue', { name: '<i>' })).toBe('<b><i></b>');
      expect(instance.t('testJoinArrays', { separator: '<br>' })).toBe('a<br>b');
    });
  });

  describe('with skipOnVariables: false', () => {
    let instance;
    beforeAll(async () => {
      instance = await create({ skipOnVariables: false });
    });

    it('escapes a value once and interpolates the placeholders in it', () => {
      expect(instance.t('test', { name: 'Tom & Jerry' })).toBe('Say Hi Tom &amp; Jerry');
      expect(instance.t('test', { name: '{{other}}', other: 'X & Y' })).toBe('Say Hi X &amp; Y');
    });
  });
});
