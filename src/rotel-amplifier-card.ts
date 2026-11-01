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

  private _turnOn() { this._call("turn_on"); }
  private _turnOff() { this._call("turn_off"); }
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
    const on = state !== "off" && state !== "standby";

    return html`
      <ha-card>
        <div class="wrap">
          <div class="header">
            <span class="brand">ROTEL</span>
            <span class="status ${on ? "on" : "off"}">${state.toUpperCase()}</span>
          </div>
          <div class="volume">
            <div class="vnum">${Math.round(volume * 100)}</div>
            <div class="vlabel">VOLUME</div>
            <input type="range" min="0" max="1" step="0.01" .value=${String(volume)}
              @input=${this._setVolume} />
          </div>
          <div class="controls">
            <button @click=${this._volumeDown}>−</button>
            <button @click=${this._mute}>${muted ? "UNMUTE" : "MUTE"}</button>
            <button @click=${this._volumeUp}>+</button>
            <button @click=${on ? this._turnOff : this._turnOn}>${on ? "POWER OFF" : "POWER ON"}</button>
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
      .status { font-size: 12px; padding: 2px 8px; border-radius: 4px; }
      .status.on { background: #1b5e20; color: #a5d6a7; }
      .status.off { background: #424242; color: #bdbdbd; }
      .volume { text-align: center; }
      .vnum { font-size: 48px; font-weight: 300; color: #c9a227; }
      .vlabel { font-size: 11px; letter-spacing: 2px; color: #888; }
      input[type=range] { width: 100%; }
      .controls { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
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
