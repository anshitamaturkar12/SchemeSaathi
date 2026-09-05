import { en, TranslationKey } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";

export type LanguageCode = "en" | "hi" | "mr";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिंदी" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
];

export const dictionaries: Record<LanguageCode, Record<TranslationKey, string>> = {
  en,
  hi,
  mr,
};

export function getTranslation(lang: LanguageCode, key: TranslationKey): string {
  const dict = dictionaries[lang] || dictionaries.en;
  return dict[key] || dictionaries.en[key] || key;
}

export * from "./en";
