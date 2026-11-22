import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
} from "custom-card-helpers";

import "./rotel-card-editor";
import { localize, getLanguage, type SupportedLanguage } from "./localize/localize";

type ThemePreset = "silver" | "black" | "champagne" | "minimal";

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
  theme?: ThemePreset;
  custom_theme_vars?: Record<string, string>;
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
  
  /** Debounce timers for settings sliders */
  private _settingsDebounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  /** Apply theme preset as data-theme attribute on host */
  private _applyThemePreset(): void {
    const theme = this._config?.theme ?? "silver";
    this.setAttribute("data-theme", theme);
  }

  public setConfig(config: RotelCardConfig): void {
    if (!config.entity) throw new Error("entity is required");
    this._config = config;
    // Apply theme immediately on config change (before first render)
    this._applyThemePreset();
  }

  public getCardSize(): number {
    // Base size + settings panel (approx 2 rows) if enabled and entities configured
    const baseSize = 4;
    if (this._config?.show_settings && this._config?.settings_entities) {
      const entityCount = Object.values(this._config.settings_entities).filter(Boolean).length;
      if (entityCount > 0) return baseSize + Math.ceil(entityCount / 3) + 1;
    }
    return baseSize;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("rotel-card-editor");
  }

  /**
   * Maps config.custom_theme_vars to inline CSS custom properties on the
   * root <ha-card> element so users can theme the card via YAML without
   * touching the source code.
   */
  public applyThemeVariables(): void {
    const card = this.shadowRoot?.querySelector("ha-card") as HTMLElement | null;
    if (!card) return;
    const variables = this._config?.custom_theme_vars;
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
    if (changed.has("_config")) {
      this._applyThemePreset();
      this.applyThemeVariables();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._sourceSelectTimer) {
      clearTimeout(this._sourceSelectTimer);
      this._sourceSelectTimer = null;
    }
    for (const timer of this._settingsDebounceTimers.values()) {
      clearTimeout(timer);
    }
    this._settingsDebounceTimers.clear();
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
  private _mute() {
    const muted = this._entity?.attributes?.is_volume_muted;
    this._call("volume_mute", { is_volume_muted: !muted });
  }
  private _selectSource(source: string) {
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
    this._call("volume_set", { volume_level: v / 96 });
  }

  /** Debounce helper for settings changes */
  private _debounceSetting(entityId: string, callback: () => void, delay = 300): void {
    const existing = this._settingsDebounceTimers.get(entityId);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      callback();
      this._settingsDebounceTimers.delete(entityId);
    }, delay);
    this._settingsDebounceTimers.set(entityId, timer);
  }

  private _callSettingsService(domain: string, service: string, entityId: string, data: Record<string, unknown> = {}) {
    this.hass.callService(domain, service, { entity_id: entityId, ...data });
  }

  private _handleNumberChange(entityId: string, e: Event) {
    const value = parseFloat((e.target as HTMLInputElement).value);
    this._debounceSetting(entityId, () => {
      this._callSettingsService("number", "set_value", entityId, { value });
    });
  }

  private _handleSwitchChange(entityId: string, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this._callSettingsService("switch", checked ? "turn_on" : "turn_off", entityId);
  }

  private _handleSelectChange(entityId: string, e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this._callSettingsService("select", "select_option", entityId, { option: value });
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
    const settingsEntities = this._config.settings_entities ?? {};
    const showSettings = this._config.show_settings === true;

    // Fetch settings entity states
    const bassState = settingsEntities.bass ? this.hass.states[settingsEntities.bass] : null;
    const trebleState = settingsEntities.treble ? this.hass.states[settingsEntities.treble] : null;
    const balanceState = settingsEntities.balance ? this.hass.states[settingsEntities.balance] : null;
    const speakersAState = settingsEntities.speakers_a ? this.hass.states[settingsEntities.speakers_a] : null;
    const speakersBState = settingsEntities.speakers_b ? this.hass.states[settingsEntities.speakers_b] : null;
    const dimmerState = settingsEntities.dimmer ? this.hass.states[settingsEntities.dimmer] : null;
    const toneBypassState = settingsEntities.tone_bypass ? this.hass.states[settingsEntities.tone_bypass] : null;

    // Check if any settings entities are actually configured and available
    const configuredSettings = [
      bassState, trebleState, balanceState,
      speakersAState, speakersBState, toneBypassState, dimmerState
    ].filter(Boolean);
    const hasSettingsToShow = showSettings && configuredSettings.length > 0;

    // Limit to 12 sources (2 rows × 6 columns) as per the CSS grid
    const displaySources = sources.slice(0, 12);
    const hasMoreSources = sources.length > 12;

    const t = (ns: keyof import("./localize/localize").TranslationKeys, key: string, params?: Record<string, string | number>) =>
      localize(this.hass, ns, key, params);

    return html`
      <ha-card>
        <div class="wrap">
          <div class="header">
            <div class="brand-group">
              <span class="brand">ROTEL</span>
              ${model ? html`<span class="model">${model}</span>` : ""}
            </div>
            <div class="header-controls">
              <button
                class="rotel-btn mute ${muted ? "muted" : ""} ${(fixedVolume || !on) ? "disabled" : ""}"
                aria-label=${muted ? t("card", "unmute") : t("card", "mute")}
                ?disabled=${fixedVolume || !on}
                @click=${this._mute}
              >
                <ha-icon icon="mdi:volume-off" class="mute-icon"></ha-icon>
              </button>
              <button
                class="rotel-btn power ${on ? "on" : "off"}"
                aria-label=${on ? t("card", "power_off") : t("card", "power_on")}
                @click=${this._togglePower}
              >
                <ha-icon icon="mdi:power" class="power-icon"></ha-icon>
              </button>
            </div>
          </div>
          <div class="volume">
            <div class="vnum">${Math.round(volume * 96)}</div>
            <div class="vlabel">${t("card", "volume_label")}</div>
            <input type="range" min="0" max="96" step="1" .value=${String(Math.round(volume * 96))}
              ?disabled=${fixedVolume} @input=${this._setVolume} />
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
                      aria-label=${t("card", "source_select", { source: s })}
                      @click=${() => this._selectSource(s)}
                    ></button>
                  </div>
              `)}
            </div>
            ${hasMoreSources ? html`
              <div class="source-truncation" aria-live="polite">
                ${t("card", "more_sources", { count: sources.length - 12 })}
              </div>
            ` : ""}
          </div>
          ${hasSettingsToShow ? html`
            <div class="settings-panel">
              <div class="settings-header">
                <span class="settings-title">${t("card", "settings_title")}</span>
              </div>
              <div class="settings-grid">
                ${this._renderNumberSetting(t("settings", "bass"), bassState, settingsEntities.bass)}
                ${this._renderNumberSetting(t("settings", "treble"), trebleState, settingsEntities.treble)}
                ${this._renderNumberSetting(t("settings", "balance"), balanceState, settingsEntities.balance)}
                ${this._renderSwitchSetting(t("settings", "speakers_a"), speakersAState, settingsEntities.speakers_a)}
                ${this._renderSwitchSetting(t("settings", "speakers_b"), speakersBState, settingsEntities.speakers_b)}
                ${this._renderSwitchSetting(t("settings", "tone_bypass"), toneBypassState, settingsEntities.tone_bypass)}
                ${this._renderSelectSetting(t("settings", "dimmer"), dimmerState, settingsEntities.dimmer)}
              </div>
            </div>
          ` : ""}
        </div>
      </ha-card>
    `;
  }

  private _renderNumberSetting(
    label: string,
    stateObj: { state: string; attributes: Record<string, unknown> } | null,
    entityId: string | undefined
  ) {
    if (!stateObj || !entityId) return html``;
    const unavailable = stateObj.state === "unavailable" || stateObj.state === "unknown";
    const value = Number(stateObj.state);
    const min = Number(stateObj.attributes.min) ?? -10;
    const max = Number(stateObj.attributes.max) ?? 10;
    const step = Number(stateObj.attributes.step) ?? 1;
    const unavailLabel = localize(this.hass, "card", "unavailable");

    return html`
      <div class="setting-item ${unavailable ? "unavailable" : ""}">
        <div class="setting-label">${label}</div>
        <div class="setting-value">${unavailable ? unavailLabel : stateObj.state}</div>
        <ha-slider
          min=${min}
          max=${max}
          step=${step}
          .value=${value}
          pin
          ?disabled=${unavailable}
          @change=${(e: Event) => this._handleNumberChange(entityId, e)}
        ></ha-slider>
      </div>
    `;
  }

  private _renderSwitchSetting(
    label: string,
    stateObj: { state: string } | null,
    entityId: string | undefined
  ) {
    if (!stateObj || !entityId) return html``;
    const unavailable = stateObj.state === "unavailable" || stateObj.state === "unknown";

    return html`
      <div class="setting-item switch-item ${unavailable ? "unavailable" : ""}">
        <div class="setting-label">${label}</div>
        <ha-switch
          .checked=${stateObj.state === "on"}
          ?disabled=${unavailable}
          @change=${(e: Event) => this._handleSwitchChange(entityId, e)}
        ></ha-switch>
      </div>
    `;
  }

  private _renderSelectSetting(
    label: string,
    stateObj: { state: string; attributes: Record<string, unknown> } | null,
    entityId: string | undefined
  ) {
    if (!stateObj || !entityId) return html``;
    const unavailable = stateObj.state === "unavailable" || stateObj.state === "unknown";
    const options = (stateObj.attributes.options as string[] | undefined) ?? [];
    const unavailLabel = localize(this.hass, "card", "unavailable");

    return html`
      <div class="setting-item ${unavailable ? "unavailable" : ""}">
        <div class="setting-label">${label}</div>
        <div class="setting-value">${unavailable ? unavailLabel : stateObj.state}</div>
        <ha-select
          .value=${stateObj.state}
          ?disabled=${unavailable}
          @change=${(e: Event) => this._handleSelectChange(entityId, e)}
        >
          ${options.map((opt) => html`
            <mwc-list-item .value=${opt}>${opt}</mwc-list-item>
          `)}
        </ha-select>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; }

      /* Theme presets via data-theme attribute */
      :host([data-theme="silver"]) {
        --rotel-bg: linear-gradient(145deg, #e8e8e8, #d0d0d0);
        --rotel-text: #1a1a1a;
        --rotel-text-muted: #555;
        --rotel-border: #bbb;
        --rotel-accent: #c9a227;
        --rotel-display-text: #c9a227;
        --rotel-button-color: #f0f0f0;
        --rotel-border-button: #ccc;
        --rotel-icon-color: #333;
        --rotel-display-bg: linear-gradient(135deg, #f5f5f5, #e0e0e0);
        --rotel-panel-bg: linear-gradient(135deg, #d4d4d4 0%, #b8b8b8 100%);
        --rotel-panel-text: #333;
        --rotel-settings-bg: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
        --rotel-settings-border: #bbb;
      }
      :host([data-theme="black"]) {
        --rotel-bg: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        --rotel-text: #e0e0e0;
        --rotel-text-muted: #888;
        --rotel-border: #333;
        --rotel-accent: #c9a227;
        --rotel-display-text: #c9a227;
        --rotel-button-color: #2a2a2a;
        --rotel-border-button: #444;
        --rotel-icon-color: #cfcfcf;
        --rotel-display-bg: transparent;
        --rotel-panel-bg: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
        --rotel-panel-text: #e0e0e0;
        --rotel-settings-bg: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        --rotel-settings-border: #333;
      }
      :host([data-theme="champagne"]) {
        --rotel-bg: linear-gradient(145deg, #f5e6d3, #e8d4bc);
        --rotel-text: #2d2520;
        --rotel-text-muted: #6b5b4f;
        --rotel-border: #d4c4b0;
        --rotel-accent: #b8860b;
        --rotel-display-text: #b8860b;
        --rotel-button-color: #f0e0d0;
        --rotel-border-button: #d4c4b0;
        --rotel-icon-color: #4a3c30;
        --rotel-display-bg: linear-gradient(135deg, #faf0e6, #f0e0d0);
        --rotel-panel-bg: linear-gradient(135deg, #e8d4bc 0%, #dcc0a8 100%);
        --rotel-panel-text: #2d2520;
        --rotel-settings-bg: linear-gradient(135deg, #f5e6d3 0%, #e8d4bc 100%);
        --rotel-settings-border: #d4c4b0;
      }
      :host([data-theme="minimal"]) {
        --rotel-bg: var(--card-background-color, #ffffff);
        --rotel-text: var(--primary-text-color, #212121);
        --rotel-text-muted: var(--secondary-text-color, #757575);
        --rotel-border: var(--divider-color, #e0e0e0);
        --rotel-accent: var(--primary-color, #1976d2);
        --rotel-display-text: var(--primary-color, #1976d2);
        --rotel-button-color: var(--card-background-color, #ffffff);
        --rotel-border-button: var(--divider-color, #e0e0e0);
        --rotel-icon-color: var(--primary-text-color, #212121);
        --rotel-display-bg: transparent;
        --rotel-panel-bg: var(--card-background-color, #ffffff);
        --rotel-panel-text: var(--primary-text-color, #212121);
        --rotel-settings-bg: var(--card-background-color, #ffffff);
        --rotel-settings-border: var(--divider-color, #e0e0e0);
      }

      ha-card {
        background: var(--rotel-bg);
        color: var(--rotel-text);
        border: 1px solid var(--rotel-border);
        border-radius: 12px;
        padding: 16px;
        font-family: "Roboto", sans-serif;
      }
.wrap { display: flex; flex-direction: column; gap: 0.75rem; }
      .header { display: flex; justify-content: space-between; align-items: center; }
      .brand { font-size: 1.25rem; font-weight: 700; letter-spacing: 0.25rem; color: var(--rotel-accent, #c9a227); }
      .brand-group { display: flex; align-items: baseline; gap: 0.625rem; }
      .model { font-size: 0.75rem; letter-spacing: 1px; color: var(--rotel-text-muted, var(--secondary-text-color, #888)); }
      .header-controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .header .rotel-btn {
        width: 38px;
        height: 38px;
        min-width: 38px;
        min-height: 38px;
      }
      .header .rotel-btn ha-icon {
        width: 22px;
        height: 22px;
      }
      .header-controls .rotel-btn.power.on .power-icon { color: var(--success-color, green); filter: drop-shadow(0 0 6px rgba(0, 200, 0, 0.6)); }
      .header-controls .rotel-btn.power.off .power-icon { color: var(--error-color, red); filter: drop-shadow(0 0 6px rgba(200, 0, 0, 0.6)); }
      .header-controls .rotel-btn.mute.muted .mute-icon { color: #f5c518; filter: drop-shadow(0 0 6px rgba(255, 204, 0, 0.7)); }
      .header-controls .rotel-btn.mute:not(.muted) .mute-icon { color: var(--rotel-text-muted, #555); }
      .header-controls .rotel-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
      .volume { text-align: center; background: var(--rotel-display-bg, transparent); }
      .vnum { font-size: 3rem; font-weight: 300; color: var(--rotel-display-text, #c9a227); }
      .vlabel { font-size: 0.6875rem; letter-spacing: 2px; color: var(--rotel-text-muted, var(--secondary-text-color, #888)); }
      input[type=range] { width: 100%; }
      input[type=range][disabled] { opacity: 0.4; cursor: not-allowed; }

      /* Rotel-style source selector panel */
      .rotel-panel {
        background: var(--rotel-panel-bg, linear-gradient(135deg, #d4d4d4 0%, #b8b8b8 100%));
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
        color: var(--rotel-panel-text, #333);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
      }
      .source-led {
        width: 0.375rem;
        height: 0.375rem;
        border-radius: 50%;
        background: var(--rotel-text-muted, #2a2a2a);
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
        background: var(--rotel-button-color, linear-gradient(135deg, #fdfdfd 0%, #c3c3c3 100%));
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
        background: var(--rotel-border-button, linear-gradient(135deg, #999 0%, #e6e6e6 100%));
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

      /* Settings panel */
      .settings-panel {
        background: var(--rotel-settings-bg, linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%));
        border: 1px solid var(--rotel-settings-border, var(--rotel-border, #333));
        border-radius: var(--ha-card-border-radius, 12px);
        padding: 1rem;
        margin-top: 0.5rem;
      }
      .settings-header {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--rotel-border, #333);
      }
      .settings-title {
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 2px;
        color: var(--rotel-accent, #c9a227);
        text-transform: uppercase;
      }
      .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      .setting-item {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .setting-label {
        font-size: 0.625rem;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--rotel-text-muted, var(--secondary-text-color, #888));
        text-transform: uppercase;
      }
      .setting-value {
        font-size: 1rem;
        font-weight: 300;
        color: var(--rotel-display-text, #c9a227);
        text-align: right;
      }
      .setting-item > * {
        width: 100%;
      }
      .switch-item {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .switch-item .setting-label {
        margin-right: 1rem;
      }
      .switch-item ha-switch {
        --mdc-theme-primary: var(--rotel-accent, #c9a227);
      }
      ha-slider {
        --mdc-theme-primary: var(--rotel-accent, #c9a227);
        --mdc-theme-secondary: var(--rotel-accent, #c9a227);
      }
      ha-select {
        --mdc-theme-primary: var(--rotel-accent, #c9a227);
      }
      .setting-item.unavailable {
        opacity: 0.5;
        pointer-events: none;
      }
      .setting-item.unavailable .setting-value {
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
