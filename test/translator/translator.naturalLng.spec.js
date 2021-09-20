import i18next from '../../src/i18next.js';

const instance = i18next.createInstance();

describe('Translator', () => {
  describe('translate() with natural language', () => {
    before((done) => {
      instance.init(
        {
          lng: 'en',
          fallbackLng: 'en',
          resources: {
            en: {
              translation: {
                'test: with a sentence. or more text': 'test_en',
              },
              test: {
                anotherKey: 'from other ns',
              },
            },
            de: {
              translation: {
                'test: with a sentence. or more text': 'test_de',
              },
            },
          },
        },
        () => {
          done();
        },
      );
    });

    const tests = [
      { args: ['test: with a sentence. or more text'], expected: 'test_en' },
      {
        args: ['test: with a sentence. or more text', { lngs: ['en-US', 'en'] }],
        expected: 'test_en',
      },
      { args: ['test: with a sentence. or more text', { lngs: ['de'] }], expected: 'test_de' },
      { args: ['test: with a sentence. or more text', { lng: 'de' }], expected: 'test_de' },
      { args: ['test: with a sentence. or more text', { lng: 'fr' }], expected: 'test_en' },
      { args: ['test: with a sentence. or more text', { lng: 'en-US' }], expected: 'test_en' },
      { args: ['test:anotherKey', { lng: 'en' }], expected: 'from other ns' },
    ];

    tests.forEach((test) => {
      it('correctly formats translations for ' + JSON.stringify(test.args), () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});
