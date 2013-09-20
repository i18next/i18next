describe('resource key as array', function() {
  var resStore = {
    dev: { translation: { existing1: 'hello', existing2: 'world' } },
    en: { translation: { } },
    'en-US': { translation: { } }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  describe('when none of the keys exist', function() {
    it('return the same value as translating the last non-existent key', function() {
      expect(i18n.t(['nonexistent1', 'nonexistent2'])).to.equal(i18n.t('nonexistent2'));
    });
  });

  describe('when one of the keys exist', function() {
    it('return the same value as translating the one existing key', function() {
      expect(i18n.t(['nonexistent1', 'existing2'])).to.equal(i18n.t('existing2'));
    });
  });

  describe('when two or more of the keys exist', function() {
    it('return the same value as translating the first existing key', function() {
      expect(i18n.t(['nonexistent1', 'existing2', 'existing1'])).to.equal(i18n.t('existing2'));
    });
  });
});
