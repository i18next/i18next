import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    keySeparator: false;
    defaultNS: 'flat';
    resources: {
      flat: {
        'nested.c': 'flat nested.c';
        'nested.d.e': 'flat nested.d.e';
        isfalsey: 'A value';
        'Hello. World': 'Hello. World';
        greet: 'Hi {{name}}';
      };
      deep: {
        nested: { c: 'nested c' };
        plain: 'P';
      };
    };
  }
}
