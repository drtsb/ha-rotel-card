import { afterEach, describe, expect, it, vi } from "vitest";
import { elementUpdated, fixture, fixtureCleanup, html } from "@open-wc/testing/pure";
import type { HomeAssistant } from "custom-card-helpers";
import { RotelAmplifierCard } from "../src/rotel-amplifier-card";

const ENTITY = "media_player.rotel";
const BASS_ENTITY = "number.rotel_bass";
const TREBLE_ENTITY = "number.rotel_treble";
const TONE_BYPASS_ENTITY = "switch.rotel_tone_bypass";

interface StateOptions {
  state?: string;
  volume_level?: number;
  source?: string;
  is_volume_muted?: boolean;
  fixed_volume?: boolean;
  bass?: { state: string | number; min?: number; max?: number; step?: number };
  treble?: { state: string | number; min?: number; max?: number; step?: number };
  tone_bypass?: string;
}

function createHass(options: StateOptions = {}) {
  const attributes: Record<string, unknown> = {
    volume_level: options.volume_level ?? 0.4,
    source: options.source ?? "CD",
    source_list: ["CD", "AUX", "PC-USB", "PHONO"],
    is_volume_muted: options.is_volume_muted ?? false,
    model: "RA-1572",
    friendly_name: "Rotel Amplifier",
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

async function createCard(
  config: Record<string, unknown> = {},
  options: StateOptions = {},
): Promise<{ card: RotelAmplifierCard; hass: HomeAssistant; callService: ReturnType<typeof vi.fn> }> {
  const { hass, callService } = createHass(options);
  const card = new RotelAmplifierCard() as RotelAmplifierCard;

  card.setConfig({ type: "custom:rotel-amplifier-card", entity: ENTITY, ...config });
  card.hass = hass;

  await fixture(html`${card}`);
  await elementUpdated(card);

  return { card, hass, callService };
}

afterEach(() => {
  fixtureCleanup();
  vi.restoreAllMocks();
});

describe("rotel-amplifier-card vfd-display", () => {
  it("renders source on line 1 left and volume on line 1 right", async () => {
    const { card } = await createCard({}, { source: "PC-USB", volume_level: 0.4167 });

    expect(query(card, ".vfd-source").textContent?.trim()).toBe("PC-USB");
    expect(query(card, ".vfd-volume").textContent?.trim()).toBe("VOL 40");
  });

  it("shows VOL FIX when fixed volume / pass-through is active", async () => {
    const { card } = await createCard({}, { source: "AUX", fixed_volume: true, volume_level: 0.5 });

    expect(query(card, ".vfd-volume").textContent?.trim()).toBe("VOL FIX");
  });

  it("shows MUTE when the volume is muted", async () => {
    const { card } = await createCard({}, { source: "PHONO", volume_level: 0.75, is_volume_muted: true });

    expect(query(card, ".vfd-volume").textContent?.trim()).toBe("MUTE");
  });

  it("shows TONE BYPASS centered on line 2 when tone bypass is on", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { tone_bypass: TONE_BYPASS_ENTITY } },
      { tone_bypass: "on" }
    );

    expect(queryOptional(card, ".vfd-line2 .vfd-tone")?.textContent?.trim()).toBe("TONE BYPASS");
  });

  it("shows BASS and TREB with sign on line 2", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { bass: BASS_ENTITY, treble: TREBLE_ENTITY } },
      { bass: { state: 2 }, treble: { state: -3 } }
    );

    const line2 = query(card, ".vfd-line2");
    expect(line2.textContent).toContain("BASS +2");
    expect(line2.textContent).toContain("TREB -3");
  });

  it("shows TONE BYPASS when bass and treble are zero with bypass active", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { bass: BASS_ENTITY, treble: TREBLE_ENTITY, tone_bypass: TONE_BYPASS_ENTITY } },
      { bass: { state: 0 }, treble: { state: 0 }, tone_bypass: "on" }
    );

    expect(queryOptional(card, ".vfd-line2 .vfd-tone")?.textContent?.trim()).toBe("TONE BYPASS");
  });

  it("does NOT show TONE BYPASS when bass/treble are zero but bypass is off", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { bass: BASS_ENTITY, treble: TREBLE_ENTITY, tone_bypass: TONE_BYPASS_ENTITY } },
      { bass: { state: 0 }, treble: { state: 0 }, tone_bypass: "off" }
    );

    expect(queryOptional(card, ".vfd-line2 .vfd-tone")).toBeNull();
    expect(queryOptional(card, ".vfd-line2 .vfd-bass")?.textContent?.trim()).toBe("BASS 0");
  });

  it("leaves line 2 empty when no settings entities are configured and amplifier is off", async () => {
    const { card } = await createCard({}, { state: "off" });

    const line2 = queryOptional(card, ".vfd-line2");
    expect(line2).not.toBeNull();
    expect(line2?.textContent?.trim()).toBe("");
  });

  it("applies the off class to the VFD display in off / standby state", async () => {
    const { card } = await createCard({}, { state: "off" });

    expect(query(card, ".vfd-display").classList.contains("off")).toBe(true);
  });

  it("removes the off class when the amplifier is on", async () => {
    const { card, hass } = await createCard({}, { state: "off" });

    expect(query(card, ".vfd-display").classList.contains("off")).toBe(true);

    hass.states[ENTITY].state = "on";
    card.hass = { ...hass } as HomeAssistant;
    await card.updateComplete;

    expect(query(card, ".vfd-display").classList.contains("off")).toBe(false);
  });

  it("applies the off class to the VFD display in standby state", async () => {
    const { card } = await createCard({}, { state: "standby" });

    expect(query(card, ".vfd-display").classList.contains("off")).toBe(true);
  });

  it("leaves line 2 empty in off state even when settings entities are configured", async () => {
    const { card } = await createCard(
      { show_settings: true, settings_entities: { bass: BASS_ENTITY, treble: TREBLE_ENTITY } },
      { state: "off", bass: { state: 2 }, treble: { state: -3 } }
    );

    const line2 = query(card, ".vfd-line2");
    expect(line2.textContent?.trim()).toBe("");
  });
});
