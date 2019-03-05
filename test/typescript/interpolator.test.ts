import i18next from 'i18next';

const interpolator: i18next.Interpolator = i18next.services.interpolator;

const initReturn: undefined = interpolator.init({}, false);

const resetReturn: undefined = interpolator.reset();

const resetRegExpReturn: undefined = interpolator.resetRegExp();

const nestReturn: string = interpolator.nest('', () => undefined, {});

const interpolateReturn: string = interpolator.interpolate('', {}, '', {});
