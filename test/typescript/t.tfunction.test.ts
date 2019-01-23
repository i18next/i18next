import i18next from 'i18next';

/**
 * Use of the exported TFunction in external utility methods such as
 *  NamespaceConsumer children t
 */
function resolveText(t: i18next.TFunction, keyOrText?: string): undefined | string {
  if (keyOrText && keyOrText.startsWith(':')) {
    return t(keyOrText.substring(1, keyOrText.length));
  } else {
    return keyOrText;
  }
}

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
