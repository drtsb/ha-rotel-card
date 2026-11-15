import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "custom-card-helpers";

interface RotelCardConfig {
  type: string;
  entity: string;
  model?: string;
  show_settings?: boolean;
  hide_volume?: boolean;
}

interface FormSchema {
  name: string;
  selector:
    | { entity: { domain: string } }
    | { text: {} }
    | { boolean: {} };
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

    const schema: FormSchema[] = [
      { name: "entity", selector: { entity: { domain: "media_player" } } },
      { name: "model", selector: { text: {} } },
      { name: "show_settings", selector: { boolean: {} } },
      { name: "hide_volume", selector: { boolean: {} } },
    ];

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
