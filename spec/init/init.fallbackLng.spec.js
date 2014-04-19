describe('setting fallbackLng', function() {

  var resStore = {
    dev1: { translation: { 'simple_dev1': 'ok_from_dev1' } },
    en: { translation: { 'simple_en': 'ok_from_en' } },
    'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackLng: 'dev1' }),
      function(t) { done(); });
  });

  it('it should provide passed in resources for translation', function() {
    expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
    expect(i18n.t('simple_en')).to.be('ok_from_en');
    expect(i18n.t('simple_dev1')).to.be('ok_from_dev1');
  });

});

describe('multiple fallbackLng', function() {

  var resStore = {
    dev1: { translation: { 'simple_dev1': 'ok_from_dev1', 'simple_dev': 'ok_from_dev1' } },
    dev2: { translation: { 'simple_dev2': 'ok_from_dev2', 'simple_dev': 'ok_from_dev2' } },
    en: { translation: { 'simple_en': 'ok_from_en' } },
    'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackLng: ['dev1', 'dev2'] }),
      function(t) { done(); });
  });

  it('it should provide passed in resources for translation', function() {
    expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
    expect(i18n.t('simple_en')).to.be('ok_from_en');
    // in one
    expect(i18n.t('simple_dev1')).to.be('ok_from_dev1');
    expect(i18n.t('simple_dev2')).to.be('ok_from_dev2');
    // in both
    expect(i18n.t('simple_dev')).to.be('ok_from_dev1');
  });

});