describe('resource key as array', function() {
  var resStore = {
    dev: { translation: { existing1: 'hello _name_', existing2: 'howdy __name__' } },
    en: { translation: { } },
    'en-US': { translation: { } }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  describe('when none of the keys exist', function() {
    it('return the same value as translating the last non-existent key', function() {
      expect(i18n.t(['nonexistent1', 'nonexistent2'], {name: "Joe"})).to.equal(i18n.t('nonexistent2', {name: "Joe"}));
    });
  });

  describe('when one of the keys exist', function() {
    it('return the same value as translating the one existing key', function() {
      expect(i18n.t(['nonexistent1', 'existing2'], {name: "Joe"})).to.equal(i18n.t('existing2', {name: "Joe"}));
    });
  });

  describe('when two or more of the keys exist', function() {
    it('return the same value as translating the first existing key', function() {
      expect(i18n.t(['nonexistent1', 'existing2', 'existing1'], {name: "Joe"})).to.equal(i18n.t('existing2', {name: "Joe"}));
    });
  });
});
