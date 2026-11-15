import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "custom-card-helpers";

type ThemePreset = "silver" | "black" | "champagne" | "minimal";

interface RotelCardConfig {
  type: string;
  entity: string;
  name?: string;
  show_name?: boolean;
  show_volume?: boolean;
  show_inputs?: boolean;
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
  selector:
    | { entity: { domain: string } }
    | { text: {} }
    | { boolean: {} }
    | { select: { options: string[]; mode: string } };
}

@customElement("rotel-amplifier-card-editor")
export class RotelAmplifierCardEditor extends LitElement {
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

    const schema: FormSchema[] = [
      { name: "entity", selector: { entity: { domain: "media_player" } } },
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} } },
      { name: "show_volume", selector: { boolean: {} } },
      { name: "show_inputs", selector: { boolean: {} } },
      {
        name: "theme",
        selector: {
          select: {
            options: ["silver", "black", "champagne", "minimal"],
            mode: "dropdown",
          },
        },
      },
      { name: "show_settings", selector: { boolean: {} } },
      { name: "hide_volume", selector: { boolean: {} } },
    ];

    if (showSettings) {
      schema.push(
        { name: "settings_entities.bass", selector: { entity: { domain: "number" } } },
        { name: "settings_entities.treble", selector: { entity: { domain: "number" } } },
        { name: "settings_entities.balance", selector: { entity: { domain: "number" } } },
        { name: "settings_entities.speakers_a", selector: { entity: { domain: "switch" } } },
        { name: "settings_entities.speakers_b", selector: { entity: { domain: "switch" } } },
        { name: "settings_entities.dimmer", selector: { entity: { domain: "select" } } },
        { name: "settings_entities.tone_bypass", selector: { entity: { domain: "switch" } } },
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
    "rotel-amplifier-card-editor": RotelAmplifierCardEditor;
  }
}

(window as any).customCardEditors = (window as any).customCardEditors || {};
(window as any).customCardEditors["rotel-amplifier-card"] = "rotel-card-editor";