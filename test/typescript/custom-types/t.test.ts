import i18next, { TFunction } from 'i18next';

function defaultNamespaceUsage(t: TFunction) {
  t('bar');
  t('foo');
}

function namedDefaultNamespaceUsage(t: TFunction<'alternate'>) {
  t('foobar.barfoo');
  t('foobar.deep.deeper.deeeeeper');
  t('foobar.deep.deeper').deeeeeper;
}

function arrayNamespace(t: TFunction<['custom', 'alternate']>) {
  t('alternate:baz');
  t('alternate:foobar.deep').deeper.deeeeeper;
  t('custom:bar');
}

// @ts-expect-error
function expectErrorWhenNamespaceDoesNotExist(t: TFunction<'foo'>) {}

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
  i18next.t('alternate:foobar.deep').deeper.deeeeeper;
  i18next.t('custom:bar');
  i18next.t('bar', { ns: 'custom' });
  // @ts-expect-error
  i18next.t('bar', { ns: 'alternate' });
  // i18next.t('bar', {});
  // i18next.t('bar');

  i18next.t('custom:bar', { defaultValue: 'some default value' });
  i18next.t('custom:bar', 'some default value');
  i18next.t('bar', { ns: 'custom', defaultValue: 'some default value' });
  // i18next.t('bar', { defaultValue: 'some default value' });
  // i18next.t('bar', 'some default value');
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
  i18next.t('plurals:foo', { count: 1 });
  i18next.t('plurals:foo_many', { count: 10 });
}

// @ts-expect-error
function returnNullWithFalseValue(t: TFunction<string>) {
  function fn(value: null) {}
  // @ts-expect-error
  fn(t('foo'));
}
