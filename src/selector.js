export const PATH_KEY = Symbol.for('i18next/PATH_KEY');

export function createProxy() {
  const state = [];
  const handler = Object.create(null);
  let proxy;
  handler.get = (target, key) => {
    proxy?.revoke?.();
    if (key === PATH_KEY) return state;
    state.push(key);
    proxy = Proxy.revocable(target, handler);
    return proxy.proxy;
  };
  return Proxy.revocable(Object.create(null), handler).proxy;
}

export function keysFromSelector(selector, opts) {
  const { [PATH_KEY]: PATH } = selector(createProxy());
  return PATH.join(opts?.keySeparator ?? '.');
}
