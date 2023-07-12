import { TFunction } from 'i18next';

function expectErrorsForDifferentTFunctions(
  t1: TFunction<'ord'>,
  t2: TFunction<['ord', 'plurals']>,
  t3: TFunction<['plurals', 'ord']>,
  t4: TFunction<[string, string]>,
) {
  const fn: (t: TFunction<'plurals'>) => void = () => {};
  const fn2: (t: TFunction) => void = () => {};

  // no error - not checked when CustomTypeOptions["resources"] is not provided
  fn(t1);
  fn(t2);
  fn(t3);
  fn(t4);
  fn2(t1);
  fn2(t2);
  fn2(t3);
  fn2(t4);
}
