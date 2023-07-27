import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    fallbackNS: 'fallback';
    resources: {
      custom: {
        foo: 'foo';
        bar: 'bar';
        baz: {
          bing: 'boop';
        };
        qux: 'some {{val, number}}';
        inter: 'some {{val}}';
        nullKey: null;
      };
      fallback: {
        fallbackKey: 'fallback';
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
      ctx: {
        foo: 'foo';
        dessert_cake: 'a nice cake';
        dessert_muffin_one: 'a nice muffin';
        dessert_muffin_other: '{{count}} nice muffins';
      };
      ord: {
        place_ordinal_one: '1st place';
        place_ordinal_two: '2nd place';
        place_ordinal_few: '3rd place';
        place_ordinal_other: '{{count}}th place';
      };
    };
  }
}
