import { describe, it } from 'vitest';
import type { TFunction } from 'i18next';

// Not part of the strict run: strictKeyChecks rejects unknown keys on purpose.
describe("parseInterpolation: 'icu' with a default value", () => {
  const t: TFunction<'custom'> = (() => '') as never;

  it('still accepts any string key with a default value', () => {
    t('not.yet.translated', 'Hello {name}', { name: 'Ada' });
    t('not.yet.translated', { defaultValue: 'Hello {name}', name: 'Ada' });
  });
});
