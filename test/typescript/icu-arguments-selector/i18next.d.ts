import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    parseInterpolation: 'icu';
    enableSelector: true;
    resources: {
      custom: {
        greeting: 'Hello {name}!';
        rows: '{count, plural, one {# row} other {# rows}}';
        gender: '{gender, select, male {He} other {They}} said {quote}';
        plain: 'Just a plain string';
        deep: { inner: 'Inner {value}' };
      };
      other: { welcome: 'Welcome {user}' };
    };
  }
}
