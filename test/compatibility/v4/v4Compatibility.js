import { formatLanguageCode } from './lib/languageUtils.js';
import PluralResolver from './lib/PluralResolver.js';
import { getResourceBundle } from './lib/resourceStore.js';

export default {
  type: '3rdParty',

  init(instance) {
    instance.services.languageUtils.formatLanguageCode = formatLanguageCode.bind(
      instance.services.languageUtils,
    );

    instance.services.pluralResolver = new PluralResolver(
      instance.services.languageUtils,
      {
        prepend: instance.options.pluralSeparator,
        compatibilityJSON: instance.options.compatibilityJSON,
        simplifyPluralSuffix: instance.options.simplifyPluralSuffix,
      },
      instance.services.logger,
    );
    instance.translator.pluralResolver = instance.services.pluralResolver;

    instance.store.getResourceBundle = getResourceBundle.bind(instance.store);
    instance.services.resourceStore = instance.store;

    if (instance.options.parseMissingKeyHandler) {
      const orgParseMissingKeyHandler = instance.options.parseMissingKeyHandler;
      instance.options.parseMissingKeyHandler = (key, res) => orgParseMissingKeyHandler(res || key);
    }
  },
};
