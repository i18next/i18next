import { TFunction } from 'i18next';

function i18nextContextUsage(t: TFunction) {
  t('dessert', { context: 'cake' }).trim();

  // context + plural
  t('dessert', { context: 'muffin', count: 3 }).trim();

  // Without & with context
  t('beverage').trim();
  t('beverage', { context: 'beer' }).trim();
}
