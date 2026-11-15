import { afterEach, describe, expect, it, vi } from "vitest";
import { elementUpdated, fixture, fixtureCleanup, html } from "@open-wc/testing/pure";
import type { HomeAssistant } from "custom-card-helpers";
import { RotelAmplifierCard } from "../src/rotel-amplifier-card";

const ENTITY = "media_player.rotel";

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

  const hass = {
    states: {
      [ENTITY]: {
        entity_id: ENTITY,
        state: options.state ?? "on",
        attributes,
        last_changed: "2024-01-01T00:00:00+00:00",
        last_updated: "2024-01-01T00:00:00+00:00",
        context: { id: "test", parent_id: null, user_id: null },
      },
    },
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
    const { card, callService } = await createCard({ source: "CD" });

    const cdButton = Array.from(queryAll<HTMLButtonElement>(card, ".srcs button")).find(
      (btn) => btn.textContent?.trim() === "CD",
    );
    expect(cdButton).toBeDefined();

    cdButton!.click();
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith("media_player", "select_source", {
      entity_id: ENTITY,
      source: "CD",
    });
  });

  it("marks the active source button", async () => {
    const { card } = await createCard({}, { source: "AUX" });

    const active = query(card, ".srcs button.active");
    expect(active.textContent?.trim()).toBe("AUX");
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
});