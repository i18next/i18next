done:
[x] cache layer on backendConnector
[x] have a reload mechanism on backend with retries onError
[x] keep specific backend stuff as thin as possible
[x] ALWAYS ADD BACKEND, CACHE AND LNGDETECTOR browser vs node env: separate build or https://github.com/iliakan/detect-node/blob/master/index.js
[x] post missing
[x] lng detection + caching
[x] sprintf
[x] make init in cache, build etc. not override current options
[x] usage of EventEmitter
[x] finalize build, publish alpha
[x] move cache, backend, detector, postProcessor to own repos/package.json
[x] update current i18next and add changes here - freece v1.11.x

beta:
[x] key and namespace separator
[x] allow separator override in translation options
[x] logger
[ ] add deprecation WARNINGS for apis appended
[ ] move XHR test to repo -> expose lib on this so we could grab eg. interpolator there
[x] think about reintroducing array joining in translation -> options + json compat
[x] have json v1 compatibility change the interpolation prefix/suffix
[ ] localStorage on adding in resourceStore
[x] simplify logger have prefix on outer class - logger internal as singleton or class
[x] getFixedT optional fix namespace too
[x] move modules to i18next.modules stop exposing them on root object -> copy them on cloning
[x] loading translation failed...only do warning not error
[x] node language detector

release:
[ ] jquery integration
[ ] test creation of instance more
[ ] cdnjs (https://github.com/cdnjs/cdnjs/tree/master/ajax/libs/i18next)
[ ] jsDelivr (https://github.com/jsdelivr/jsdelivr/blob/master/files/i18next/update.json)

later:
[ ] more test out of compat
[ ] forced reset and reload of store

onDemand:
[ ] introduce meta information on load -> loadedOn, res.statusCode
