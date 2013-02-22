describe('setting load', function() {

  describe('to current', function() {

    var spy; 

    beforeEach(function(done) {
      spy = sinon.spy(i18n.sync, '_fetchOne');
      i18n.init(i18n.functions.extend(opts, { 
          load: 'current' }),
        function(t) { done(); });
    });

    afterEach(function() {
      spy.restore();
    });

    it('it should load only current and fallback language', function() {
      expect(spy.callCount).to.be(2); // en-US, en
    });

    it('it should provide loaded resources for translation', function() {
      expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
      expect(i18n.t('simple_en')).not.to.be('ok_from_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_dev');
    });

  });

  describe('to unspecific', function() {

    var spy; 

    beforeEach(function(done) {
      spy = sinon.spy(i18n.sync, '_fetchOne');
      i18n.init(i18n.functions.extend(opts, { 
          load: 'unspecific' }),
        function(t) { done(); });
    });

    afterEach(function() {
      spy.restore();
    });

    it('it should load only unspecific and fallback language', function() {
      expect(spy.callCount).to.be(2); // en-US, en
    });

    it('it should provide loaded resources for translation', function() {
      expect(i18n.t('simple_en-US')).not.to.be('ok_from_en-US');
      expect(i18n.t('simple_en')).to.be('ok_from_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_dev');
    });

    it('it should return unspecific language', function() {
      expect(i18n.lng()).to.be('en');
    });

  });

});

describe('with fallback language set to false', function() {

  var spy; 

  beforeEach(function(done) {
    spy = sinon.spy(i18n.sync, '_fetchOne');
    i18n.init(i18n.functions.extend(opts, { 
        fallbackLng: false }),
      function(t) { done(); });
  });

  afterEach(function() {
    spy.restore();
  });

  it('it should load only specific and unspecific languages', function() {
    expect(spy.callCount).to.be(2); // en-US, en
  });

  it('it should provide loaded resources for translation', function() {
    expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
    expect(i18n.t('simple_en')).to.be('ok_from_en');
    expect(i18n.t('simple_dev')).not.to.be('ok_from_dev');
  });

});