const PATH_KEY = Symbol('i18next/PATH_KEY');

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

  const keySeparator = opts?.keySeparator ?? '.';
  const nsSeparator = opts?.nsSeparator ?? ':';

  // If the first path segment is a known namespace, emit "ns<nsSeparator>rest.of.key"
  // so that extractFromKey can correctly split the namespace from the key — mirroring
  // the behaviour of the string overload `t('ns2:description.part1')`.
  if (path.length > 1 && nsSeparator) {
    const ns = opts?.ns;
    // eslint-disable-next-line no-nested-ternary
    const namespaces = ns ? (Array.isArray(ns) ? ns : [ns]) : [];
    if (namespaces.includes(path[0])) {
      return `${path[0]}${nsSeparator}${path.slice(1).join(keySeparator)}`;
    }
  }

  return path.join(keySeparator);
}
