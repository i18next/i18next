import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    strictKeyChecks: true;
    strictInterpolationChecks: true;
    defaultNS: 'app';
    resources: {
      app: {
        greeting: 'Hello {{name}}';
        plain: 'Plain';
        item_one: '{{count}} item';
        item_other: '{{count}} items';
        apple_one: 'An apple';
        apple_other: 'Apples';
        both: 'Both';
        both_one: '{{count}} of both';
        both_other: '{{count}} of both';
        place_ordinal_one: '{{count}}st place';
        place_ordinal_other: '{{count}}th place';
        nested: { label: 'Label'; file_one: 'A file'; file_other: '{{count}} files' };
      };
      other: {
        hello: 'Hi';
      };
    };
  }
}
