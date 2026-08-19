# dsh-message-card

A DeepSeek Harness (DSH) plugin that adds an interactive **message-card** system:

- A **「消息卡片」** page in Settings that lists / previews supported cards and lets you customize their look.
- An in-conversation **meeting-room booking card**, triggered when the user says something like "帮我预定会议室".
- Theme + layout customization: 3 accent themes and single/double-column input layout.

## Features

| Card | Trigger | Behavior |
| --- | --- | --- |
| `meeting_room` 会议室预定 | "预定会议室" | date, room number, start/end time, attendee chips → submit |

**Customization** (in Settings → 消息卡片):
- **Theme** (主题风格): 默认蓝 / 青绿 / 紫罗兰 — swaps the accent color across icon/button/chip/focus states.
- **Layout** (输入框布局): 单列 (one input per row) / 双列 (two inputs per row).

## Install

This package ships two halves:

- `src/index.ts` → Host half (registers `show_message_card` tool + `mc_submit` RPC).
- `src/client.ts` → Client half (settings page + card UI + style store), exposed via the `./client` export and the `dsh.client` field in `package.json`.

Build it:

```bash
pnpm install
pnpm build   # tsdown → lib/
```

Then mount it in your profile's `cordis.patch.yml` (see `cordis.patch.yml.example`):

```yaml
message-card:
  package: dsh-message-card
```

Or, to reuse the DSH GitHub plugin flow, publish the repo and use `github_plugin_install`.

## Configuration

No required config. Optional `data` payload on the tool maps to card defaults:
`{ title, defaultDate, defaultStart, defaultEnd, defaultRoom, attendees }` (`attendees: string[]`).

## Notes

- Card style prefs live in the plugin run (in-memory); a full persistence layer is out of scope for the dynamic-plugin model and can be added via `ctx.settings`.
- Attendees default to a built-in list; pass `data.attendees` (resolved by the model/upstream) to make them dynamic.

## License

MIT
