import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { normalizeLanguageCode } from "../src/localize/localize";

const LANGUAGES_DIR = path.resolve(__dirname, "../src/localize/languages");
const LANGUAGE_FILES = [
  "en.json",
  "de.json",
  "fr.json",
  "es.json",
  "it.json",
  "nl.json",
  "pl.json",
  "pt.json",
  "zh-Hans.json",
  "ru.json",
];

function loadJson(file: string) {
  const fullPath = path.join(LANGUAGES_DIR, file);
  const content = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(content);
}

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getKeyValues(obj: Record<string, unknown>, prefix = ""): Map<string, unknown> {
  const map = new Map<string, unknown>();
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = getKeyValues(value as Record<string, unknown>, fullKey);
      for (const [k, v] of nested) map.set(k, v);
    } else {
      map.set(fullKey, value);
    }
  }
  return map;
}

describe("localization", () => {
  const enData = loadJson("en.json");
  const enKeys = getAllKeys(enData);
  const enValues = getKeyValues(enData);

  it("all language files have the same key structure as en.json", () => {
    for (const file of LANGUAGE_FILES) {
      if (file === "en.json") continue;
      const data = loadJson(file);
      const keys = getAllKeys(data);
      const values = getKeyValues(data);

      for (const key of enKeys) {
        expect(keys).toContain(key);
        const val = values.get(key);
        expect(val).toBeDefined();
        expect(String(val).length).toBeGreaterThan(0);
      }

      for (const key of keys) {
        expect(enKeys).toContain(key);
      }
    }
  });

  it("no translation values are empty strings", () => {
    for (const file of LANGUAGE_FILES) {
      const data = loadJson(file);
      const values = getKeyValues(data);
      for (const [key, value] of values) {
        expect(String(value).trim()).not.toBe("");
      }
    }
  });

  describe("normalizeLanguageCode", () => {
    it("returns exact match for supported languages", () => {
      expect(normalizeLanguageCode("en")).toBe("en");
      expect(normalizeLanguageCode("de")).toBe("de");
      expect(normalizeLanguageCode("fr")).toBe("fr");
      expect(normalizeLanguageCode("es")).toBe("es");
      expect(normalizeLanguageCode("it")).toBe("it");
      expect(normalizeLanguageCode("nl")).toBe("nl");
      expect(normalizeLanguageCode("pl")).toBe("pl");
      expect(normalizeLanguageCode("pt")).toBe("pt");
      expect(normalizeLanguageCode("zh-Hans")).toBe("zh-Hans");
      expect(normalizeLanguageCode("ru")).toBe("ru");
    });

    it("falls back to base language for regional variants", () => {
      expect(normalizeLanguageCode("de-AT")).toBe("de");
      expect(normalizeLanguageCode("de-CH")).toBe("de");
      expect(normalizeLanguageCode("fr-CA")).toBe("fr");
      expect(normalizeLanguageCode("fr-FR")).toBe("fr");
      expect(normalizeLanguageCode("es-MX")).toBe("es");
      expect(normalizeLanguageCode("es-ES")).toBe("es");
      expect(normalizeLanguageCode("pt-BR")).toBe("pt");
      expect(normalizeLanguageCode("pt-PT")).toBe("pt");
      expect(normalizeLanguageCode("zh-CN")).toBe("zh-Hans");
      expect(normalizeLanguageCode("zh-TW")).toBe("zh-Hans");
      expect(normalizeLanguageCode("ru-RU")).toBe("ru");
    });

    it("falls back to en for unsupported languages", () => {
      expect(normalizeLanguageCode("ja")).toBe("en");
      expect(normalizeLanguageCode("ko")).toBe("en");
      expect(normalizeLanguageCode("ar")).toBe("en");
      expect(normalizeLanguageCode("unknown")).toBe("en");
      expect(normalizeLanguageCode("")).toBe("en");
    });

    it("handles case variations", () => {
      expect(normalizeLanguageCode("EN")).toBe("en");
      expect(normalizeLanguageCode("DE")).toBe("de");
      expect(normalizeLanguageCode("ZH-HANS")).toBe("zh-Hans");
    });
  });
});