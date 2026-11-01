import { describe, it, expect, beforeAll, vi } from 'vitest';
import i18next from '../../src/i18next.js';

/** @type {import('i18next').i18n} */
const instance = i18next.createInstance();

describe('i18next.interpolation.nesting', () => {
  beforeAll(async () => {
    await instance.init({
      lng: 'en',
      interpolation: {
        // skipOnVariables: true, // true by default
      },
      resources: {
        en: {
          translation: {
            key: 'value {{a}}',
            key2: 'value {{a}} {{b}}',
            keyWithoutVar: 'value',
            nested: 'nested stuff',
            keyWithNest: '$t(nested2) value',
            keyWithNestAndVar: '$t(nested2) value {{a}}',
            nested2: 'HI',
            cur: 'Save {{CURRENCY}}{{AMOUNT}}',
          },
        },
      },
    });
  });

  describe('nesting', () => {
    const tests = [
      {
        args: ['keyWithoutVar'],
        expected: 'value',
      },
      {
        args: ['key', { a: 'hahaha' }],
        expected: 'value hahaha',
      },
      {
        args: ['keyWithNest'],
        expected: 'HI value',
      },
      {
        args: ['keyWithNestAndVar', { a: 'normal value' }],
        expected: 'HI value normal value',
      },
      {
        args: ['keyWithNestAndVar', { a: '$t(nested)' }],
        expected: '$t(nested2) value $t(nested)',
      },
      {
        args: ['key', { a: '{{nested}}' }],
        expected: 'value {{nested}}',
      },
      {
        args: ['key2', { a: '{{nested}}', b: 'something' }],
        expected: 'value {{nested}} something',
      },
      {
        args: [
          '{{a}} {{w}} {{a}} {{other}}',
          { a: '{{b}}', b: 'c', w: 'normal', other: 'whatever' },
        ],
        expected: '{{b}} normal {{b}} whatever',
      },
      {
        args: [
          '{{a}} {{w}} {{a}} {{other}}',
          { a: '     {{b}}', b: 'c', w: 'normal', other: 'whatever' },
        ],
        expected: '     {{b}} normal      {{b}} whatever',
      },
      {
        args: ['cur', { CURRENCY: '$', AMOUNT: 23 }],
        expected: 'Save $23',
      },
      {
        args: ['key', { a: '&&&{{b}}', b: 'leaked' }],
        expected: 'value &amp;&amp;&amp;{{b}}',
      },
      {
        args: ['key2', { a: '{{b}}', b: 'something' }],
        expected: 'value {{b}} something',
      },
      {
        args: ['key2', { a: '<{{b}}>', b: 'something' }],
        expected: 'value &lt;{{b}}&gt; something',
      },
      {
        args: [
          'key2',
          {
            a: '{{c}}',
            b: 5,
            c: 'leaked',
            interpolation: { useRawValueToEscape: true, escapeValue: false },
          },
        ],
        expected: 'value {{c}} 5',
      },
      {
        args: ['{{- a}}', { a: '{{b}}', b: 'c' }],
        expected: '{{b}}',
      },
      {
        args: ['{{- a}} {{b}}', { a: '<i>{{b}}</i>', b: '<b>' }],
        expected: '<i>{{b}}</i> &lt;b&gt;',
      },
      {
        args: ['{{b}} at {{- a}}', { a: '<i>{{b}}</i>', b: 'c' }],
        expected: 'c at <i>{{b}}</i>',
      },
    ];

    tests.forEach((test) => {
      it(`correctly nests for ${JSON.stringify(test.args)} args`, () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});

describe('missing variables with skipOnVariables', () => {
  const setup = async (debug) => {
    const warn = vi.fn();
    const inst = i18next.createInstance();
    await inst.use({ type: 'logger', log: () => {}, warn, error: () => {} }).init({
      debug,
      lng: 'en',
      resources: {
        en: { translation: { greet: 'Hello {{name}} from {{- place}}', other: 'Bye {{name}}' } },
      },
    });
    const missing = () =>
      warn.mock.calls
        .map((args) => args[0][0])
        .filter((m) => m.includes('missed to pass in variable'));
    return { inst, missing };
  };

  it('warns once per string and variable in debug mode', async () => {
    const { inst, missing } = await setup(true);
    expect(inst.t('greet')).to.equal('Hello {{name}} from {{- place}}');
    inst.t('greet');
    inst.t('greet', { name: 'Ann' });
    inst.t('other');
    expect(missing()).to.eql([
      'i18next::interpolator: missed to pass in variable place for interpolating Hello {{name}} from {{- place}}',
      'i18next::interpolator: missed to pass in variable name for interpolating Hello {{name}} from {{- place}}',
      'i18next::interpolator: missed to pass in variable name for interpolating Bye {{name}}',
    ]);
  });

  it('does not warn for a variable passed as undefined, or without debug', async () => {
    const { inst, missing } = await setup(true);
    inst.t('other', { name: undefined });
    expect(missing()).to.eql([]);
    const quiet = await setup(false);
    quiet.inst.t('other');
    expect(quiet.missing()).to.eql([]);
  });
});
