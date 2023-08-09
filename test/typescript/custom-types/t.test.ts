import i18next, { TFunction } from 'i18next';

function defaultNamespaceUsage(t: TFunction) {
  t('bar');
  t('foo');
  t('baz.bing');
  t('inter', { val: 'xx' });
  // @ts-expect-error
  t('inter', { wrongOrNoValPassed: 'xx' });
  t('baz', { returnObjects: true }).bing;

  // @ts-expect-error
  t('baz');
  // @ts-expect-error
  t('custom:bar');
  // @ts-expect-error
  t('foobar');
}

function namedDefaultNamespaceUsage(t: TFunction<'alternate'>) {
  t('foobar.barfoo');
  t('foobar.deep.deeper.deeeeeper');
  // t('foobar.deep.deeper').deeeeeper; // i18next would say: "key 'foobar.deep.deeper (en)' returned an object instead of string."
  t('foobar.deep.deeper', { returnObjects: true }).deeeeeper;

  // @ts-expect-error
  t('alternate:foobar.barfoo');
  // @ts-expect-error
  t('foobar');
}

function arrayNamespace(t: TFunction<['custom', 'alternate']>) {
  t('baz.bing');
  t('alternate:baz');
  t('baz', { ns: 'alternate' });
  // t('alternate:foobar.deep').deeper.deeeeeper; // i18next would say: "key 'foobar.deep (en)' returned an object instead of string."
  t('alternate:foobar.deep', { returnObjects: true }).deeper.deeeeeper;
  t('custom:bar');
  t('bar', { ns: 'custom' });
  t('bar');
  t('baz', { ns: ['alternate', 'custom'] });

  // @ts-expect-error
  t('baz');
  // @ts-expect-error
  t('baz', { ns: 'custom' });
  // @ts-expect-error
  t('alternate:foobar.deep');
}

// @ts-expect-error
function expectErrorWhenNamespaceDoesNotExist(t: TFunction<'foo'>) {}

function expectTFunctionToReturnString(t: TFunction<'alternate'>) {
  t('baz').trim();
  t('foobar.barfoo').trim();

  const alternateTranslationKeys = ['baz', 'foobar.barfoo'] as const;
  alternateTranslationKeys
    .map((value) => {
      return t(value);
    })
    .map((translation) => translation.trim());

  // @ts-expect-error
  t('foobar', { returnObjects: true }).trim();
}

function expectErrorWhenKeyNotInNamespace(t: TFunction<'alternate'>) {
  // @ts-expect-error
  t('bar');
  t('foobar.barfoo');

  t('foobar.barfoo', 'some default value');
  t('foobar.barfoo', { defaultValue: 'some default value' });

  // @ts-expect-error
  t('new.key');
  // @ts-expect-error
  t('new.key', { other: 'stuff' });
  t('new.key', { defaultValue: 'some default value' });
  t('new.key', 'some default value');
}

function i18nextTUsage() {
  i18next.t('foobar.barfoo', { ns: 'alternate' });
  i18next.t('alternate:foobar.barfoo');
  // i18next.t('alternate:foobar.deep').deeper.deeeeeper; // i18next would say: "key 'foobar.deep (en)' returned an object instead of string."
  i18next.t('alternate:foobar.deep', { returnObjects: true }).deeper.deeeeeper;
  i18next.t('foobar.deep', { ns: 'alternate', returnObjects: true }).deeper.deeeeeper;
  i18next.t('foobar.deep', { ns: 'alternate', returnObjects: true, returnDetails: true }).res;
  i18next.t('custom:bar').trim();
  i18next.t('bar', { ns: 'custom' }).trim();
  // @ts-expect-error
  i18next.t('bar', { ns: 'alternate' });
  i18next.t('bar', {}).trim();
  i18next.t('bar').trim();
  i18next.t('baz.bing').trim();
  i18next.t('alternate:foobar.barfoo').trim();

  // with interpolation
  i18next.t('custom:inter', { val: 'asdf' }).trim();
  i18next.t('inter', { val: 'asdf', ns: 'custom' }).trim();
  i18next.t('inter', { val: 'asdf' }).trim();
  i18next.t('qux', { val: 'asdf' }).trim();
  // @ts-expect-error
  i18next.t('custom:inter', { foo: 'asdf' });

  i18next.t('custom:bar', { defaultValue: 'some default value' });
  i18next.t('custom:bar', 'some default value');
  i18next.t('bar', { ns: 'custom', defaultValue: 'some default value' });
  i18next.t('bar', { defaultValue: 'some default value' });
  i18next.t('bar', 'some default value');

  const str: string = i18next.t('unknown-ns:unknown-key', 'default value');
}

function expectErrorWhenInvalidKeyWithI18nextT() {
  // @ts-expect-error
  i18next.t('custom:test');
}

function expectErrorWhenInvalidNamespaceWithI18nextT() {
  // @ts-expect-error
  i18next.t('test:bar');
}

function i18nextTPluralsUsage() {
  i18next.t('plurals:foo', { count: 1 }).trim();
  i18next.t('plurals:foo_many', { count: 10 }).trim();
}

function i18nextOrdinalPluralUsage(t: TFunction<'ord'>) {
  t('place', { ordinal: true, count: 1 }).trim();
  t('place', { ordinal: true, count: 2 }).trim();
  t('place', { ordinal: true, count: 3 }).trim();
  t('place', { ordinal: true, count: 4 }).trim();
}

// @ts-expect-error
function returnNeverWithInvalidNamespace(t: TFunction<string>) {
  const result: never = t('foo');
}

function nullTranslations() {
  // seems to work only when not using typesafe translations
  // i18next.t('nullKey').trim();
}

function i18nextContextUsage(t: TFunction<'ctx'>) {
  t('dessert', { context: 'cake' }).trim();

  // context + plural
  t('dessert', { context: 'muffin', count: 3 }).trim();

  // @ts-expect-error
  // valid key with invalid context
  t('foo', { context: 'cake' }).trim();
}

function expectErrorsForDifferentTFunctions(
  t1: TFunction<'ord'>,
  t2: TFunction<['ord', 'plurals']>,
  t3: TFunction<['plurals', 'ord']>,
) {
  const fn: (t: TFunction<'plurals'>) => void = () => {};

  // @ts-expect-error
  fn(t1);
  // @ts-expect-error
  fn(t2);
  fn(t3); // no error
}

function usingTFunctionInsideAnotherTFunction(t: TFunction) {
  t('foo', { defaultValue: t('bar') });

  t('foo', { something: t('bar') });

  t('foo', { defaultValue: t('bar'), something: t('bar') });
}
