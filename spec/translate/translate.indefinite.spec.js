describe('indefinite article usage', function() {
  describe('basic usage - singular, plural and indefinite', function() {
    var resStore = {
      dev: {
        'ns.2': {
          thing: '__count__ thing from ns.2',
          thing_plural: '__count__ things from ns.2',
          thing_indefinite: 'A thing from ns.2',
          thing_plural_indefinite: 'Some things from ns.2'
        },
        'ns.3': {
          thing: '__count__ things',
          thing_indefinite: 'A thing',
          thing_plural_indefinite: 'Some things'
        }
      },
      en: { },
      'en-US': {
        'ns.1': {
          thing: '__count__ thing',
          thing_plural: '__count__ things',
          thing_indefinite: 'A thing'
        }
      }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, {
        resStore: resStore,
        ns: { namespaces: ['ns.1', 'ns.2', 'ns.3'], defaultNs: 'ns.1'}
      }), function(t) { done(); });
    });

    it('it should provide the indefinite article when requested for singular forms', function() {
      expect(i18n.t('thing')).to.be('__count__ thing');
      expect(i18n.t('thing', {indefinite_article: true})).to.be('A thing');
      expect(i18n.t('thing', {count:1})).to.be('1 thing');
      expect(i18n.t('thing', {count:5})).to.be('5 things');
      expect(i18n.t('thing', {count:1, indefinite_article: true})).to.be('A thing');
      expect(i18n.t('thing', {count:5, indefinite_article: true})).to.be('5 things');
    });

    it('it should provide the indefinite article when requested for singular forms for second namespace', function() {
      expect(i18n.t('ns.2:thing', {count:1})).to.be('1 thing from ns.2');
      expect(i18n.t('ns.2:thing', {count:5})).to.be('5 things from ns.2');
      expect(i18n.t('ns.2:thing', {count:1, indefinite_article: true})).to.be('A thing from ns.2');
      expect(i18n.t('ns.2:thing', {count:5, indefinite_article: true})).to.be('Some things from ns.2');
    });

    it('it should provide the right indefinite translations from the third namespace', function() {
      expect(i18n.t('ns.3:thing', {count:5})).to.be('5 things');
      expect(i18n.t('ns.3:thing', {count:1, indefinite_article: true})).to.be('A thing');
      expect(i18n.t('ns.3:thing', {count:5, indefinite_article: true})).to.be('Some things')
    });
  });

  describe('extended usage - indefinite articles in languages with different plural forms', function() {
    var resStore = {
      dev: {
        translation: {
        }
      },
      zh: {
        translation: {
          key: "__count__ thing",
          key_indefinite: "a thing"
        }
      }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, {
        lng: 'zh',
        resStore: resStore
      }), function(t) { done(); });
    });

    it('it should provide the correct indefinite articles', function() {
      expect(i18n.t('key', {count: 1})).to.be('1 thing');
      expect(i18n.t('key', {count: 5})).to.be('5 thing');
      expect(i18n.t('key', {count: 1, indefinite_article: true})).to.be('a thing');
      expect(i18n.t('key', {count: 5, indefinite_article: true})).to.be('a thing');
    });
  });
});
