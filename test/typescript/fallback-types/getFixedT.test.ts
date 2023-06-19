import i18next from 'i18next';

const t = i18next.getFixedT('en');
t('bar');
// @ts-expect-error
t('alternate:foobar.barfoo');
// @ts-expect-error
t('foobar.barfoo');
t('foobar.barfoo', { ns: 'alternate' });
t('fallbackKey');
t('anotherFallbackKey');
