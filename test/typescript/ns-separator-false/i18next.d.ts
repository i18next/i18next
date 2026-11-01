import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    nsSeparator: false;
    defaultNS: 'a';
    resources: {
      a: { isfalsey: 'A value'; plain: 'P' };
      b: { other: 'B' };
    };
  }
}
