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
}

function i18nextTUsage() {
  i18next.t('alternate:foobar.barfoo');
  i18next.t('alternate:foobar.deep').deeper.deeeeeper;
  i18next.t('custom:bar');
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
