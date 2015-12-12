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
[x] add deprecation WARNINGS for apis appended
[x] move XHR test to repo -> expose lib on this so we could grab eg. interpolator there
[x] think about reintroducing array joining in translation -> options + json compat
[x] have json v1 compatibility change the interpolation prefix/suffix
[x] localStorage on adding in resourceStore
[x] simplify logger have prefix on outer class - logger internal as singleton or class
[x] getFixedT optional fix namespace too
[x] move modules to i18next.modules stop exposing them on root object -> copy them on cloning
[x] loading translation failed...only do warning not error
[x] node language detector


release:
[x] get size down...eg. plurals remove lng names combine formats to new arrays [de, en,...]
    replace extend and default
    { ...{moo: 2, bar: 4 }, ...defaults } // extend
    , { ...defaults, ...{moo: 2, bar: 4 } } // defaults

    done: utils, pluralRules


later:
[ ] enable https://www.npmjs.com/package/greenkeeper, https://david-dm.org/
[x] jquery integration
[ ] test creation of instance more
[ ] cdnjs (https://github.com/cdnjs/cdnjs/tree/master/ajax/libs/i18next)
[ ] jsDelivr (https://github.com/jsdelivr/jsdelivr/blob/master/files/i18next/update.json)
[ ] travis.ci
[ ] more test out of compat
[ ] forced reset and reload of store
[ ] indefinit plurals ---> solution parse the value like:
    key_indefinit: "[1] a value; [2-4] a few values; [>4] a lot of values;"
    split char options, condition regex

onDemand:
[ ] introduce meta information on load -> loadedOn, res.statusCode



# running test coverage

1) assert browserify-istanbul and karma-coverage in node_modules have istanbul removed from dependencies
2) assert we use gotwarlost/istanbul#source-map for now until https://github.com/karma-runner/karma-coverage/issues/157 gets solved
3) run gulp test (gulp tdd will not run coverage report)
