describe('with synchronous flag', function() {

  beforeEach(function() {
    i18n.init(i18n.functions.extend(opts, { getAsync: false }) );
  });

  it('it should provide loaded resources for translation', function() {
    expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
    expect(i18n.t('simple_en')).to.be('ok_from_en');
    expect(i18n.t('simple_dev')).to.be('ok_from_dev');
  });

});