import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    fallbackNS: 'fallback';
    jsonFormat: 'v3';
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
        foo: 'foo';
        foo_1: 'foo';
        foo_2: 'foo';
        foo_plural: 'foo';
      };
      nonPlurals: {
        test: 'Test';
        test_2: 'Test 2';
        // 'test_form.title': 'title';
        test_form: {
          title: 'title';
        };
      };
      ctx: {
        foo: 'foo';
        foo_plural: 'foos';
        dessert_cake: 'a nice cake';
        dessert_muffin: 'a nice muffin';
        dessert_muffin_plural: '{{count}} nice muffins';
      };
      ord: {
        place_ordinal_1: '1st place';
        place_ordinal_2: '2nd place';
        place_ordinal_3: '3rd place';
        place_ordinal_plural: '{{count}}th place';
      };
    };
  }
}
