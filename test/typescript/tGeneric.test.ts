import i18next, { TOptions, WithT } from 'i18next';

interface InterpolationValues {
  myVar: string;
}
type Keys = 'friend' | 'tree';

// check keys
i18next.t<string, Keys>('friend', { myVar: 'someValue' });
i18next.t<string, Keys>(['friend', 'tree'], { myVar: 'someValue' });

// check interpolation values
i18next.t<string, Keys, InterpolationValues>('friend', { myVar: 'someValue' });
i18next.t<string, Keys, InterpolationValues>(['friend', 'tree'], { myVar: 'someValue' });

// NOTION: disable no-unnecessary-generics for generic pattern test.
/* tslint:disable:no-unnecessary-generics */
interface ExWithT extends WithT {
  t<CustomKeys extends Keys = Keys, Val extends object = object, R = string>(
    keys: CustomKeys | CustomKeys[],
    options?: TOptions<Val>,
  ): R;
  t<CustomKeys extends OtherKeyList = OtherKeyList, Val extends object = object, R = string>(
    keys: CustomKeys | CustomKeys[],
    options?: TOptions<Val>,
  ): R;
  t<CustomKeys extends string = Keys, R = string>(keys: CustomKeys | CustomKeys[]): R;
}

type OtherKeyList = 'private' | 'public';

(i18next as ExWithT).t('friend');
(i18next as ExWithT).t('tree');
(i18next as ExWithT).t('private');
(i18next as ExWithT).t('public');
(i18next as ExWithT).t('friend', {});
(i18next as ExWithT).t('private', {});
(i18next as ExWithT).t<Keys, { myVar: 'someValue' }>('friend', { myVar: 'someValue' });
(i18next as ExWithT).t<OtherKeyList, { myVar: 'someValue' }>('private', { myVar: 'someValue' });
const result = (i18next as ExWithT).t<Keys, { myVar: 'someValue' }, { result: 'result' }>(
  'friend',
  { myVar: 'someValue' },
);
type Check<T extends { result: 'result' }> = T;
type ExWithTResult = Check<typeof result>;
