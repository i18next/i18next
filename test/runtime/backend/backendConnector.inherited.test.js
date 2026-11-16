import { describe, it, expect } from 'vitest';
import BackendConnector from '../../../src/BackendConnector.js';
import Interpolator from '../../../src/Interpolator.js';
import ResourceStore from '../../../src/ResourceStore.js';

describe('BackendConnector with language codes named after inherited properties', () => {
  it('loads them without throwing or writing to Object.prototype', () => {
    const backend = {
      type: 'backend',
      callbackApi: true,
      read(lng, ns, callback) {
        callback(null, { hi: 'hi' });
      },
    };
    const connector = new BackendConnector(
      backend,
      new ResourceStore(),
      { interpolator: new Interpolator() },
      {},
    );
    const events = [];
    connector.on('loaded', (loaded) => events.push(loaded));

    // a detector passes these on from a request (`?lng=hasOwnProperty`); they used to throw
    // `obj[k].push is not a function`, which ended a server process with an async backend
    const names = ['hasOwnProperty', 'isPrototypeOf', '__defineGetter__', 'toLocaleString'];
    names.forEach((lng) => {
      const errors = [];
      connector.load([lng], ['translation'], (err) => errors.push(err));
      expect(errors).toEqual([undefined]);
    });

    expect(events).toEqual(names.map((lng) => ({ [lng]: { translation: true } })));
    expect(Object.prototype.hasOwnProperty.translation).toBeUndefined();
    expect(Object.prototype.isPrototypeOf.translation).toBeUndefined();
  });
});
