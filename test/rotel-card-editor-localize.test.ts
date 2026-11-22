import { describe, expect, it, vi } from "vitest";
import { fixture, fixtureCleanup, html } from "@open-wc/testing/pure";
import { RotelCardEditor } from "../src/rotel-card-editor";
import { localize } from "../src/localize/localize";
import type { HomeAssistant } from "custom-card-helpers";

function createMockHass(language = "en"): HomeAssistant {
  return {
    locale: { language },
    language,
    states: {},
    callService: vi.fn(),
  } as unknown as HomeAssistant;
}

async function createEditor(config = {}, hass: HomeAssistant = createMockHass()) {
  const editor = new RotelCardEditor();
  editor.setConfig({ type: "custom:rotel-amplifier-card", entity: "media_player.rotel", ...config });
  editor.hass = hass;
  await fixture(html`${editor}`);
  return editor;
}

describe("rotel-card-editor localization", () => {
  afterEach(() => {
    fixtureCleanup();
    vi.restoreAllMocks();
  });

  it("computeLabel returns localized labels for main fields in Russian", async () => {
    const hass = createMockHass("ru");
    const editor = await createEditor({}, hass);

    expect(editor.computeLabel({ name: "entity" })).toBe("Сущность");
    expect(editor.computeLabel({ name: "model" })).toBe("Модель");
    expect(editor.computeLabel({ name: "theme" })).toBe("Тема");
    expect(editor.computeLabel({ name: "show_settings" })).toBe("Показать панель настроек");
    expect(editor.computeLabel({ name: "hide_volume" })).toBe("Скрыть управление громкостью");
  });

  it("computeLabel returns localized labels for settings entity fields in Russian", async () => {
    const hass = createMockHass("ru");
    const editor = await createEditor({ show_settings: true }, hass);

    expect(editor.computeLabel({ name: "settings_entities.bass" })).toBe("Сущность басса");
    expect(editor.computeLabel({ name: "settings_entities.treble" })).toBe("Сущность высоких");
    expect(editor.computeLabel({ name: "settings_entities.balance" })).toBe("Сущность баланса");
    expect(editor.computeLabel({ name: "settings_entities.speakers_a" })).toBe("Сущность динамиков A");
    expect(editor.computeLabel({ name: "settings_entities.speakers_b" })).toBe("Сущность динамиков B");
    expect(editor.computeLabel({ name: "settings_entities.dimmer" })).toBe("Сущность диммера");
    expect(editor.computeLabel({ name: "settings_entities.tone_bypass" })).toBe("Сущность обхода тона");
  });

  it("computeLabel returns localized labels for main fields in German", async () => {
    const hass = createMockHass("de");
    const editor = await createEditor({}, hass);

    expect(editor.computeLabel({ name: "entity" })).toBe("Entität");
    expect(editor.computeLabel({ name: "model" })).toBe("Modell");
    expect(editor.computeLabel({ name: "theme" })).toBe("Design");
    expect(editor.computeLabel({ name: "show_settings" })).toBe("Einstellungsbereich anzeigen");
    expect(editor.computeLabel({ name: "hide_volume" })).toBe("Lautstärkeregelung ausblenden");
  });

  it("computeLabel falls back to English for unknown language", async () => {
    const hass = createMockHass("ja");
    const editor = await createEditor({}, hass);

    expect(editor.computeLabel({ name: "entity" })).toBe("Entity");
    expect(editor.computeLabel({ name: "model" })).toBe("Model");
  });

  it("theme selector options are localized in Russian via localize function", async () => {
    const hass = createMockHass("ru");
    const editor = await createEditor({ show_settings: true }, hass);

    expect(localize(hass, "editor", "theme_silver")).toBe("Серебро");
    expect(localize(hass, "editor", "theme_black")).toBe("Чёрный");
    expect(localize(hass, "editor", "theme_champagne")).toBe("Шампань");
    expect(localize(hass, "editor", "theme_minimal")).toBe("Минимальный");
  });

  it("theme selector options are localized in English via localize function", async () => {
    const hass = createMockHass("en");
    const editor = await createEditor({ show_settings: true }, hass);

    expect(localize(hass, "editor", "theme_silver")).toBe("Silver");
    expect(localize(hass, "editor", "theme_black")).toBe("Black");
    expect(localize(hass, "editor", "theme_champagne")).toBe("Champagne");
    expect(localize(hass, "editor", "theme_minimal")).toBe("Minimal");
  });

  it("computeHelper returns undefined for fields without helpers", async () => {
    const hass = createMockHass("ru");
    const editor = await createEditor({}, hass);

    expect(editor.computeHelper({ name: "entity" })).toBeUndefined();
    expect(editor.computeHelper({ name: "model" })).toBeUndefined();
  });
});