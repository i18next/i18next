import i18next from '../src/i18next.js';

const Logger = {
  type: 'logger',

  entries: {
    log: [],
    warn: [],
    error: [],
  },

  log: function(args) {
    this.entries.log.push(args[0]);
  },
  warn: function(args) {
    this.entries.warn.push(args[0]);
  },
  error: function(args) {
    this.entries.error.push(args[0]);
  },

  reset: function() {
    this.entries = {
      log: [],
      warn: [],
      error: [],
    };
  },
};

const Backend = {
  type: 'backend',

  init(services, options) {
    this.services = services;
    this.options = options;
  },

  read(language, namespace, callback) {
    if (namespace.indexOf('fail') === 0) return callback('failed', false);
    callback(null, { status: 'ok', key: `${language}-${namespace}` });
  },

  created: [],

  create(languages, namespace, key) {
    this.created.push(`${languages.join('-')}-${namespace}-${key}`);
  },

  reset() {
    this.created = [];
  },
};

let i18n = i18next.createInstance();
i18n.use(Backend);
i18n.use(Logger);

describe('i18next', () => {
  describe('hasLoadedNamespace', () => {
    describe('not called init()', () => {
      it('it should nok', () => {
        expect(i18n.isInitialized).to.not.be.ok;
        expect(i18n.hasLoadedNamespace('ns1')).to.equal(false);
      });
    });

    describe('called init() not detecting lng', () => {
      it('it should ok - but warn about issue', done => {
        i18n.init({ debug: true, saveMissing: true }, (err, t) => {
          expect(i18n.isInitialized).to.be.ok;

          expect(i18n.hasLoadedNamespace('translation')).to.equal(false);

          expect(Logger.entries.warn[0]).to.equal(
            'i18next: init: no languageDetector is used and no lng is defined',
          );
          expect(Logger.entries.warn[1]).to.equal(
            'i18next: hasLoadedNamespace: i18n.languages were undefined or empty',
          );
          Logger.reset();
          done();
        });
      });
    });

    describe('called init() properly', () => {
      before(done => {
        i18n = i18n.cloneInstance({ debug: true, saveMissing: true, lng: 'en-US' }, () => {
          done();
        });
      });

      it('it should ok for loaded ns', () => {
        expect(i18n.hasLoadedNamespace('translation')).to.equal(true);
      });

      it('it should nok for not loaded ns', () => {
        expect(i18n.hasLoadedNamespace('ns1')).to.equal(false);
      });

      describe('translator - calling t', () => {
        it('it should not log anything if loaded ns', () => {
          i18n.t('keyNotFound');
          expect(Logger.entries.warn.length).to.equal(0);
          Logger.reset();
        });

        it('it should not call saveMissing create on backend if not loaded ns', () => {
          i18n.t('ns1:keyNotFound');

          expect(Logger.entries.warn.length).to.equal(3);
          expect(Logger.entries.warn[0]).to.equal(
            'i18next::translator: key "keyNotFound" for languages "en-US, en, dev" won\'t get resolved as namespace "ns1" was not yet loaded',
          );
          Logger.reset();
        });
      });

      describe('backendConnector - saveMissing', () => {
        it('it should call saveMissing create on backend if loaded ns', () => {
          i18n.t('keyNotFound');
          expect(Backend.created.length).to.equal(1);
          expect(Backend.created[0]).to.equal('dev-translation-keyNotFound');
          Backend.reset();
        });

        it('it should not call saveMissing create on backend if not loaded ns', () => {
          i18n.t('ns1:keyNotFound');

          expect(Backend.created.length).to.equal(0);
          Backend.reset();

          expect(Logger.entries.warn.length).to.equal(2);
          expect(Logger.entries.warn[1]).to.equal(
            'i18next::backendConnector: did not save key "keyNotFound" as the namespace "ns1" was not yet loaded',
          );
          Logger.reset();
        });
      });
    });

    describe('for a namespace failed loading', () => {
      before(done => {
        i18n.loadNamespaces('fail-ns', () => {
          done();
        });
      });

      it('it should ok for loaded ns', () => {
        expect(i18n.hasLoadedNamespace('fail-ns')).to.equal(true);
      });
    });
  });

  describe('for lng = cimode', () => {
    before(done => {
      i18n.changeLanguage('cimode', () => {
        done();
      });
    });

    it('it should ok for loaded ns', () => {
      expect(i18n.hasLoadedNamespace('translation')).to.equal(true);
    });

    it('it should ok for not loaded ns', () => {
      expect(i18n.hasLoadedNamespace('ns1')).to.equal(true);
    });
  });

  describe('not having a backend', () => {
    const i18n2 = i18next.createInstance();
    i18n2.use(Logger);
    before(done => {
      i18n2.init(
        {
          debug: true,
          lng: 'en-US',
          resources: { 'en-US': { translation: {} }, dev: { translation: {} } },
        },
        () => {
          done();
        },
      );
    });

    it('it should ok for passed in ns', () => {
      expect(i18n2.hasLoadedNamespace('translation')).to.equal(true);
    });

    it('it should ok for not passed in ns - as there is no loading done', () => {
      expect(i18n2.hasLoadedNamespace('ns1')).to.equal(true);
    });
  });
});
