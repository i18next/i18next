import { TFunction } from 'i18next';

function expectErrorsForDifferentTFunctions(
  t1: TFunction<'ord'>,
  t2: TFunction<['ord', 'plurals']>,
  t3: TFunction<['plurals', 'ord']>,
  t4: TFunction<[string, string]>,
) {
  const fn: (t: TFunction<'plurals'>) => void = () => {};

  // @ts-expect-error
  fn(t1);
  // @ts-expect-error
  fn(t2);
  fn(t3); // no error
  // @ts-expect-error
  fn(t4);
}
