import i18next from 'i18next';

/**
 * Use of the exported TFunction in external utility methods such as
 *  NamespaceConsumer children t
 */
function childrenNamespacesConsumer(t: i18next.TFunction, i18n: i18next.i18n) {
  // sanity first - tests from i18next t.test
  const is: string = i18n.t('friend'); // same as <string>
  const io: object = i18n.t<object>('friend');
  const isa: string[] = i18n.t<string[]>('friend');
  const ioa: object[] = i18n.t<object[]>('friend');

  // (failing) now try t provided by NamespacesConsumer
  const s: string = t('friend'); // same as <string>
  const o: object = t<object>('friend');
  const sa: string[] = t<string[]>('friend');
  const oa: object[] = t<object[]>('friend');
}

function callsMethodWithOptionalArg(t: i18next.TFunction, i18n: i18next.i18n) {
  function displayHint(hint?: string) {
    return String(hint);
  }
  displayHint(i18n.t('friend'));
  displayHint(t('friend'));
}

function callsMethodWithRequiredArg(t: i18next.TFunction, i18n: i18next.i18n) {
  function displayHint(hint: string) {
    return String(hint);
  }
  displayHint(i18n.t('friend'));
  displayHint(t('friend'));
}
