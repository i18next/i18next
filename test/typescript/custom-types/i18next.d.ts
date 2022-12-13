import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    // returnNull: false;
    resources: {
      custom: {
        foo: 'foo';
        bar: 'bar';
        baz: {
          bing: 'boop';
        };
        inter: 'some {{val}}';
        nullKey: null;
      };
      alternate: {
        baz: 'baz';
        foobar: {
          barfoo: 'barfoo';
          deep: {
            deeper: {
              deeeeeper: 'foobar';
            };
          };
        };
      };
      plurals: {
        foo_zero: 'foo';
        foo_one: 'foo';
        foo_two: 'foo';
        foo_many: 'foo';
        foo_other: 'foo';
      };
    };
  }
}
