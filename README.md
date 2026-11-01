# Rotel Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/drtsb/ha-rotel-card?include_prereleases&sort=semver)](https://github.com/drtsb/ha-rotel-card/releases)
[![GitHub last commit](https://img.shields.io/github/last-commit/drtsb/ha-rotel-card)](https://github.com/drtsb/ha-rotel-card/commits)
[![License](https://img.shields.io/github/license/drtsb/ha-rotel-card)](LICENSE)

Кастомная Lovelace-карточка для управления усилителями **Rotel** через интеграцию [ha-rotel](https://github.com/) в Home Assistant.

Вдохновлена минималистичным стилем Hi-Fi аппаратуры: акцент на громкости, входах, базовых настройках тона и управлении колонками.

## Внешний вид

> *Скриншот-заглушка.* Добавьте реальный скриншот карточки в `assets/rotel-card.png` и замените ссылку ниже.

![Rotel Card Preview](assets/rotel-card.png)

## Возможности

- Управление громкостью (шкала **0–96**)
- Выбор входа усилителя
- Управление **Tone Bypass**
- Регулировка **Bass / Treble**
- Переключение **Speakers A / B**
- Управление **Display Dimmer** (при поддержке интеграции)
- Автоматическая блокировка ползунка громкости при **Fixed Volume / Pass-Through**
- Оптимизированный рендеринг без мерцания

## Установка

### Способ 1. Через HACS (рекомендуется)

1. Откройте **HACS → Frontend → ⋮ (меню) → Custom repositories**
2. В поле **Repository** укажите: `https://github.com/drtsb/ha-rotel-card`
3. В поле **Category** выберите: `Plugin`
4. Нажмите **Add**
5. Найдите `Rotel Card` в списке плагинов HACS и установите его
6. Перезагрузите Lovelace / браузер

### Способ 2. Вручную

1. Скачайте последний `rotel-card.js` из [Releases](https://github.com/drtsb/ha-rotel-card/releases)
2. Скопируйте `rotel-card.js` в папку Home Assistant: `config/www/`
3. Добавьте ресурс Lovelace:
   - **Настройки → Панели Lovelace → Ресурсы → Добавить ресурс**
   - URL: `/local/rotel-card.js`
   - Тип: `JavaScript Module`
4. Добавьте карточку на дашборд

## Конфигурация

### Простой вариант

```yaml
type: custom:rotel-card
entity: media_player.rotel_amplifier
```

### Расширенный вариант

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

## Параметры конфигурации

| Параметр | Тип | Обязательный | Описание |
| --- | --- | --- | --- |
| `type` | `string` | Да | Должен быть `custom:rotel-card` |
| `entity` | `string` | Да | Основная сущность `media_player` усилителя Rotel (например `media_player.rotel_amplifier`) |
| `name` | `string` | Нет | Кастомное название карточки. По умолчанию берётся из `friendly_name` сущности |
| `tone_bypass_entity` | `string` | Нет | Сущность управления Tone Bypass (`switch`/`binary_sensor` в зависимости от интеграции) |
| `bass_entity` | `string` | Нет | Сущность регулировки баса (`number`/`select`) |
| `treble_entity` | `string` | Нет | Сущность регулировки верха (`number`/`select`) |
| `speakers_a_entity` | `string` | Нет | Управление динамиками A (`switch`) |
| `speakers_b_entity` | `string` | Нет | Управление динамиками B (`switch`) |
| `dimmer_entity` | `string` | Нет | Управление яркостью дисплея (`select`/`number`) |
| `hide_name` | `boolean` | Нет | Скрыть заголовок карточки (`true`/`false`) |
| `compact` | `boolean` | Нет | Компактный режим отображения (`true`/`false`) |

> Точный набор доступных сущностей зависит от вашей установки `ha-rotel`. Карточка использует только указанные в конфиге сущности и не делает лишних подписок.

## Разработка

### Требования

- Node.js **v20+**
- npm / pnpm / yarn

### Установка и запуск

```bash
# Клонирование
git clone https://github.com/drtsb/ha-rotel-card.git
cd ha-rotel-card

# Установка зависимостей
npm install

# Dev-режим (watch)
npm run watch

# Проверка типов
npm run typecheck

# Production-сборка
npm run build
```

После `npm run build` в корне репозитория (или в `dist/` согласно конфигу) появится единый автономный файл `rotel-card.js`.

## Вклад в проект

Пул-реквесты приветствуются. Перед отправкой PR убедитесь, что выполнены требования из [AGENTS.md](AGENTS.md):

- `npm run typecheck` — без ошибок
- `npm run build` — успешен
- Версия в `package.json` корректно инкрементирована

## Лицензия

Смотрите файл [LICENSE](LICENSE).
