import { TFunction } from 'i18next';

function expectErrorsForDifferentTFunctions(
  t1: TFunction<'ord'>,
  t2: TFunction<['ord', 'plurals']>,
  t3: TFunction<[string, string]>,
) {
  const fn: (t: TFunction<'plurals'>) => void = () => {};

  // @ts-expect-error
  fn(t1);
  fn(t2); // no error - not checked
  fn(t3); // no error - not checked
}
