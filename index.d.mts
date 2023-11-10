import * as i18next from './index.js';

import type { DefaultNamespace, Namespace } from './typescript/options.js';

export type WithT<Ns extends Namespace = DefaultNamespace> = i18next.WithT<Ns>;
export type Interpolator = i18next.Interpolator;
export type ResourceStore = i18next.ResourceStore;
export type Formatter = i18next.Formatter;
export type Services = i18next.Services;
export type ModuleType = i18next.ModuleType;
export type Module = i18next.Module;
export type CallbackError = i18next.CallbackError;
export type ReadCallback = i18next.ReadCallback;
export type MultiReadCallback = i18next.MultiReadCallback;
export type BackendModule = i18next.BackendModule;
export type LanguageDetectorModule = i18next.LanguageDetectorModule;
export type LanguageDetectorAsyncModule = i18next.LanguageDetectorAsyncModule;
export type PostProcessorModule = i18next.PostProcessorModule;
export type LoggerModule = i18next.LoggerModule;
export type I18nFormatModule = i18next.I18nFormatModule;
export type FormatterModule = i18next.FormatterModule;
export type ThirdPartyModule = i18next.ThirdPartyModule;
export type Modules = i18next.Modules;
export type Newable<T> = i18next.Newable<T>;
export type NewableModule<T extends Module> = i18next.NewableModule<T>;
export type Callback = i18next.Callback;
export type ExistsFunction = i18next.ExistsFunction;
export type CloneOptions = i18next.CloneOptions;
export type i18n = i18next.i18n;

export type * from './typescript/options.js';
export type * from './typescript/t.js';

export default i18next.default;

export const createInstance: i18n['createInstance'];

export const dir: i18n['dir'];
export const init: i18n['init'];
export const loadResources: i18n['loadResources'];
export const reloadResources: i18n['reloadResources'];
export const use: i18n['use'];
export const changeLanguage: i18n['changeLanguage'];
export const getFixedT: i18n['getFixedT'];
export const t: i18n['t'];
export const exists: i18n['exists'];
export const setDefaultNamespace: i18n['setDefaultNamespace'];
export const hasLoadedNamespace: i18n['hasLoadedNamespace'];
export const loadNamespaces: i18n['loadNamespaces'];
export const loadLanguages: i18n['loadLanguages'];
