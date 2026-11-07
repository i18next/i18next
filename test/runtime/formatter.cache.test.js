import { describe, it, expect } from 'vitest';
import i18next from '../../src/i18next.js';

describe('cached formatters', () => {
  it('keeps a bounded number of formatters when every call has a new value', () => {
    const instance = i18next.createInstance();
    instance.init({
      lng: 'en',
      initAsync: false,
      resources: { en: { translation: { price: 'Price {{val, counted}}' } } },
    });
    let made = 0;
    instance.services.formatter.addCached('counted', () => {
      made += 1;
      return (val) => `${val}`;
    });

    expect(instance.t('price', { val: 0 })).to.eql('Price 0');
    expect(instance.t('price', { val: 0 })).to.eql('Price 0');
    expect(made).to.eql(1);

    // each new value is part of the cache key, so each one makes a formatter
    for (let i = 1; i < 5000; i += 1) instance.t('price', { val: i });
    expect(made).to.eql(5000);

    // a recent value is still cached, the first one was let go
    instance.t('price', { val: 4999 });
    expect(made).to.eql(5000);
    expect(instance.t('price', { val: 0 })).to.eql('Price 0');
    expect(made).to.eql(5001);
  });
});
