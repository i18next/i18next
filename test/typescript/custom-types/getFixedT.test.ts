import i18next from 'i18next';

const t1 = i18next.getFixedT(null, null, 'foo');

const t2 = i18next.getFixedT(null, 'alternate', 'foobar.deep');
t2('deeper.deeeeeper');
t2('deeper').deeeeeper;

const t3 = i18next.getFixedT('en');
t3('foo');

const t4 = i18next.getFixedT('en', 'alternate', 'foobar');
t4('barfoo');

// @ts-expect-error
const t5 = i18next.getFixedT(null, null, 'xxx');

const t6 = i18next.getFixedT(null, 'alternate', 'foobar');
// @ts-expect-error
t6('xxx');
