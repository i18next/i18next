export type TestNamespaceCustom = {
  foo: 'foo';
  bar: 'bar';
  baz: {
    bing: 'boop';
  };
  qux: 'some {{val, number}}';
  inter: 'some {{val}}';
  nullKey: null;
  'empty string with {{val}}': '';
};

export type TestNamespaceCustomAlternate = {
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

export type TestNamespaceFallback = {
  fallbackKey: 'fallback';
};

export type TestNamespaceOrdinal = {
  place_ordinal_one: '1st place';
  place_ordinal_two: '2nd place';
  place_ordinal_few: '3rd place';
  place_ordinal_other: '{{count}}th place';
};

export type TestNamespaceContext = {
  dessert_cake: 'a nice cake';
  dessert_muffin_one: 'a nice muffin';
  dessert_muffin_other: '{{count}} nice muffins';
};

export type TestNamespacePlurals = {
  foo_zero: 'foo';
  foo_one: 'foo';
  foo_two: 'foo';
  foo_many: 'foo';
  foo_other: 'foo';
};

export type TestNamespaceNonPlurals = {
  test: 'Test';
  test_2: 'Test 2';
  // 'test_form.title': 'title';
  test_form: {
    title: 'title';
  };
};
