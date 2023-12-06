import { FormatFunction } from 'i18next';

export const customFormatFunction: FormatFunction = (value, _, lng, options) => {
  const passedOptions = options?.formatParams?.[options.interpolationkey] || {};

  // All keys should can be read from options without any error
  const randomParameter = options?.random;
  return '';
};
