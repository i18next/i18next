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
