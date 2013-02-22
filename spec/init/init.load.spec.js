describe('with passed in resource set', function() {

  var resStore = {
    dev: { translation: { 'simple_dev': 'ok_from_dev' } },
    en: { translation: { 'simple_en': 'ok_from_en' } },            
    'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  it('it should provide passed in resources for translation', function() {
    expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
    expect(i18n.t('simple_en')).to.be('ok_from_en');
    expect(i18n.t('simple_dev')).to.be('ok_from_dev');
  });

});

describe('loading from server', function() {

  describe('with static route', function() {

    beforeEach(function(done) {
      i18n.init(opts, function(t) { done(); });
    });

    it('it should provide loaded resources for translation', function() {
      expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
      expect(i18n.t('simple_en')).to.be('ok_from_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_dev');
    });

  });

  describe('with dynamic route', function() {

    beforeEach(function(done) {

      var res = {
        dev: { translation: { 'simple_dev': 'ok_from_dev' } },
        en: { translation: { 'simple_en': 'ok_from_en' } },
        'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
      };

      var server = sinon.fakeServer.create();
      server.autoRespond = true;

      server.respondWith([200, { "Content-Type": "application/json" }, JSON.stringify(res)]);

      i18n.init(i18n.functions.extend(opts, { 
          resGetPath: 'locales/resources.json?lng=__lng__&ns=__ns__',
          dynamicLoad: true }),
        function(t) { server.restore(); done(); });
    });

    it('it should provide loaded resources for translation', function() {
      expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
      expect(i18n.t('simple_en')).to.be('ok_from_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_dev');
    });

  });

});