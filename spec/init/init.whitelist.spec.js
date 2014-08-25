describe('with language whitelist', function() {

  var resStore = {
    'zh-CN':  { translation: { 'string_one': 'good_zh-CN' } },
    en:       { translation: { 'string_one': 'good_en' } },
    zh:       { translation: { 'string_one': 'BAD_zh' } },
    'en-US':  { translation: { 'string_one': 'BAD_en-ZH' } }
  };

  it('should degrade UNwhitelisted 2-part lang code (en-US) to WHITELISTED 1-part (en)', function() {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, lngWhitelist: ['en', 'zh-CN'], lng: 'en-US' }));
    expect(i18n.lng()).to.be('en');
    expect(i18n.t('string_one')).to.be('good_en');
  });

  it('should NOT degrade WHITELISTED 2-part lang code (zh-CN) to UNwhitelisted 1-part (en)', function() {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, lngWhitelist: ['en', 'zh-CN'], lng: 'zh-CN' }));
    expect(i18n.lng()).to.be('zh-CN');
    expect(i18n.t('string_one')).to.be('good_zh-CN');
  });

});
