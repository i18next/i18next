import { describe, it, expect } from 'vitest';
import i18next from '../../src/i18next.js';

// a backend that records what it reads; `down` lists languages that fail
const backend = (down = []) => ({
  type: 'backend',
  callbackApi: true,
  reads: [],
  read(lng, ns, callback) {
    this.reads.push(`${lng}|${ns}`);
    if (down.includes(lng)) return callback(new Error('down'), false);
    callback(null, { key: `${lng} ${this.reads.length}` });
  },
});

describe('reloadResources()', () => {
  it('retries a bundle that failed to load', async () => {
    const down = ['de'];
    const b = backend(down);
    const instance = i18next.createInstance().use(b);
    await instance.init({ lng: 'en', fallbackLng: 'en', preload: ['en', 'de'] });
    expect(instance.getResource('de', 'translation', 'key')).to.equal(undefined);

    down.length = 0; // the outage is over
    await instance.reloadResources();
    expect(instance.getResource('de', 'translation', 'key')).to.match(/^de /);
  });

  it('without languages also reloads the languages a clone loaded on demand', async () => {
    const b = backend();
    const parent = i18next.createInstance().use(b);
    await parent.init({ lng: 'en', fallbackLng: 'en' });
    const clone = parent.cloneInstance();
    await clone.changeLanguage('fr');

    b.reads.length = 0;
    await parent.services.utils.reloadResources();
    expect(b.reads.sort()).to.eql(['en|translation', 'fr|translation']);
  });

  it('without languages still reloads the current language when it came from bundled resources', async () => {
    const b = backend();
    const instance = i18next.createInstance().use(b);
    await instance.init({ lng: 'en', fallbackLng: 'en', resources: { en: { translation: {} } } });
    expect(b.reads).to.eql([]);

    await instance.reloadResources();
    expect(b.reads).to.eql(['en|translation']);
  });

  it('with languages reloads only those', async () => {
    const b = backend();
    const instance = i18next.createInstance().use(b);
    await instance.init({ lng: 'en', fallbackLng: 'en', preload: ['de'] });

    b.reads.length = 0;
    await instance.reloadResources(['de']);
    expect(b.reads).to.eql(['de|translation']);
  });

  it('never requests cimode', async () => {
    const b = backend();
    const instance = i18next.createInstance().use(b);
    await instance.init({ lng: 'cimode', fallbackLng: 'en' });

    b.reads.length = 0;
    await instance.reloadResources();
    expect(b.reads).to.eql(['en|translation']);
  });
});
