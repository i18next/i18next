describe('using function provided in callback\'s argument', function() {

  var cbT;

  beforeEach(function(done) {
    i18n.init(opts, function(err, t) { cbT = t; done(); });
  });

  it('it should provide loaded resources for translation', function() {
    expect(cbT('simple_en-US')).to.be('ok_from_en-US');
    expect(cbT('simple_en')).to.be('ok_from_en');
    expect(cbT('simple_dev')).to.be('ok_from_dev');
  });

});

describe('with lowercase flag', function() {

  describe('default behaviour will uppercase specifc country part.', function() {

    beforeEach(function() {
      i18n.init(i18n.functions.extend(opts, {
        lng: 'en-us',
        resStore: {
          'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
        }
      }, function(t) { done(); }) );
    });

    it('it should translate the uppercased lng value', function() {
      expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
    });

    it('it should get uppercased set language', function() {
      expect(i18n.lng()).to.be('en-US');
    });

  });

  describe('overridden behaviour will accept lowercased country part.', function() {

    beforeEach(function() {
      i18n.init(i18n.functions.extend(opts, {
        lng: 'en-us',
        lowerCaseLng: true,
        resStore: {
          'en-us': { translation: { 'simple_en-us': 'ok_from_en-us' } }
        }
      }, function(t) { done(); }) );
    });

    it('it should translate the lowercase lng value', function() {
      expect(i18n.t('simple_en-us')).to.be('ok_from_en-us');
    });

    it('it should get lowercased set language', function() {
      expect(i18n.lng()).to.be('en-us');
    });

  });

});
