import i18next, { TFunction } from 'i18next';

function defaultNamespaceUsage(t: TFunction) {
  t('bar');
  t('foo');
  t('baz.bing');
  t('inter', { val: 'xx' });
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
  t('baz', { ns: ['alternate', 'custom'] as const });

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

// @ts-expect-error
function returnNeverWithInvalidNamespace(t: TFunction<string>) {
  const result: never = t('foo');
}

function nullTranslations() {
  // seems to work only when not using typesafe translations
  // i18next.t('nullKey').trim();
}
