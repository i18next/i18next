describe('key with empty string value as valid option', function() {
  var resStore = {
    dev: { translation: { empty: '' } },
    en: { translation: { } },
    'en-US': { translation: { } }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) { done(); });
  });

  it('it should translate correctly', function() {
    expect(i18n.t('empty')).to.be('');
  });

  describe('missing on unspecific', function() {
    var resStore = {
      dev: { translation: { empty: 'text' } },
      en: { translation: { } },
      'en-US': { translation: { empty: '' } }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore, lng: 'en' }),
          function(t) { done(); });
    });

    it('it should translate correctly', function() {
      expect(i18n.t('empty')).to.be('text');
    });
  });

  describe('on specific language', function() {
    var resStore = {
      dev: { translation: { empty: 'text' } },
      en: { translation: { } },
      'en-US': { translation: { empty: '' } }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { done(); });
    });

    it('it should translate correctly', function() {
      expect(i18n.t('empty')).to.be('');
    });
  });
});

describe('key with empty string set to fallback if empty', function() {
  var resStore = {
    dev: { translation: { empty: '' } },
    en: { translation: { } },
    'en-US': { translation: { } }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackOnEmpty: true }),
        function(t) { done(); });
  });

  it('it should translate correctly', function() {
    expect(i18n.t('empty')).to.be('empty');
  });

  describe('missing on unspecific', function() {
    var resStore = {
      dev: { translation: { empty: 'text' } },
      en: { translation: { } },
      'en-US': { translation: { empty: '' } }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore, lng: 'en', fallbackOnEmpty: true }),
          function(t) { done(); });
    });

    it('it should translate correctly', function() {
      expect(i18n.t('empty')).to.be('text');
    });
  });

  describe('on specific language', function() {
    var resStore = {
      dev: { translation: { empty: 'text' } },
      en: { translation: { } },
      'en-US': { translation: { empty: '' } }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackOnEmpty: true }),
          function(t) { done(); });
    });

    it('it should translate correctly', function() {
      expect(i18n.t('empty')).to.be('text');
    });
  });
});