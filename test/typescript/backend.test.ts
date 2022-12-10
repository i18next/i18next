import i18next from 'i18next';

import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend';

i18next.use(HttpBackend).init<HttpBackendOptions>({
  lng: 'en',
  // ...
  backend: {
    loadPath: 'some/path',
    customHeaders: {
      some: 'header',
    },
  },
});

i18next.use(FsBackend).init<FsBackendOptions>({
  lng: 'en',
  // ...
  backend: {
    loadPath: 'some/path',
  },
});
