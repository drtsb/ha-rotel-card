import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  LovelaceCardEditor,
  fireEvent,
} from "custom-card-helpers";
import type { ActionConfig } from "custom-card-helpers";

interface RotelCardConfig {
  type: string;
  entity: string;
  name?: string;
  model?: string;
  show_name?: boolean;
  show_volume?: boolean;
  show_inputs?: boolean;
}

@customElement("rotel-amplifier-card")
export class RotelAmplifierCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: RotelCardConfig;

  public setConfig(config: RotelCardConfig): void {
    if (!config.entity) throw new Error("entity is required");
    this._config = config;
  }

  public getCardSize(): number {
    return 4;
  }

  static getStubConfig(): Partial<RotelCardConfig> {
    return { entity: "media_player.rotel", show_name: true, show_volume: true, show_inputs: true };
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    return !!this._config && (changed.has("hass") || changed.has("_config"));
  }

  private get _entity() {
    return this.hass?.states?.[this._config!.entity];
  }

  private _call(service: string, data: Record<string, unknown> = {}) {
    this.hass.callService("media_player", service, { entity_id: this._config!.entity, ...data });
  }

  private _togglePower() { this._call("toggle"); }
  private _volumeUp() { this._call("volume_up"); }
  private _volumeDown() { this._call("volume_down"); }
  private _mute() {
    const muted = this._entity?.attributes?.is_volume_muted;
    this._call("volume_mute", { is_volume_muted: !muted });
  }
  private _setSource(src: string) { this._call("select_source", { source: src }); }
  private _setVolume(e: Event) {
    const v = parseFloat((e.target as HTMLInputElement).value);
    this._call("volume_set", { volume_level: v });
  }

  protected render() {
    if (!this._config || !this.hass) return html``;
    const e = this._entity;
    const state = e?.state ?? "unavailable";
    const attrs = e?.attributes ?? {};
    const volume = (attrs.volume_level as number) ?? 0;
    const source = (attrs.source as string) ?? "—";
    const sources = (attrs.source_list as string[]) ?? [];
    const muted = !!attrs.is_volume_muted;
    const on = state !== "off" && state !== "standby" && state !== "unavailable";
    const model = this._config.model || (attrs.model as string) || (attrs.device_model as string) || (attrs.friendly_name as string) || "";

    return html`
      <ha-card>
        <div class="wrap">
          <div class="header">
            <div class="brand-group">
              <span class="brand">ROTEL</span>
              ${model ? html`<span class="model">${model}</span>` : ""}
            </div>
            <ha-icon-button
              class="power ${on ? "on" : "off"}"
              .label=${on ? "Power off" : "Power on"}
              @click=${this._togglePower}
            >
              <ha-icon icon="mdi:power"></ha-icon>
            </ha-icon-button>
          </div>
          <div class="volume">
            <div class="vnum">${Math.round(volume * 100)}</div>
            <div class="vlabel">VOLUME</div>
            <input type="range" min="0" max="1" step="0.01" .value=${String(volume)}
              @input=${this._setVolume} />
          </div>
          <div class="controls">
            <ha-icon-button class="vol" .label=${"Volume down"} @click=${this._volumeDown}>
              <ha-icon icon="mdi:volume-minus"></ha-icon>
            </ha-icon-button>
            <ha-icon-button class="vol mute" .label=${muted ? "Unmute" : "Mute"} @click=${this._mute}>
              <ha-icon icon=${muted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
            </ha-icon-button>
            <ha-icon-button class="vol" .label=${"Volume up"} @click=${this._volumeUp}>
              <ha-icon icon="mdi:volume-plus"></ha-icon>
            </ha-icon-button>
          </div>
          <div class="source">
            <div class="src-label">SOURCE: ${source}</div>
            <div class="srcs">
              ${sources.map((s) => html`<button class=${s === source ? "active" : ""} @click=${() => this._setSource(s)}>${s}</button>`)}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; }
      ha-card {
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        color: #e0e0e0;
        border: 1px solid #333;
        border-radius: 12px;
        padding: 16px;
        font-family: "Roboto", sans-serif;
      }
      .wrap { display: flex; flex-direction: column; gap: 12px; }
      .header { display: flex; justify-content: space-between; align-items: center; }
      .brand { font-size: 20px; font-weight: 700; letter-spacing: 4px; color: #c9a227; }
      .brand-group { display: flex; align-items: baseline; gap: 10px; }
      .model { font-size: 12px; letter-spacing: 1px; color: #888; }
      ha-icon-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 22px;
        color: #cfcfcf;
      }
      ha-icon-button ha-icon { width: 22px; height: 22px; }
      ha-icon-button:hover { color: #fff; }
      ha-icon-button.power.on ha-icon { color: var(--success-color, green); }
      ha-icon-button.power.off ha-icon { color: var(--error-color, red); }
      .volume { text-align: center; }
      .vnum { font-size: 48px; font-weight: 300; color: #c9a227; }
      .vlabel { font-size: 11px; letter-spacing: 2px; color: #888; }
      input[type=range] { width: 100%; }
      .controls { display: flex; align-items: center; justify-content: center; gap: 10px; }
      button { background: #2a2a2a; color: #e0e0e0; border: 1px solid #444; border-radius: 6px; padding: 6px 12px; cursor: pointer; }
      button.active { background: #c9a227; color: #000; }
      .source { }
      .src-label { font-size: 12px; color: #888; margin-bottom: 6px; }
      .srcs { display: flex; flex-wrap: wrap; gap: 6px; }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "rotel-amplifier-card": RotelAmplifierCard;
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "rotel-amplifier-card",
  name: "Rotel Amplifier Card",
  description: "Hi-Fi card for Rotel amplifier",
});
