import { describe, it } from 'vitest';
import { createInstance, LanguageDetectorAsyncModule, LanguageDetectorModule } from 'i18next';

describe('languageDetector', () => {
  it('works with a sync detector', () => {
    createInstance()
      .use<LanguageDetectorModule>({
        type: 'languageDetector',
        detect: () => 'en',
      })
      .init();
  });

  it('works with an async callback detector', () => {
    createInstance()
      .use<LanguageDetectorAsyncModule>({
        type: 'languageDetector',
        async: true,
        detect: (clb) => clb('en'),
      })
      .init();
  });

  it('works with an async promise detector', () => {
    createInstance()
      .use<LanguageDetectorAsyncModule>({
        type: 'languageDetector',
        async: true,
        detect: async () => 'en',
      })
      .init();
  });

  it('works with an untyped async detector', () => {
    createInstance()
      .use({
        type: 'languageDetector',
        async: true,
        detect: (clb: (lng: string) => void) => clb('en'),
      })
      .init();
  });
});
