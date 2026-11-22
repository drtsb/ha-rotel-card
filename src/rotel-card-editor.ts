import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "custom-card-helpers";
import { localize } from "./localize/localize";

type ThemePreset = "silver" | "black" | "champagne" | "minimal";

interface RotelCardConfig {
  type: string;
  entity: string;
  model?: string;
  show_settings?: boolean;
  hide_volume?: boolean;
  theme?: ThemePreset;
  settings_entities?: {
    bass?: string;
    treble?: string;
    balance?: string;
    speakers_a?: string;
    speakers_b?: string;
    dimmer?: string;
    tone_bypass?: string;
  };
}

interface FormSchema {
  name: string;
  label?: string;
  selector:
    | { entity: { domain: string } }
    | { text: {} }
    | { boolean: {} }
    | { select: { options: string[]; mode: string; translation_key?: string } };
}

@customElement("rotel-card-editor")
export class RotelCardEditor extends LitElement {
  @property({ attribute: false }) public hass: any;
  @state() private _config?: RotelCardConfig;

  public setConfig(config: RotelCardConfig): void {
    this._config = config;
  }

  public valueChanged(ev: CustomEvent): void {
    if (!this._config) return;
    const value = (ev.detail as { value?: Record<string, unknown> } | undefined)?.value;
    if (!value) return;
    const newConfig = { ...this._config, ...value };
    fireEvent(this, "config-changed", { config: newConfig });
  }

  protected render() {
    if (!this._config || !this.hass) return html``;

    const showSettings = this._config.show_settings === true;
    const t = (ns: "editor", key: string) => localize(this.hass, ns, key);

    const schema: FormSchema[] = [
      { name: "entity", label: t("editor", "entity"), selector: { entity: { domain: "media_player" } } },
      { name: "model", label: t("editor", "model"), selector: { text: {} } },
      {
        name: "theme",
        label: t("editor", "theme"),
        selector: {
          select: {
            options: ["silver", "black", "champagne", "minimal"],
            mode: "dropdown",
            translation_key: "theme",
          },
        },
      },
      { name: "show_settings", label: t("editor", "show_settings"), selector: { boolean: {} } },
      { name: "hide_volume", label: t("editor", "hide_volume"), selector: { boolean: {} } },
    ];

    if (showSettings) {
      schema.push(
        { name: "settings_entities.bass", label: t("editor", "bass_entity"), selector: { entity: { domain: "number" } } },
        { name: "settings_entities.treble", label: t("editor", "treble_entity"), selector: { entity: { domain: "number" } } },
        { name: "settings_entities.balance", label: t("editor", "balance_entity"), selector: { entity: { domain: "number" } } },
        { name: "settings_entities.speakers_a", label: t("editor", "speakers_a_entity"), selector: { entity: { domain: "switch" } } },
        { name: "settings_entities.speakers_b", label: t("editor", "speakers_b_entity"), selector: { entity: { domain: "switch" } } },
        { name: "settings_entities.dimmer", label: t("editor", "dimmer_entity"), selector: { entity: { domain: "select" } } },
        { name: "settings_entities.tone_bypass", label: t("editor", "tone_bypass_entity"), selector: { entity: { domain: "switch" } } },
      );
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }

  static get styles() {
    return css`
      ha-form {
        display: block;
        padding: 16px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "rotel-card-editor": RotelCardEditor;
  }
}

(window as any).customCardEditors = (window as any).customCardEditors || {};
(window as any).customCardEditors["rotel-amplifier-card"] = "rotel-card-editor";