import { describe, it, expectTypeOf } from 'vitest';
import { TFunction, WithT, CustomTypeOptions } from 'i18next';

describe('WithT', () => {
  const resources = {} as CustomTypeOptions['resources'];

  const mockWithTAndResources: WithT<'custom'> = {
    t: ((key) => {
      const keyValue = resources.custom.bar;
      return keyValue;
    }) as TFunction<'custom'>,
  };
});
