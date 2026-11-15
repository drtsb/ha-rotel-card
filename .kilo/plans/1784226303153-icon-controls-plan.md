# Plan: Icon-based power and volume controls for `ha-rotel-card`

## Goal
Replace the bulky text buttons (`POWER ON/OFF`, `ON/OFF` badge, `VOL−`, `MUTE`, `VOL+`) with compact
`<ha-icon-button>` controls, keep the Hi-Fi look, and do the work on a separate branch.

## Branch and commits
1. Create branch from current `main`:
   - `git switch -c feature/icon-controls` (carries the existing uncommitted changes over).
2. Commit the already-present work first (separate commit):
   - `src/rotel-amplifier-card.ts` — `model` support in the header.
   - `package.json` — version `0.1.2` → `0.1.3`.
   - Message along the lines of `Show amplifier model in card header`.
3. Implement the icon controls, bump version to `0.1.4`, commit as a second commit.
   - No push/PR unless explicitly requested.

## Source changes (`src/rotel-amplifier-card.ts`)

### 1. Handlers
- Remove `_turnOn()` and `_turnOff()`.
- Add:
  ```ts
  private _togglePower() { this._call("toggle"); }
  ```
- Keep `_volumeUp()`, `_volumeDown()`, `_mute()` unchanged.

### 2. `render()`
- Header right side: remove `<span class="status ...">${state.toUpperCase()}</span>` and render:
  ```ts
  const off = state === "off" || state === "standby" || state === "unavailable";
  const on = !off;
  ...
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
  ```
  - Green (`var(--success-color, green)`) for `on`/`playing`/`paused`/`idle`.
  - Red (`var(--error-color, red)`) for `off`/`standby` (and `unavailable` treated as not-on).
  - Click always calls `media_player.toggle`.
- Replace the `.controls` text buttons:
  ```html
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
  ```
  - Mute icon is dynamic: `mdi:volume-off` when muted, `mdi:volume-high` otherwise (approved).
  - Source buttons remain unchanged.

### 3. CSS (`static get styles()`)
- Remove `.status`, `.status.on`, `.status.off` rules.
- Add/adjust:
  ```css
  .header { display: flex; justify-content: space-between; align-items: center; }

  ha-icon-button {
    --mdc-icon-button-size: 40px;
    --mdc-icon-size: 22px;
    color: #cfcfcf;
  }
  ha-icon-button ha-icon { width: 22px; height: 22px; }
  ha-icon-button:hover { color: #fff; }

  ha-icon-button.power.on ha-icon { color: var(--success-color, green); }
  ha-icon-button.power.off ha-icon { color: var(--error-color, red); }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  ```
- Keep `.volume`, `.vnum`, `.vlabel`, slider and source styles; only remove the old `button`
  rules if no longer needed (source buttons still need them, so keep them).

## Build and validation
- `npm run typecheck`
- `npm run build` — regenerates tracked `rotel-card.js` (and editor bundle); commit the built bundle.
- Quick grep of `rotel-card.js` for `mdi:power`, `mdi:volume-plus`, `mdi:volume-minus` and absence of `POWER ON`.
- Version check: `package.json` is `0.1.4` in the feature commit (CI `version-check` compares against `main`).

## Out of scope
- No README/editor changes needed (config API unchanged).
- No new external dependencies: `ha-icon-button`/`ha-icon` are built into the HA frontend.