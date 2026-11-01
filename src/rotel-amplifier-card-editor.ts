import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "custom-card-helpers";

interface RotelCardConfig { type: string; entity: string; name?: string; show_name?: boolean; show_volume?: boolean; show_inputs?: boolean; }

@customElement("rotel-amplifier-card-editor")
export class RotelAmplifierCardEditor extends LitElement {
  @property({ attribute: false }) public hass: any;
  @state() private _config?: RotelCardConfig;

  public setConfig(config: RotelCardConfig): void { this._config = config; }

  private _valueChanged(ev: Event) {
    if (!this._config) return;
    const target = ev.target as any;
    const newConfig = { ...this._config, [target.configValue]: target.checked ?? target.value };
    fireEvent(this, "config-changed", { config: newConfig });
  }

  protected render() {
    if (!this._config) return html``;
    return html`
      <div class="card-config">
        <ha-textfield label="Entity" .value=${this._config.entity || ""} configValue="entity" @input=${this._valueChanged}></ha-textfield>
        <ha-textfield label="Name" .value=${this._config.name || ""} configValue="name" @input=${this._valueChanged}></ha-textfield>
        <ha-formfield label="Show name"><ha-switch .checked=${this._config.show_name !== false} configValue="show_name" @change=${this._valueChanged}></ha-switch></ha-formfield>
        <ha-formfield label="Show volume"><ha-switch .checked=${this._config.show_volume !== false} configValue="show_volume" @change=${this._valueChanged}></ha-switch></ha-formfield>
        <ha-formfield label="Show inputs"><ha-switch .checked=${this._config.show_inputs !== false} configValue="show_inputs" @change=${this._valueChanged}></ha-switch></ha-formfield>
      </div>
    `;
  }

  static get styles() {
    return css` .card-config { display: flex; flex-direction: column; gap: 8px; padding: 8px; } `;
  }
}

declare global { interface HTMLElementTagNameMap { "rotel-amplifier-card-editor": RotelAmplifierCardEditor; } }
(window as any).customCardEditors = (window as any).customCardEditors || {};
(window as any).customCardEditors["rotel-amplifier-card"] = "rotel-amplifier-card-editor";
