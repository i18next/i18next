import i18next, { Interpolator } from 'i18next';

const interpolator: Interpolator = i18next.services.interpolator;

const initReturn: undefined = interpolator.init({}, false);

const resetReturn: undefined = interpolator.reset();

const resetRegExpReturn: undefined = interpolator.resetRegExp();

const nestReturn: string = interpolator.nest('', () => undefined, {});

const interpolateReturn: string = interpolator.interpolate('', {}, '', {});
