import i18next from '../src/i18next.js';
import BackendMock from './backend/backendMock.js';

describe('i18next backend', () => {
  const i18n = i18next.createInstance();

  before(() => {
    i18n.use(BackendMock).init({
      fallbackLng: 'en',
      fallbackNS: 'concurrently',
      ns: [],
      defaultNS: '',
    });
  });

  describe('loadNamespaces concurrently', () => {
    it('should load data correctly', (done) => {
      let finished = 0;
      const loadedClb = (index) =>
        function () {
          const handlingNS = index === 1 ? 'concurrentlyLonger' : 'concurrently';
          finished += index;
          if (i18n.t('status') !== 'ok')
            return done(`Expected "${i18n.t('status')}" to equal "ok"`);

          if (i18n.t('namespace', { ns: handlingNS }) !== handlingNS)
            return done(
              `Expected "${i18n.t('namespace', { ns: handlingNS })}" to equal "${handlingNS}"`,
            );
          if (finished === 3) done();
        };
      setTimeout(() => {
        i18n.loadNamespaces(['concurrentlyLonger']).then(loadedClb(1));
        i18n.loadNamespaces(['concurrently']).then(loadedClb(2));
      }, 0);
    });
  });
});
