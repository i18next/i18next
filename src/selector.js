export const PATH_KEY = Symbol.for('@i18next/PATH_KEY');

export function createProxy() {
  const state = Array.of();
  const handler = Object.create(null);
  let proxy;
  handler.get = (target, key) => {
    const index = Number.parseInt(String(key), 10);
    if (key === PATH_KEY) {
      proxy?.revoke?.();
      return state;
    }
    proxy?.revoke?.();
    proxy = Proxy.revocable(
      Object.assign(target, Object.assign(Object.create(null), { [PATH_KEY]: state })),
      handler,
    );
    Reflect.set(state, state.length, Number.isNaN(index) ? key : index);
    return proxy.proxy;
  };
  return Proxy.revocable(Object.create(null), handler).proxy;
}

export function keysFromSelector(selector) {
  const { [PATH_KEY]: PATH } = selector(createProxy());
  return PATH.join('.');
}
