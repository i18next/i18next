import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    parseInterpolation: 'icu';
    resources: {
      translation: {
        plain: 'Plain';
        item_one: '{count} item';
        item_other: '{count} items';
      };
    };
  }
}
