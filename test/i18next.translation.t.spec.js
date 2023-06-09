import i18next from '../src/i18next.js';

describe('i18next t default returns', () => {
  let i18n;
  before(() => {
    i18n = i18next.createInstance();
    i18n.init({
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {
            key: 'normal',
            keyNull: null,
            keyEmpty: '',
          },
        },
      },
    });
  });

  it('it should not return null values by default', () => {
    expect(i18n.t('key')).to.equal('normal');
    expect(i18n.t('keyNull')).to.equal('keyNull');
    expect(i18n.t('keyEmpty')).to.equal('');
  });
});
