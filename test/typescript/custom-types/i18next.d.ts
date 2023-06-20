import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    resources: {
      custom: {
        common: {
          foo: 'bar';
        };
        foo: 'foo';
        bar: 'bar';
        baz: {
          bing: 'boop';
        };
        qux: 'some {{val, number}}';
        inter: 'some {{val}}';
        nullKey: null;
      };
      alternate: {
        common: {
          foo: 'bar';
        };
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
        common: {
          foo: 'bar';
        };
        foo_zero: 'foo';
        foo_one: 'foo';
        foo_two: 'foo';
        foo_many: 'foo';
        foo_other: 'foo';
      };
      ctx: {
        common: {
          foo: 'bar';
        };
        dessert_cake: 'a nice cake';
        dessert_muffin_one: 'a nice muffin';
        dessert_muffin_other: '{{count}} nice muffins';
      };
      ord: {
        common: {
          foo: 'bar';
        };
        place_ordinal_one: '1st place';
        place_ordinal_two: '2nd place';
        place_ordinal_few: '3rd place';
        place_ordinal_other: '{{count}}th place';
      };
    };
  }
}
