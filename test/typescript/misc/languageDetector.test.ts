import { createInstance, LanguageDetectorAsyncModule, LanguageDetectorModule } from 'i18next';

let i18n = createInstance();
i18n
  .use<LanguageDetectorModule>({
    type: 'languageDetector',
    detect: () => 'en',
  })
  .init({ showSupportNotice: false });

i18n = createInstance();
i18n
  .use<LanguageDetectorAsyncModule>({
    type: 'languageDetector',
    async: true,
    detect: (clb) => clb('en'),
  })
  .init({ showSupportNotice: false });

i18n = createInstance();
i18n
  .use<LanguageDetectorAsyncModule>({
    type: 'languageDetector',
    async: true,
    detect: async () => 'en',
  })
  .init({ showSupportNotice: false });

i18n = createInstance();
i18n
  .use({
    type: 'languageDetector',
    async: true,
    detect: (clb: (lng: string) => void) => clb('en'),
  })
  .init({ showSupportNotice: false });
