const PATH_KEY = Symbol.for('i18next/PATH_KEY');

function createProxy() {
  const state = [];
  // `Object.create(null)` to prevent prototype pollution
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

export default function keysFromSelector(selector, opts) {
  const { [PATH_KEY]: path } = selector(createProxy());
  return path.join(opts?.keySeparator ?? '.');
}
