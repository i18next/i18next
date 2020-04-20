import i18next from '../src/i18next.js';

const instance = i18next.createInstance();

describe('i18next.translation.formatting', () => {
  before(done => {
    instance.init(
      {
        lng: 'en',
        resources: {
          en: {
            translation: {
              oneFormatterTest: 'The following text is uppercased: $t(key5, uppercase)',
              anotherOneFormatterTest: 'The following text is underscored: $t(key6, underscore)',
              twoFormattersTest:
                'The following text is uppercased: $t(key5, uppercase). The following text is underscored: $t(key5, underscore)',
              twoFormattersTogetherTest:
                'The following text is uppercased, underscored, then uri component encoded: $t(key7, uppercase, underscore, encodeuricomponent)',
              oneFormatterUsingAnotherFormatterTest:
                'The following text is lowercased: $t(twoFormattersTogetherTest, lowercase)',
              missingTranslationTest:
                'No text will be shown when the translation key is missing: $t(, uppercase)',
              key5: 'Here is some text',
              key6: 'Here is some text with numb3r5',
              key7: 'Here is some: text? with, (punctuation)',
              withSpace: ' there',
              keyWithNesting: 'hi$t(withSpace)',
            },
          },
        },
        interpolation: {
          format: function(value, format, lng) {
            if (format === 'uppercase') return value.toUpperCase();
            if (format === 'lowercase') return value.toLowerCase();
            if (format === 'underscore') return value.replace(/\s+/g, '_');
            if (format === 'encodeuricomponent') return encodeURIComponent(value);
            return value;
          },
        },
      },
      () => {
        done();
      },
    );
  });

  describe('formatting', () => {
    var tests = [
      {
        args: ['oneFormatterTest'],
        expected: 'The following text is uppercased: HERE IS SOME TEXT',
      },
      {
        args: ['anotherOneFormatterTest'],
        expected: 'The following text is underscored: Here_is_some_text_with_numb3r5',
      },
      {
        args: ['twoFormattersTest'],
        expected:
          'The following text is uppercased: HERE IS SOME TEXT. The following text is underscored: Here_is_some_text',
      },
      {
        args: ['twoFormattersTogetherTest'],
        expected:
          'The following text is uppercased, underscored, then uri component encoded: HERE_IS_SOME%3A_TEXT%3F_WITH%2C_(PUNCTUATION)',
      },
      {
        args: ['oneFormatterUsingAnotherFormatterTest'],
        expected:
          'The following text is lowercased: the following text is uppercased, underscored, then uri component encoded: here_is_some%3a_text%3f_with%2c_(punctuation)',
      },
      {
        args: ['missingTranslationTest'],
        expected: 'No text will be shown when the translation key is missing: ',
      },
      {
        args: ['keyWithNesting'],
        expected: 'hi there',
      },
    ];

    tests.forEach(test => {
      it('correctly formats translations for ' + JSON.stringify(test.args), () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});
