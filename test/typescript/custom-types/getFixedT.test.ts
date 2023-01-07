import i18next from 'i18next';

declare function expect<A extends string>(
  a: A,
): [A] extends [never] ? { never: true } : { toBeString: true; toBe(expected: A): void };

const tbaz = i18next.getFixedT(null, null, 'baz');
tbaz('bing');
// @ts-expect-error
tbaz('inter');

const t1 = i18next.getFixedT(null, null, 'foo');
// @ts-expect-error
t1('foo');
// @ts-expect-error
t1('bing');

const t2 = i18next.getFixedT(null, 'alternate', 'foobar.deep');
expect(t2('deeper.deeeeeper')).toBe('foobar');
// t2('deeper').deeeeeper; // i18next would say: "key 'deeper (en)' returned an object instead of string."
t2('deeper', { returnObjects: true }).deeeeeper;

const t3 = i18next.getFixedT('en');
expect(t3('foo')).toBeString;

expect(t3('alternate:foobar.deep.deeper.deeeeeper')).toBe('foobar');
expect(t3('foobar.deep.deeper.deeeeeper', { ns: 'alternate' })).toBe('foobar');

const t4 = i18next.getFixedT('en', 'alternate', 'foobar');
expect(t4('barfoo')).toBe('barfoo');

// @ts-expect-error
const t5 = i18next.getFixedT(null, null, 'xxx');

const t6 = i18next.getFixedT(null, 'alternate', 'foobar');
// @ts-expect-error
t6('xxx');

const t7 = i18next.getFixedT('en');
expect(t7('bar')).toBeString;
expect(t7('alternate:foobar.barfoo')).toBe('barfoo');
expect(t7('foobar.barfoo')).toBe('barfoo');
expect(t7('foobar.barfoo', { ns: 'alternate' })).toBe('barfoo');
expect(t7('inter', { ns: 'custom', val: 'thing' })).toBe('some {{val}}');
// @ts-expect-error
t7('foobar.barfoo', { ns: 'custom' });
// @ts-expect-error
t7('invalid:bar');

const t8 = i18next.getFixedT('en', 'alternate');
expect(t8('foobar.barfoo')).toBe('barfoo');
// not the most useful call, but still allowed:
expect(t8('alternate:foobar.barfoo')).toBe('barfoo');
// other namespaces via key prefix:
expect(t8('custom:foo')).toBe('foo');
expect(
  t8('foo', {
    ns: 'custom',
  }),
).toBe('foo');
// @ts-expect-error
t8('custom:invalid');
// @ts-expect-error
t8('foo');
// @ts-expect-error
t8('invalid:baz');

const t9 = i18next.getFixedT('en', ['alternate', 'custom']);
expect(t9('foo')).toBe('foo');
expect(t9('custom:foo')).toBe('foo');
// keys from both namespaces should be allowed in TS:
expect(t9('foobar.barfoo')).toBe('barfoo');
expect(t9('alternate:foobar.barfoo')).toBe('barfoo');
expect(t9('inter', { val: 'thing' })).toBe('some {{val}}');
expect(t9('inter', { ns: 'custom', val: 'thing' })).toBe('some {{val}}');
expect(t9('plurals:foo_zero')).toBe('foo');
expect(
  t9('foo_zero', {
    ns: 'plurals',
  }),
).toBe('foo');
// @ts-expect-error
t9('plurals:invalid');
// @ts-expect-error
t9('foo_zero');
// @ts-expect-error
t9('invalid:baz');
