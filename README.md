# Rotel Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/drtsb/ha-rotel-card?include_prereleases&sort=semver)](https://github.com/drtsb/ha-rotel-card/releases)
[![GitHub last commit](https://img.shields.io/github/last-commit/drtsb/ha-rotel-card)](https://github.com/drtsb/ha-rotel-card/commits)
[![License](https://img.shields.io/github/license/drtsb/ha-rotel-card)](LICENSE)

A custom Lovelace card for controlling **Rotel** amplifiers through the [ha-rotel-integration](https://github.com/drtsb/ha-rotel-integration) in Home Assistant.

Inspired by the clean, minimal aesthetic of Hi-Fi equipment with a focus on volume control, inputs, tone settings, and speaker management.

## Preview

> *Placeholder screenshot.* Add a real preview image at `assets/rotel-card.png` to display it here.

![Rotel Card Preview](assets/rotel-card.png)

## Features

- Volume control (scale **0–96**)
- Input/source selection
- **Tone Bypass** toggle
- **Bass / Treble** adjustment
- **Speakers A / B** switching
- **Display Dimmer** control (if supported by the integration)
- Automatic volume slider lock when **Fixed Volume / Pass-Through** is active
- Optimized rendering with minimal flicker

## Installation

### Option 1: HACS (Recommended)

1. Open **HACS → Frontend → ⋮ (Menu) → Custom repositories**
2. Set **Repository** to: `https://github.com/drtsb/ha-rotel-card`
3. Set **Category** to: `Plugin`
4. Click **Add**
5. Find `Rotel Card` in the plugin list and install it
6. Reload Lovelace / your browser

### Option 2: Manual

1. Download the latest `rotel-card.js` from the [Releases](https://github.com/drtsb/ha-rotel-card/releases) page
2. Copy `rotel-card.js` to your Home Assistant `config/www/` folder
3. Add the resource in Lovelace:
   - **Settings → Dashboards → Resources → Add Resource**
   - URL: `/local/rotel-card.js`
   - Type: `JavaScript Module`
4. Add the card to your dashboard

## Configuration

### Basic example

```yaml
type: custom:rotel-card
entity: media_player.rotel_amplifier
```

### Advanced example

```yaml
type: custom:rotel-card
entity: media_player.rotel_amplifier
name: Rotel RA/RC
tone_bypass_entity: switch.rotel_tone_bypass
bass_entity: number.rotel_bass
treble_entity: number.rotel_treble
speakers_a_entity: switch.rotel_speakers_a
speakers_b_entity: switch.rotel_speakers_b
dimmer_entity: select.rotel_display_dimmer
```

## Configuration Options

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `string` | Yes | Must be `custom:rotel-card` |
| `entity` | `string` | Yes | Main `media_player` entity for your Rotel amplifier (e.g., `media_player.rotel_amplifier`) |
| `name` | `string` | No | Custom card title. Defaults to the entity's `friendly_name` |
| `tone_bypass_entity` | `string` | No | Entity for Tone Bypass control (`switch`/`binary_sensor` depending on integration) |
| `bass_entity` | `string` | No | Entity for Bass adjustment (`number`/`select`) |
| `treble_entity` | `string` | No | Entity for Treble adjustment (`number`/`select`) |
| `speakers_a_entity` | `string` | No | Speakers A control (`switch`) |
| `speakers_b_entity` | `string` | No | Speakers B control (`switch`) |
| `dimmer_entity` | `string` | No | Display dimmer control (`select`/`number`) |
| `hide_name` | `boolean` | No | Hide the card header (`true`/`false`) |
| `compact` | `boolean` | No | Compact display mode (`true`/`false`) |

> The exact set of available entities depends on your [ha-rotel-integration](https://github.com/drtsb/ha-rotel-integration) installation. The card only subscribes to entities explicitly defined in the configuration.

## Development

### Requirements

- Node.js **v20+**
- npm / pnpm / yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/drtsb/ha-rotel-card.git
cd ha-rotel-card

# Install dependencies
npm install

# Watch mode for development
npm run watch

# Type checking
npm run typecheck

# Production build
npm run build
```

After building, a single self-contained `rotel-card.js` file will be generated in the root of the repository (or in `dist/` depending on your build config).

## Contributing

Pull requests are welcome. Before submitting a PR, make sure you follow the requirements in [AGENTS.md](AGENTS.md):

- `npm run typecheck` passes with no errors
- `npm run build` completes successfully
- Version in `package.json` has been incremented appropriately

## License

See [LICENSE](LICENSE) for details.
