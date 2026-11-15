import { describe, it, expect } from 'vitest';
import BackendConnector from '../../../src/BackendConnector.js';
import Interpolator from '../../../src/Interpolator.js';
import ResourceStore from '../../../src/ResourceStore.js';

describe('BackendConnector failed loads', () => {
  it('keeps only the most recent 1000 failed loads', () => {
    const reads = [];
    const backend = {
      type: 'backend',
      callbackApi: true,
      read(lng, ns, callback) {
        reads.push(`${lng}|${ns}`);
        if (lng === 'en') return callback(null, { hi: 'hi' });
        return callback(new Error('not found'), false);
      },
    };
    const connector = new BackendConnector(
      backend,
      new ResourceStore(),
      { interpolator: new Interpolator() },
      {},
    );
    const readsOf = (name) => reads.filter((r) => r === name).length;

    connector.load(['en'], ['translation'], () => {});
    connector.load(['made-up-0'], ['translation'], () => {});
    // a failed load is remembered and not read again
    connector.load(['made-up-0'], ['translation'], () => {});
    expect(readsOf('made-up-0|translation')).toBe(1);

    // languages from requests: each made-up one used to stay in the state for good
    for (let i = 1; i < 5000; i++) connector.load([`made-up-${i}`], ['translation'], () => {});
    expect(Object.keys(connector.state)).toHaveLength(1001);
    expect(connector.state['en|translation']).toBe(2);
    expect(connector.state['made-up-4999|translation']).toBe(-1);

    // the oldest failure was let go, so it is read again
    connector.load(['made-up-0'], ['translation'], () => {});
    expect(readsOf('made-up-0|translation')).toBe(2);
  });
});
