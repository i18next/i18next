import i18next from 'i18next';

interface CustomOptions {
  myVar: string;
}
type KeyList = 'friend' | 'tree';

i18next.t<string, KeyList>('friend', { myVar: 'someValue' });
i18next.t<string, KeyList>(['friend', 'tree'], { myVar: 'someValue' });
i18next.t<string, KeyList, { myVar: 'someValue' }>('friend', { myVar: 'someValue' });
i18next.t<string, KeyList, { myVar: 'someValue' }>(['friend', 'tree'], { myVar: 'someValue' });

// NOTION: disable no-unnecessary-generics for generic pattern test.
/* tslint:disable:no-unnecessary-generics */
interface ExWithT extends i18next.WithT {
  t<Keys extends KeyList = KeyList, Val extends object = object, R = string>(
    keys: Keys | Keys[],
    options?: i18next.TOptions<Val>,
  ): R;
  t<Keys extends OtherKeyList = OtherKeyList, Val extends object = object, R = string>(
    keys: Keys | Keys[],
    options?: i18next.TOptions<Val>,
  ): R;
  t<Keys extends string = KeyList, R = string>(keys: Keys | Keys[]): R;
}

type OtherKeyList = 'private' | 'public';

(i18next as ExWithT).t('friend');
(i18next as ExWithT).t('tree');
(i18next as ExWithT).t('private');
(i18next as ExWithT).t('public');
(i18next as ExWithT).t('friend', {});
(i18next as ExWithT).t('private', {});
(i18next as ExWithT).t<KeyList, { myVar: 'someValue' }>('friend', { myVar: 'someValue' });
(i18next as ExWithT).t<OtherKeyList, { myVar: 'someValue' }>('private', { myVar: 'someValue' });
const result = (i18next as ExWithT).t<KeyList, { myVar: 'someValue' }, { result: 'result' }>(
  'friend',
  { myVar: 'someValue' },
);
type Check<T extends { result: 'result' }> = T;
type ExWithTResult = Check<typeof result>;
