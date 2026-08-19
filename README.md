# dsh-message-card

A DeepSeek Harness (DSH) plugin that adds an interactive **message-card** system:

- A **「消息卡片」** page in Settings that lists / previews supported cards and lets you customize their look.
- An in-conversation **meeting-room booking card**, triggered when the user says something like "帮我预定会议室".
- Theme + layout customization: 3 accent themes and single/double-column input layout.

## Features

| Card | Trigger | Behavior |
| --- | --- | --- |
| `meeting_room` 会议室预定 | "预定会议室" | date, room number, start/end time, attendee chips → confirm |

**Customization** (Settings → 消息卡片):
- **Theme** (主题风格): 默认蓝 / 青绿 / 紫罗兰 — swaps the accent color across icon/button/chip/focus states.
- **Layout** (输入框布局): 单列 (one input per row) / 双列 (two inputs per row).

## Architecture

Two halves:

- `src/index.ts` → **Host half** (`lib/index.js`): registers the model-facing `show_message_card` tool via `ctx.tools.register` using the standard `@deepseek-ai/dsh-tools` DSL.
- `src/client/index.ts` → **Client half** (`lib/client.js`): the browser UI (settings page + conversation cards + in-memory style store). It is served by `dsh-client-modules` thanks to the `dsh.client` declaration in `package.json`.

Card confirmation is a **pure client-side action** (no host round-trip); the tool result carries the card payload as a `MC::`-prefixed text envelope that the client parses and renders under the matching turn.

## Install

This package is a standard npm/DSH external plugin. Build artefacts are gitignored and produced on install via the `prepare` script.

```bash
pnpm install          # runs prepare → tsc + tsdown → lib/
pnpm build            # manual (re)build
```

Mount it via the `dsh.bundle.patch` (see `cordis.patch.yml`), or run:

```bash
dsh plugin add dsh-message-card
```

The `cordis.patch.yml` inserts one row (`id: dsh-message-card`) resolved by name to this package.

## Configuration

No required config. The tool accepts an optional `data` payload mapping to card defaults:

```jsonc
{
  "title": "…",
  "defaultDate": "2026-08-20",
  "defaultStart": "09:00",
  "defaultEnd": "10:00",
  "defaultRoom": "A301",
  "attendees": ["张伟", "李娜", "…"]
}
```

`attendees` is a `string[]`; omit it to use the built-in default list.

## Notes

- Card style prefs live in the plugin run (in-memory); a persistence layer can be added later via `ctx.settings`.
- `tsdown.config.ts` bundles the client half as a `window.__ModuleLoader__.load(...)` CJS closure, matching the DSH browser plugin contract; `react` is an external answered by the shell loader.

## License

MIT
