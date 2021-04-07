import i18next from '../src/i18next.js';

const instance = i18next.createInstance();

describe('i18next.interpolation.nesting', () => {
  before(done => {
    instance.init(
      {
        lng: 'en',
        interpolation: {
          skipOnVariables: true,
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
            },
          },
        },
      },
      () => {
        done();
      },
    );
  });

  describe('nesting', () => {
    var tests = [
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
    ];

    tests.forEach(test => {
      it('correctly nests for ' + JSON.stringify(test.args) + ' args', () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});
