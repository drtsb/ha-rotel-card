import { describe, expect, it, vi } from "vitest";
import { fixture, html, oneEvent } from "@open-wc/testing/pure";
import { RotelCardEditor } from "../src/rotel-card-editor";
import { RotelAmplifierCard } from "../src/rotel-amplifier-card";

const CONFIG = { type: "custom:rotel-card", entity: "media_player.rotel" };

const hass = {} as unknown as any;

async function createEditor(config: Record<string, unknown> = CONFIG) {
  const editor = new RotelCardEditor() as RotelCardEditor;
  editor.setConfig(config as never);
  editor.hass = hass;
  await fixture(html`${editor}`);
  await editor.updateComplete;
  return editor;
}

describe("rotel-card-editor", () => {
  it("is registered as rotel-card-editor", () => {
    expect(customElements.get("rotel-card-editor")).toBe(RotelCardEditor);
  });

  it("renders ha-form with media_player entity selector", async () => {
    const editor = await createEditor();
    const form = editor.shadowRoot?.querySelector("ha-form");
    expect(form).toBeDefined();
    const schema = (form as any).schema;
    expect(schema).toHaveLength(4);
    expect(schema[0]).toMatchObject({ name: "entity", selector: { entity: { domain: "media_player" } } });
    expect(schema[1]).toMatchObject({ name: "model", selector: { text: {} } });
    expect(schema[2]).toMatchObject({ name: "show_settings", selector: { boolean: {} } });
    expect(schema[3]).toMatchObject({ name: "hide_volume", selector: { boolean: {} } });
  });

  it("dispatches config-changed with merged values on value-changed", async () => {
    const editor = await createEditor();
    const promise = oneEvent(editor, "config-changed");
    editor.valueChanged({
      detail: { value: { model: "RA-1572", hide_volume: true } },
    } as CustomEvent);
    const { detail } = await promise;
    expect(detail.config).toMatchObject({
      entity: "media_player.rotel",
      model: "RA-1572",
      hide_volume: true,
    });
  });

  it("does not dispatch config-changed when config is not set", async () => {
    const editor = new RotelCardEditor() as RotelCardEditor;
    editor.hass = hass;
    const spy = vi.fn();
    editor.addEventListener("config-changed", spy);
    editor.valueChanged({ detail: { value: { model: "X" } } } as CustomEvent);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("rotel-amplifier-card getConfigElement", () => {
  it("returns a rotel-card-editor element", () => {
    const el = RotelAmplifierCard.getConfigElement();
    expect(el.tagName.toLowerCase()).toBe("rotel-card-editor");
    expect(el).toBeInstanceOf(RotelCardEditor);
  });
});
