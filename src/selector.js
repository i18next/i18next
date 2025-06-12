export const PATH_KEY = Symbol.for('@i18next/PATH_KEY');

function join(path, opts) {
  return path.reduce((acc, cur) => {
    if (acc.endsWith(opts.nsSeparator)) {
      return `${acc.slice(0, -opts.nsSeparator.length)}${opts.nsSeparator}${cur}`;
    }
    if (acc.length === 0) {
      return `${cur}`;
    }
    return `${acc}.${cur}`;
  }, '');
}

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

export function keysFromSelector(selector, opts) {
  const { [PATH_KEY]: PATH } = selector(createProxy());
  return join(PATH, opts);
}
