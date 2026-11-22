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
  selector:
    | { entity: { domain: string } }
    | { text: {} }
    | { boolean: {} }
    | { select: { options: { value: string; label: string }[]; mode: string } };
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

  public computeLabel = (schema: { name: string }): string => {
    if (!this.hass) return schema.name;
    const t = (key: string) => localize(this.hass, "editor", key);
    const name = schema.name;
    if (name.startsWith("settings_entities.")) {
      const entityKey = name.split(".")[1];
      return t(`${entityKey}_entity`);
    }
    return t(name);
  };

  public computeHelper = (schema: { name: string }): string | undefined => {
    if (!this.hass) return undefined;
    const t = (key: string) => localize(this.hass, "editor", key);
    const helperKey = `${schema.name}_helper`;
    const translation = t(helperKey);
    return translation !== helperKey ? translation : undefined;
  };

  protected render() {
    if (!this._config || !this.hass) return html``;

    const showSettings = this._config.show_settings === true;
    const t = (key: string) => localize(this.hass, "editor", key);

    const themeOptions = [
      { value: "silver", label: t("theme_silver") },
      { value: "black", label: t("theme_black") },
      { value: "champagne", label: t("theme_champagne") },
      { value: "minimal", label: t("theme_minimal") },
    ];

    const schema: FormSchema[] = [
      { name: "entity", selector: { entity: { domain: "media_player" } } },
      { name: "model", selector: { text: {} } },
      {
        name: "theme",
        selector: {
          select: {
            options: themeOptions,
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
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
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