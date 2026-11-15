import { afterEach, describe, expect, it, vi } from "vitest";
import { elementUpdated, fixture, fixtureCleanup, html } from "@open-wc/testing/pure";
import type { HomeAssistant } from "custom-card-helpers";
import { RotelAmplifierCard } from "../src/rotel-amplifier-card";

const ENTITY = "media_player.rotel";
const BASS_ENTITY = "number.rotel_bass";
const TREBLE_ENTITY = "number.rotel_treble";
const BALANCE_ENTITY = "number.rotel_balance";
const SPEAKERS_A_ENTITY = "switch.rotel_speakers_a";
const SPEAKERS_B_ENTITY = "switch.rotel_speakers_b";
const DIMMER_ENTITY = "select.rotel_display_dimmer";
const TONE_BYPASS_ENTITY = "switch.rotel_tone_bypass";

interface StateOptions {
  state?: string;
  volume_level?: number;
  source?: string;
  source_list?: string[];
  is_volume_muted?: boolean;
  model?: string;
  device_model?: string;
  friendly_name?: string;
  fixed_volume?: boolean;
  bass?: { state: string | number; min?: number; max?: number; step?: number };
  treble?: { state: string | number; min?: number; max?: number; step?: number };
  balance?: { state: string | number; min?: number; max?: number; step?: number };
  speakers_a?: string;
  speakers_b?: string;
  dimmer?: { state: string; options?: string[] };
  tone_bypass?: string;
}

function createHass(options: StateOptions = {}) {
  const attributes: Record<string, unknown> = {
    volume_level: options.volume_level ?? 0.35,
    source: options.source ?? "CD",
    source_list: options.source_list ?? ["CD", "AUX", "TUNER", "PHONO"],
    is_volume_muted: options.is_volume_muted ?? false,
    model: options.model ?? "RA-1572",
    friendly_name: options.friendly_name ?? "Rotel Amplifier",
    ...(options.fixed_volume ? { fixed_volume: true } : {}),
  };

  const callService = vi.fn().mockResolvedValue(undefined);

  const states: Record<string, unknown> = {
    [ENTITY]: {
      entity_id: ENTITY,
      state: options.state ?? "on",
      attributes,
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    },
  };

  if (options.bass) {
    states[BASS_ENTITY] = {
      entity_id: BASS_ENTITY,
      state: String(options.bass.state),
      attributes: { min: options.bass.min ?? -10, max: options.bass.max ?? 10, step: options.bass.step ?? 1 },
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    };
  }
  if (options.treble) {
    states[TREBLE_ENTITY] = {
      entity_id: TREBLE_ENTITY,
      state: String(options.treble.state),
      attributes: { min: options.treble.min ?? -10, max: options.treble.max ?? 10, step: options.treble.step ?? 1 },
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    };
  }
  if (options.balance) {
    states[BALANCE_ENTITY] = {
      entity_id: BALANCE_ENTITY,
      state: String(options.balance.state),
      attributes: { min: options.balance.min ?? -10, max: options.balance.max ?? 10, step: options.balance.step ?? 1 },
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    };
  }
  if (options.speakers_a) {
    states[SPEAKERS_A_ENTITY] = {
      entity_id: SPEAKERS_A_ENTITY,
      state: options.speakers_a,
      attributes: {},
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    };
  }
  if (options.speakers_b) {
    states[SPEAKERS_B_ENTITY] = {
      entity_id: SPEAKERS_B_ENTITY,
      state: options.speakers_b,
      attributes: {},
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    };
  }
  if (options.dimmer) {
    states[DIMMER_ENTITY] = {
      entity_id: DIMMER_ENTITY,
      state: options.dimmer.state,
      attributes: { options: options.dimmer.options ?? ["Low", "Medium", "High"] },
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    };
  }
  if (options.tone_bypass) {
    states[TONE_BYPASS_ENTITY] = {
      entity_id: TONE_BYPASS_ENTITY,
      state: options.tone_bypass,
      attributes: {},
      last_changed: "2024-01-01T00:00:00+00:00",
      last_updated: "2024-01-01T00:00:00+00:00",
      context: { id: "test", parent_id: null, user_id: null },
    };
  }

  const hass = {
    states,
    callService,
  } as unknown as HomeAssistant;

  return { hass, callService };
}

function shadow(card: RotelAmplifierCard): ParentNode {
  return card.shadowRoot as unknown as ParentNode;
}

function query<T extends Element = Element>(card: RotelAmplifierCard, selector: string): T {
  const el = shadow(card).querySelector<T>(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

function queryOptional<T extends Element = Element>(card: RotelAmplifierCard, selector: string): T | null {
  return shadow(card).querySelector<T>(selector);
}

function queryAll<T extends Element = Element>(card: RotelAmplifierCard, selector: string): NodeListOf<T> {
  const els = shadow(card).querySelectorAll<T>(selector);
  if (!els.length) throw new Error(`Elements not found: ${selector}`);
  return els;
}

async function createCard(
  config: Record<string, unknown> = {},
  options: StateOptions = {},
): Promise<{ card: RotelAmplifierCard; hass: HomeAssistant; callService: ReturnType<typeof vi.fn> }> {
  const { hass, callService } = createHass(options);
  const card = new RotelAmplifierCard() as RotelAmplifierCard;

  card.setConfig({ type: "custom:rotel-amplifier-card", entity: ENTITY, ...config });
  card.hass = hass;

  // Mount via @open-wc fixture (handles cleanup + Lit update cycle).
  await fixture(html`${card}`);
  await elementUpdated(card);

  return { card, hass, callService };
}

afterEach(() => {
  fixtureCleanup();
  vi.restoreAllMocks();
});

describe("rotel-amplifier-card", () => {
  it("mounts into the DOM and renders the Rotel brand plus the configured model", async () => {
    const { card } = await createCard({ model: "RC-1590 MKII" });

    expect(card.tagName.toLowerCase()).toBe("rotel-amplifier-card");
    expect(document.body.contains(card)).toBe(true);

    const brand = query(card, ".brand");
    expect(brand.textContent?.trim()).toBe("ROTEL");

    const model = query(card, ".model");
    expect(model.textContent?.trim()).toBe("RC-1590 MKII");
  });

  it("falls back to the device model reported by the entity", async () => {
    const { card } = await createCard({}, { device_model: "RA-1572" });

    expect(query(card, ".model").textContent?.trim()).toBe("RA-1572");
  });

  it("disables the volume slider and volume buttons in fixed volume / pass-through mode", async () => {
    const { card } = await createCard({}, { fixed_volume: true });

    const slider = query<HTMLInputElement>(card, 'input[type="range"]');
    expect(slider).toBeDefined();
    expect(slider.disabled).toBe(true);

    const volumeButtons = queryAll(card, "ha-icon-button.vol");
    expect(volumeButtons.length).toBe(3);
    volumeButtons.forEach((btn) => {
      expect(btn.hasAttribute("disabled")).toBe(true);
    });
  });

  it("enables the volume controls when fixed volume is not active", async () => {
    const { card } = await createCard();

    expect(query<HTMLInputElement>(card, 'input[type="range"]').disabled).toBe(false);
    queryAll(card, "ha-icon-button.vol").forEach((btn) => {
      expect(btn.hasAttribute("disabled")).toBe(false);
    });
  });

  it("does not send volume commands while fixed volume is active", async () => {
    const { card, callService } = await createCard({}, { fixed_volume: true });

    const slider = query<HTMLInputElement>(card, 'input[type="range"]');
    slider.value = "0.5";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    await card.updateComplete;

    expect(callService).not.toHaveBeenCalled();
  });

  it("calls select_source for the pressed source button", async () => {
    vi.useFakeTimers();
    const { card, callService } = await createCard({ source: "CD" });

    const cdButton = Array.from(queryAll<HTMLButtonElement>(card, ".rotel-btn")).find(
      (btn) => btn.closest(".source-item")?.querySelector(".source-label")?.textContent?.trim() === "CD",
    );
    expect(cdButton).toBeDefined();

    cdButton!.click();
    // Advance timers past the 300ms debounce
    await vi.advanceTimersByTimeAsync(300);
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith("media_player", "select_source", {
      entity_id: ENTITY,
      source: "CD",
    });
    vi.useRealTimers();
  });

  it("marks the active source button", async () => {
    const { card } = await createCard({}, { source: "AUX" });

    const active = query(card, ".source-item.active .rotel-btn");
    expect(active.closest(".source-item")?.querySelector(".source-label")?.textContent?.trim()).toBe("AUX");
  });

  it("sends toggle when the power button is pressed while off", async () => {
    const { card, callService } = await createCard({ state: "off" });

    query<HTMLElement>(card, "ha-icon-button.power").click();

    expect(callService).toHaveBeenCalledWith("media_player", "toggle", { entity_id: ENTITY });
  });

  it("turns the power icon red (off state) when the entity state becomes off", async () => {
    const { card, hass } = await createCard({ state: "on" });

    const power = query<HTMLElement>(card, "ha-icon-button.power");
    expect(power.classList.contains("on")).toBe(true);
    expect(power.classList.contains("off")).toBe(false);

    hass.states[ENTITY].state = "off";
    card.hass = { ...hass } as HomeAssistant;
    await card.updateComplete;

    const offPower = query<HTMLElement>(card, "ha-icon-button.power");
    expect(offPower.classList.contains("off")).toBe(true);
    expect(offPower.classList.contains("on")).toBe(false);
    expect(offPower.classList.contains("power")).toBe(true);

    const styles = RotelAmplifierCard.styles as unknown as { cssText: string };
    const cssText = styles.cssText ?? "";
    expect(cssText).toMatch(/ha-icon-button\.power\.off ha-icon\s*\{\s*color:\s*var\(--error-color,\s*red\)/);
    expect(cssText).toMatch(/input\[type=range\]\[disabled\]/);
  });

  it("applies theme_variables as inline styles on the root ha-card", async () => {
    const { card } = await createCard({
      theme_variables: { "--rotel-bg": "#111111", "--rotel-text": "#ffffff", "--rotel-button-color": "#444444" },
    });

    const haCard = query<HTMLElement>(card, "ha-card");
    expect(haCard.style.getPropertyValue("--rotel-bg")).toBe("#111111");
    expect(haCard.style.getPropertyValue("--rotel-text")).toBe("#ffffff");
    expect(haCard.style.getPropertyValue("--rotel-button-color")).toBe("#444444");
  });

  it("re-applies theme_variables when applyThemeVariables is called explicitly", async () => {
    const { card } = await createCard({ theme_variables: { "--rotel-text": "#aaaaaa" } });

    const haCard = query<HTMLElement>(card, "ha-card");
    expect(haCard.style.getPropertyValue("--rotel-text")).toBe("#aaaaaa");

    card.setConfig({ type: "custom:rotel-amplifier-card", entity: ENTITY, theme_variables: { "--rotel-text": "#00ff00" } });
    card.applyThemeVariables();
    expect(haCard.style.getPropertyValue("--rotel-text")).toBe("#00ff00");
  });

  it("leaves the ha-card inline style empty when theme_variables is not configured", async () => {
    const { card } = await createCard();

    const haCard = query<HTMLElement>(card, "ha-card");
    expect(haCard.style.length).toBe(0);
  });

  it("does not render settings panel when show_settings is false", async () => {
    const { card } = await createCard(
      { show_settings: false, settings_entities: { bass: BASS_ENTITY } },
      { bass: { state: 0 } }
    );

    expect(queryOptional(card, ".settings-panel")).toBeNull();
  });

  it("renders settings panel when show_settings is true and entities are configured", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { bass: BASS_ENTITY, treble: TREBLE_ENTITY } },
      { bass: { state: 2 }, treble: { state: -3 } }
    );

    const panel = query(card, ".settings-panel");
    expect(panel).toBeDefined();
    expect(panel.textContent).toContain("SETTINGS");
    expect(panel.textContent).toContain("BASS");
    expect(panel.textContent).toContain("TREBLE");
  });

  it("renders ha-slider for number entities with correct min/max/value", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { bass: BASS_ENTITY } },
      { bass: { state: 5, min: -10, max: 10, step: 1 } }
    );

    const slider = query(card, "ha-slider") as HTMLInputElement;
    expect(slider).toBeDefined();
    // ha-slider in test environment may not expose min/max/value as properties
    // but we can check the element is rendered with the right attributes
    expect(slider.getAttribute("min")).toBe("-10");
    expect(slider.getAttribute("max")).toBe("10");
    expect(slider.getAttribute("step")).toBe("1");
  });

  it("renders ha-switch for switch entities", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { speakers_a: SPEAKERS_A_ENTITY } },
      { speakers_a: "on" }
    );

    const switchEl = query(card, "ha-switch") as HTMLInputElement;
    expect(switchEl).toBeDefined();
    expect(switchEl.checked).toBe(true);
  });

  it("renders ha-select for select entities with options", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { dimmer: DIMMER_ENTITY } },
      { dimmer: { state: "Medium", options: ["Low", "Medium", "High"] } }
    );

    const select = query(card, "ha-select") as HTMLSelectElement;
    expect(select).toBeDefined();
    expect(select.value).toBe("Medium");
  });

  it("calls number.set_value when ha-slider changes", async () => {
    vi.useFakeTimers();
    const { card, callService } = await createCard(
      { show_settings: true, settings_entities: { bass: BASS_ENTITY } },
      { bass: { state: 0 } }
    );

    const slider = query(card, "ha-slider") as HTMLInputElement;
    slider.value = "3";
    slider.dispatchEvent(new Event("change", { bubbles: true }));
    await card.updateComplete;

    // Advance timers past the 300ms debounce
    await vi.advanceTimersByTimeAsync(300);

    expect(callService).toHaveBeenCalledWith("number", "set_value", {
      entity_id: BASS_ENTITY,
      value: 3,
    });
    vi.useRealTimers();
  });

  it("calls switch.turn_on/turn_off when ha-switch changes", async () => {
    const { card, callService } = await createCard(
      { show_settings: true, settings_entities: { speakers_a: SPEAKERS_A_ENTITY } },
      { speakers_a: "off" }
    );

    const switchEl = query(card, "ha-switch") as HTMLInputElement;
    switchEl.checked = true;
    switchEl.dispatchEvent(new Event("change", { bubbles: true }));
    await card.updateComplete;

    expect(callService).toHaveBeenCalledWith("switch", "turn_on", {
      entity_id: SPEAKERS_A_ENTITY,
    });

    callService.mockClear();

    switchEl.checked = false;
    switchEl.dispatchEvent(new Event("change", { bubbles: true }));
    await card.updateComplete;

    expect(callService).toHaveBeenCalledWith("switch", "turn_off", {
      entity_id: SPEAKERS_A_ENTITY,
    });
  });

  it("calls select.select_option when ha-select changes", async () => {
    const { card, callService } = await createCard(
      { show_settings: true, settings_entities: { dimmer: DIMMER_ENTITY } },
      { dimmer: { state: "Low", options: ["Low", "Medium", "High"] } }
    );

    const select = query(card, "ha-select") as HTMLSelectElement;
    select.value = "High";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await card.updateComplete;

    expect(callService).toHaveBeenCalledWith("select", "select_option", {
      entity_id: DIMMER_ENTITY,
      option: "High",
    });
  });
});