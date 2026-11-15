import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
} from "custom-card-helpers";

import "./rotel-card-editor";

interface RotelCardConfig {
  type: string;
  entity: string;
  name?: string;
  model?: string;
  show_name?: boolean;
  show_volume?: boolean;
  show_inputs?: boolean;
  show_settings?: boolean;
  hide_volume?: boolean;
  theme_variables?: Record<string, string>;
}

const FIXED_VOLUME_ATTRIBUTES = [
  "fixed_volume",
  "fixedVolume",
  "pass_through",
  "passThrough",
  "is_fixed_volume",
];

function isFixedVolumeActive(attrs: Record<string, unknown>): boolean {
  for (const key of FIXED_VOLUME_ATTRIBUTES) {
    const value = attrs[key];
    if (typeof value === "string") return value !== "off" && value !== "false" && value !== "0";
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
  }
  return false;
}

@customElement("rotel-amplifier-card")
export class RotelAmplifierCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: RotelCardConfig;

  /** Debounce timer for source selection to avoid spamming HA */
  private _sourceSelectTimer: ReturnType<typeof setTimeout> | null = null;

  public setConfig(config: RotelCardConfig): void {
    if (!config.entity) throw new Error("entity is required");
    this._config = config;
  }

  public getCardSize(): number {
    return 4;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("rotel-card-editor");
  }

  /**
   * Maps config.theme_variables to inline CSS custom properties on the
   * root <ha-card> element so users can theme the card via YAML without
   * touching the source code.
   */
  public applyThemeVariables(): void {
    const card = this.shadowRoot?.querySelector("ha-card") as HTMLElement | null;
    if (!card) return;
    const variables = this._config?.theme_variables;
    if (!variables || typeof variables !== "object") return;
    for (const [name, value] of Object.entries(variables)) {
      card.style.setProperty(name, String(value));
    }
  }

  static getStubConfig(): Partial<RotelCardConfig> {
    return { entity: "media_player.rotel", show_name: true, show_volume: true, show_inputs: true };
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    return !!this._config && (changed.has("hass") || changed.has("_config"));
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has("_config")) this.applyThemeVariables();
  }

  private get _entity() {
    return this.hass?.states?.[this._config!.entity];
  }

  private get _fixedVolume(): boolean {
    return isFixedVolumeActive(this._entity?.attributes ?? {});
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
  private _selectSource(source: string) {
    if (this._fixedVolume) return;

    // Debounce: ignore rapid clicks within 300ms
    if (this._sourceSelectTimer) {
      clearTimeout(this._sourceSelectTimer);
    }
    this._sourceSelectTimer = setTimeout(() => {
      this._call("select_source", { source });
      this._sourceSelectTimer = null;
    }, 300);
  }
  private _setVolume(e: Event) {
    if (this._fixedVolume) return;
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
    const fixedVolume = this._fixedVolume;
    const model = this._config.model || (attrs.model as string) || (attrs.device_model as string) || (attrs.friendly_name as string) || "";

    // Limit to 12 sources (2 rows × 6 columns) as per the CSS grid
    const displaySources = sources.slice(0, 12);
    const hasMoreSources = sources.length > 12;

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
              ?disabled=${fixedVolume} @input=${this._setVolume} />
          </div>
          <div class="controls">
            <ha-icon-button class="control-btn vol" .label=${"Volume down"} ?disabled=${fixedVolume} @click=${this._volumeDown}>
              <ha-icon icon="mdi:volume-minus"></ha-icon>
            </ha-icon-button>
            <ha-icon-button class="control-btn vol mute" .label=${muted ? "Unmute" : "Mute"} ?disabled=${fixedVolume} @click=${this._mute}>
              <ha-icon icon=${muted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
            </ha-icon-button>
            <ha-icon-button class="control-btn vol" .label=${"Volume up"} ?disabled=${fixedVolume} @click=${this._volumeUp}>
              <ha-icon icon="mdi:volume-plus"></ha-icon>
            </ha-icon-button>
          </div>
          <div class="rotel-panel">
            <div class="source-grid">
              ${displaySources.map(
                (s) => html`
                  <div class="source-item ${s === source ? "active" : ""}">
                    <span class="source-label">${s}</span>
                    <div class="source-led" aria-hidden="true"></div>
                    <button
                      class="rotel-btn"
                      ?disabled=${fixedVolume}
                      aria-label=${`Select source ${s}`}
                      @click=${() => this._selectSource(s)}
                    ></button>
                  </div>
              `)}
            </div>
            ${hasMoreSources ? html`
              <div class="source-truncation" aria-live="polite">
                +${sources.length - 12} more
              </div>
            ` : ""}
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; }
      ha-card {
        background: var(--rotel-bg, linear-gradient(145deg, #1a1a1a, #0d0d0d));
        color: var(--rotel-text, var(--primary-text-color, #e0e0e0));
        border: 1px solid var(--rotel-border, #333);
        border-radius: 12px;
        padding: 16px;
        font-family: "Roboto", sans-serif;
      }
.wrap { display: flex; flex-direction: column; gap: 0.75rem; }
      .header { display: flex; justify-content: space-between; align-items: center; }
      .brand { font-size: 1.25rem; font-weight: 700; letter-spacing: 0.25rem; color: var(--rotel-accent, #c9a227); }
      .brand-group { display: flex; align-items: baseline; gap: 0.625rem; }
      .model { font-size: 0.75rem; letter-spacing: 1px; color: var(--rotel-text-muted, var(--secondary-text-color, #888)); }
      ha-icon-button {
        --mdc-icon-button-size: 2.5rem;
        --mdc-icon-size: 1.375rem;
        color: var(--rotel-icon-color, #cfcfcf);
      }
      ha-icon-button ha-icon { width: 1.375rem; height: 1.375rem; }
      ha-icon-button:hover { color: #fff; }
      ha-icon-button.power.on ha-icon { color: var(--success-color, green); }
      ha-icon-button.power.off ha-icon { color: var(--error-color, red); }
      ha-icon-button[disabled],
      ha-icon-button[disabled]:hover { color: var(--rotel-disabled, #5a5a5a); pointer-events: none; }
      .volume { text-align: center; background: var(--rotel-display-bg, transparent); }
      .vnum { font-size: 3rem; font-weight: 300; color: var(--rotel-display-text, #c9a227); }
      .vlabel { font-size: 0.6875rem; letter-spacing: 2px; color: var(--rotel-text-muted, var(--secondary-text-color, #888)); }
      input[type=range] { width: 100%; }
      input[type=range][disabled] { opacity: 0.4; cursor: not-allowed; }
      .controls { display: flex; align-items: center; justify-content: center; gap: 0.625rem; }
      .control-btn { background: var(--rotel-button-color, #2a2a2a); color: var(--rotel-text, var(--primary-text-color, #e0e0e0)); border: 1px solid var(--rotel-border-button, #444); border-radius: 0.375rem; padding: 0.375rem 0.75rem; cursor: pointer; }
      .control-btn.active { background: var(--rotel-accent, #c9a227); color: var(--rotel-active-text, #000); }
      .control-btn[disabled] { opacity: 0.4; cursor: not-allowed; }

      /* Rotel-style source selector panel */
      .rotel-panel {
        background: linear-gradient(135deg, #d4d4d4 0%, #b8b8b8 100%);
        padding: 1.5rem;
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8),
                    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
      }
      .source-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        row-gap: 1.25rem;
        column-gap: 0.625rem;
        justify-items: center;
      }
      .source-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.375rem;
      }
      .source-label {
        font-family: 'Arial', sans-serif;
        font-size: 0.625rem;
        font-weight: 700;
        color: #333;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
      }
      .source-led {
        width: 0.375rem;
        height: 0.375rem;
        border-radius: 50%;
        background: #2a2a2a;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.4);
        transition: all 0.3s ease;
      }
      .source-item.active .source-led {
        background: #0078ff;
        box-shadow: 0 0 0.25rem #0078ff, 0 0 0.5rem #0078ff, inset 0 1px 2px rgba(255,255,255,0.8);
      }
      .rotel-btn {
        position: relative;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        border: none;
        outline: none;
        cursor: pointer;
        background: linear-gradient(135deg, #fdfdfd 0%, #c3c3c3 100%);
        box-shadow: 0 0.25rem 0.3125rem rgba(0,0,0,0.3), inset 0 0.125rem 0.1875rem rgba(255,255,255,0.9), inset 0 -0.125rem 0.1875rem rgba(0,0,0,0.2);
        transition: transform 0.05s ease, box-shadow 0.05s ease;
      }
      .rotel-btn::before {
        content: '';
        position: absolute;
        top: -0.1875rem;
        left: -0.1875rem;
        right: -0.1875rem;
        bottom: -0.1875rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #999 0%, #e6e6e6 100%);
        z-index: -1;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8);
      }
      .rotel-btn:active {
        transform: translateY(0.125rem);
        box-shadow: 0 1px 1px rgba(0,0,0,0.2), inset 0 0.1875rem 0.3125rem rgba(0,0,0,0.5), inset 0 -1px 2px rgba(255,255,255,0.4);
      }
      .rotel-btn[disabled] {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .rotel-btn:focus-visible {
        outline: 2px solid var(--rotel-accent, #c9a227);
        outline-offset: 2px;
      }
      .source-truncation {
        margin-top: 1rem;
        text-align: center;
        font-size: 0.75rem;
        color: var(--rotel-text-muted, var(--secondary-text-color, #888));
      }
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
