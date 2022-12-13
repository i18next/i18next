import i18next, { t, TFunction, TFuncKey } from 'i18next';

function defaultNamespaceUsage(t: TFunction) {
  t('bar');
  t('foo');
}

function namedDefaultNamespaceUsage(t: TFunction<'alternate'>) {
  t('foobar.barfoo');
  t('foobar.deep.deeper.deeeeeper');
  // t('foobar.deep.deeper').deeeeeper; // i18next would say: "key 'foobar.deep.deeper (en)' returned an object instead of string."
  t('foobar.deep.deeper', { returnObjects: true }).deeeeeper;
}

function arrayNamespace(t: TFunction<['custom', 'alternate']>) {
  t('alternate:baz');
  t('baz', { ns: 'alternate' });
  // t('alternate:foobar.deep').deeper.deeeeeper; // i18next would say: "key 'foobar.deep (en)' returned an object instead of string."
  t('alternate:foobar.deep', { returnObjects: true }).deeper.deeeeeper;
  t('custom:bar');
  t('bar', { ns: 'custom' });
  t('bar');
}

// @ts-expect-error
function expectErrorWhenNamespaceDoesNotExist(t: TFunction<'foo'>) {}

function expectTFunctionToReturnString(t: TFunction<'alternate'>) {
  const alternateTranslationKey1: TFuncKey<'alternate'> = 'baz';
  t(alternateTranslationKey1).trim();
  const alternateTranslationKey2: TFuncKey<'alternate'> = 'foobar.barfoo';
  t(alternateTranslationKey2).trim();

  const alternateTranslationKeys: Array<TFuncKey<'alternate'>> = ['baz', 'foobar.barfoo'];
  // const locatedInValues = alternateTranslationKeys
  //   .map((value) => t(value, {}))
  //   .map((translation) => translation.trim()); // ???WHY??? Property 'trim' does not exist on type '{ bing: "boop"; }'
}

function expectErrorWhenKeyNotInNamespace(t: TFunction<'alternate'>) {
  // @ts-expect-error
  t('bar');
  t('foobar.barfoo');

  t('foobar.barfoo', 'some default value');
  t('foobar.barfoo', { defaultValue: 'some default value' });

  t('not.yet.existing', 'some default value');
  t('not.yet.existing', { defaultValue: 'some default value' });
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

  i18next.t('custom:bar', { defaultValue: 'some default value' });
  i18next.t('custom:bar', 'some default value');
  i18next.t('bar', { ns: 'custom', defaultValue: 'some default value' });
  i18next.t('bar', { defaultValue: 'some default value' });
  i18next.t('bar', 'some default value');

  i18next.t('custom:no.existing.yet', { defaultValue: 'some default value' });
  i18next.t('custom:no.existing.yet', 'some default value');
  i18next.t('no.existing.yet', { ns: 'custom', defaultValue: 'some default value' });
  i18next.t('no.existing.yet', { defaultValue: 'some default value' });
  i18next.t('no.existing.yet', 'some default value');
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
function returnNullWithFalseValue(t: TFunction<string>) {
  function fn(value: null) {}
  // @ts-expect-error
  fn(t('foo'));
}

function nullTranslations() {
  t('nullKey').trim();
}
