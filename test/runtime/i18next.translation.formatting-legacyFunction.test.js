import { describe, it, expect, beforeAll } from 'vitest';
import i18next from '../../src/i18next.js';

const instance = i18next.createInstance();

describe('i18next.translation.formatting.legacyFunction', () => {
  beforeAll(async () => {
    instance.init({
      showSupportNotice: false,
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
            oneFormatterUsingCurrencyTest: 'The following text is an amount: $t(key8, currency)',
            missingTranslationTest:
              'No text will be shown when the translation key is missing: $t(, uppercase)',
            key5: 'Here is some text',
            key6: 'Here is some text with numb3r5',
            key7: 'Here is some: text? with, (punctuation)',
            key8: '10000',
            withSpace: ' there',
            keyWithNesting: 'hi$t(withSpace)',
            twoInterpolationsWithUniqueFormatOptions:
              'The value is {{localValue, currency}} or {{altValue, currency}}',
          },
        },
      },
      interpolation: {
        format(value, format, lng, options) {
          if (format === 'uppercase') return value.toUpperCase();
          if (format === 'lowercase') return value.toLowerCase();
          if (format === 'underscore') return value.replace(/\s+/g, '_');
          if (format === 'encodeuricomponent') return encodeURIComponent(value);
          if (format === 'currency') {
            return Intl.NumberFormat(options.parmOptions[options.interpolationkey].locale, {
              style: 'currency',
              currency: options.parmOptions[options.interpolationkey].currency,
            }).format(value);
          }
          return value;
        },
      },
    });
  });

  describe('formatting', () => {
    const tests = [
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
      {
        args: [
          'twoInterpolationsWithUniqueFormatOptions',
          {
            localValue: 12345.67,
            altValue: 16543.21,
            parmOptions: {
              localValue: { currency: 'USD', locale: 'en-US' },
              altValue: { currency: 'CHF', locale: 'de-CH' },
            },
          },
        ],
        // The de-CH currency + thousands formatting changed across Node.js versions:
        //   Node 18/20: "CHF\u00a016\u2019543.21" (NBSP + RIGHT SINGLE QUOTATION MARK)
        //   Node 22:    "CHF 16&#39;543.21"        (space + HTML-escaped ASCII apostrophe)
        //   Node 24:    "CHF&#39;16&#39;543.21"    (apostrophe as currency spacing AND thousands sep)
        // Strategy: unescape/normalise all apostrophe variants to plain ' first, then
        // normalise CHF'digit -> "CHF digit" so all three collapse to "CHF 16'543.21".
        normalize: (s) => s.replace(/&#39;|[\u00a0\u2019]/g, "'").replace(/CHF'(\d)/g, 'CHF $1'),
        expected: "The value is $12,345.67 or CHF 16'543.21",
      },
      {
        args: [
          'oneFormatterUsingCurrencyTest',
          {
            parmOptions: {
              key8: { currency: 'USD', locale: 'en-US' },
            },
          },
        ],
        expected: 'The following text is an amount: $10,000.00',
      },
    ];

    tests.forEach((test) => {
      it(`correctly formats translations for ${JSON.stringify(test.args)}`, () => {
        const result = instance.t.apply(instance, test.args);
        const normalize = test.normalize ?? ((s) => s);
        expect(normalize(result)).to.eql(normalize(test.expected));
      });
    });
  });
});
