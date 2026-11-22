import type { HomeAssistant } from "custom-card-helpers";

import en from "./languages/en.json";
import de from "./languages/de.json";
import fr from "./languages/fr.json";
import es from "./languages/es.json";
import it from "./languages/it.json";
import nl from "./languages/nl.json";
import pl from "./languages/pl.json";
import pt from "./languages/pt.json";
import zhHans from "./languages/zh-Hans.json";
import ru from "./languages/ru.json";

export type SupportedLanguage =
  | "en"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "nl"
  | "pl"
  | "pt"
  | "zh-Hans"
  | "ru";

type TranslationKeys = typeof en;
type TranslationDict = Record<SupportedLanguage, TranslationKeys>;

const languages: TranslationDict = {
  en,
  de,
  fr,
  es,
  it,
  nl,
  pl,
  pt,
  "zh-Hans": zhHans,
  ru,
};

const FALLBACK_LANG: SupportedLanguage = "en";

function normalizeLanguageCode(lang: string): SupportedLanguage {
  if (!lang) return FALLBACK_LANG;

  const exactMatch = lang as SupportedLanguage;
  if (exactMatch in languages) return exactMatch;

  const lowerLang = lang.toLowerCase();
  const lowerExactMatch = lowerLang as SupportedLanguage;
  if (lowerExactMatch in languages) return lowerExactMatch;

  const baseLang = lowerLang.split("-")[0];

  if (baseLang === "zh") {
    return "zh-Hans";
  }

  if (baseLang in languages) return baseLang as SupportedLanguage;

  return FALLBACK_LANG;
}

export function getLanguage(hass: HomeAssistant): SupportedLanguage {
  const lang = hass.locale?.language ?? hass.language ?? "en";
  return normalizeLanguageCode(lang);
}

export function localize(
  hass: HomeAssistant,
  namespace: keyof TranslationKeys,
  key: string,
  params?: Record<string, string | number>
): string {
  const lang = getLanguage(hass);
  const dict = languages[lang] ?? languages[FALLBACK_LANG];
  const ns = dict[namespace] as Record<string, string> | undefined;

  if (!ns) return key;

  let translation = ns[key];
  if (!translation) {
    const fallbackNs = languages[FALLBACK_LANG][namespace] as Record<string, string> | undefined;
    translation = fallbackNs?.[key] ?? key;
  }

  if (params) {
    translation = translation.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
  }

  return translation;
}

export function getAvailableLanguages(): SupportedLanguage[] {
  return Object.keys(languages) as SupportedLanguage[];
}

export function isLanguageSupported(lang: string): boolean {
  const normalized = normalizeLanguageCode(lang);
  return normalized !== FALLBACK_LANG || lang === FALLBACK_LANG;
}

export { normalizeLanguageCode };
export type { TranslationKeys };