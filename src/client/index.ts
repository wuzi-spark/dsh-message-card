import type { Context } from '@deepseek-ai/cordis'
import * as React from 'react'

export const name = 'message-card'

// ---- Minimal in-memory store for card style prefs (lifetime = plugin run). ----
type CardStyle = { theme: string; layout: 'single' | 'double' }
let styleState: CardStyle = { theme: 'brand', layout: 'single' }
const listeners = new Set<() => void>()
const getSnapshot = () => styleState
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const setStyle = (next: Partial<CardStyle>) => {
  styleState = { ...styleState, ...next }
  listeners.forEach((fn) => fn())
}
const useCardStyle = (): CardStyle => React.useSyncExternalStore(subscribe, getSnapshot)

const THEMES: Record<string, { name: string; accent: string }> = {
  brand: { name: '默认蓝', accent: '#4C7DFF' },
  teal: { name: '青绿', accent: '#16A085' },
  violet: { name: '紫罗兰', accent: '#8B5CF6' }
}

const CSS = `
.mc-card{display:block;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:16px;padding:18px 20px;margin:10px 0;box-shadow:0 8px 30px rgba(0,0,0,.08);color:var(--dsw-alias-label-primary);max-width:560px;}
.mc-card__head{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.mc-card__icon{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;color:var(--mc-accent);background:color-mix(in srgb,var(--mc-accent) 14%,transparent);flex:0 0 auto;}
.mc-card__title{font-size:15px;font-weight:600;margin:0;letter-spacing:.1px;}
.mc-card__sub{font-size:12px;color:var(--dsw-alias-label-secondary);margin-top:2px;}
.mc-label{display:block;font-size:11px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;color:var(--dsw-alias-label-secondary);margin:0 0 6px;}
.mc-field{margin-bottom:14px;}
.mc-input{box-sizing:border-box;width:100%;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:10px 12px;font-size:14px;color:var(--dsw-alias-label-primary);outline:none;transition:border-color .15s,box-shadow .15s;}
.mc-input:focus{border-color:var(--mc-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--mc-accent) 16%,transparent);}
.mc-row{display:flex;gap:10px;}
.mc-row .mc-field{flex:1;margin-bottom:14px;}
.mc-chip-row{display:flex;flex-wrap:wrap;gap:8px;}
.mc-chip{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:999px;padding:7px 14px;font-size:13px;cursor:pointer;transition:all .15s;}
.mc-chip:hover{border-color:var(--mc-accent);}
.mc-chip--on{background:var(--mc-accent);border-color:var(--mc-accent);color:#fff;}
.mc-btn{appearance:none;border:none;border-radius:11px;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;}
.mc-btn--primary{background:var(--mc-accent);color:#fff;}
.mc-btn--primary:hover{opacity:.88;}
.mc-btn--ghost{background:transparent;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);}
.mc-btn--ghost:hover{border-color:var(--mc-accent);color:var(--mc-accent);}
.mc-actions{display:flex;gap:10px;margin-top:16px;}
.mc-done{border:1px solid var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent);border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:10px;}
.mc-done__dot{width:9px;height:9px;border-radius:50%;background:var(--dsw-alias-state-success-primary);flex:0 0 auto;}
.mc-done__text{font-size:13px;color:var(--dsw-alias-label-primary);}
.mc-settings{display:flex;flex-direction:column;gap:18px;padding:4px 0;max-width:640px;}
.mc-settings__intro{font-size:13px;color:var(--dsw-alias-label-secondary);line-height:1.6;margin:0;}
.mc-panel{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:14px;padding:16px 18px;}
.mc-panel__h{font-size:12px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:var(--dsw-alias-label-secondary);margin:0 0 12px;}
.mc-seg{display:flex;gap:8px;flex-wrap:wrap;}
.mc-seg__item{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:10px;padding:9px 14px;font-size:13px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:8px;}
.mc-seg__item:hover{border-color:var(--mc-accent);}
.mc-seg__item--on{border-color:var(--mc-accent);background:color-mix(in srgb,var(--mc-accent) 12%,transparent);color:var(--mc-accent);font-weight:600;}
.mc-swatch{width:14px;height:14px;border-radius:50%;display:inline-block;flex:0 0 auto;box-shadow:0 0 0 1px rgba(0,0,0,.08);}
`

const svgCalendar = () =>
  React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }),
    React.createElement('line', { x1: 16, y1: 2, x2: 16, y2: 6 }),
    React.createElement('line', { x1: 8, y1: 2, x2: 8, y2: 6 }),
    React.createElement('line', { x1: 3, y1: 10, x2: 21, y2: 10 }))

const DEFAULT_ATTENDEES = ['张伟', '李娜', '王芳', '刘洋', '陈静', '杨帆', '赵磊', '孙悦']

function MeetingRoomCard(props: { data?: Record<string, any> }) {
  const data = props.data || {}
  const style = useCardStyle()
  const accentVar = { '--mc-accent': (THEMES[style.theme] || THEMES.brand).accent } as React.CSSProperties
  const [date, setDate] = React.useState<string>(data.defaultDate || '')
  const [start, setStart] = React.useState<string>(data.defaultStart || '09:00')
  const [end, setEnd] = React.useState<string>(data.defaultEnd || '10:00')
  const [room, setRoom] = React.useState<string>(data.defaultRoom || '')
  const [people, setPeople] = React.useState<string[]>([])
  const [done, setDone] = React.useState(false)

  const attendees: string[] = Array.isArray(data.attendees) && data.attendees.length ? data.attendees : DEFAULT_ATTENDEES
  const toggle = (p: string) => setPeople((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : prev.concat(p)))
  const submit = () => {
    setDone(true)
  }

  const isDouble = style.layout === 'double'
  const field = (label: string, node: React.ReactNode) =>
    React.createElement('div', { className: 'mc-field' }, React.createElement('label', { className: 'mc-label' }, label), node)

  const dateField = field('日期', React.createElement('input', { className: 'mc-input', type: 'date', value: date, onChange: (e: any) => setDate(e.target.value) }))
  const roomField = field('会议室号', React.createElement('input', { className: 'mc-input', type: 'text', placeholder: '例如 A301', value: room, onChange: (e: any) => setRoom(e.target.value) }))
  const startField = field('开始时间', React.createElement('input', { className: 'mc-input', type: 'time', value: start, onChange: (e: any) => setStart(e.target.value) }))
  const endField = field('结束时间', React.createElement('input', { className: 'mc-input', type: 'time', value: end, onChange: (e: any) => setEnd(e.target.value) }))

  return React.createElement('div', { className: 'mc-card', style: accentVar },
    React.createElement('div', { className: 'mc-card__head' },
      React.createElement('span', { className: 'mc-card__icon' }, svgCalendar()),
      React.createElement('div', null,
        React.createElement('p', { className: 'mc-card__title' }, '预定会议室'),
        React.createElement('p', { className: 'mc-card__sub' }, data.title || '填写信息完成预定'))),
    done
      ? React.createElement('div', { className: 'mc-done' },
          React.createElement('span', { className: 'mc-done__dot' }),
          React.createElement('div', { className: 'mc-done__text' },
            `已预定 ${room || '未填房间号'} 会议室 · ${date || '未填日期'} ${start}–${end} · ${people.length ? people.join('、') : '暂无参会人'}`))
      : React.createElement('div', null,
          isDouble ? React.createElement('div', { className: 'mc-row' }, dateField, roomField) : React.createElement('div', null, dateField, roomField),
          isDouble ? React.createElement('div', { className: 'mc-row' }, startField, endField) : React.createElement('div', null, startField, endField),
          field('参会人', React.createElement('div', { className: 'mc-chip-row' },
            attendees.map((p) => React.createElement('button', { key: p, className: 'mc-chip' + (people.includes(p) ? ' mc-chip--on' : ''), onClick: () => toggle(p) }, p)))),
          React.createElement('div', { className: 'mc-actions' },
            React.createElement('button', { className: 'mc-btn mc-btn--primary', onClick: submit }, '确认预定'),
            React.createElement('button', { className: 'mc-btn mc-btn--ghost', onClick: () => { setDate(''); setStart('09:00'); setEnd('10:00'); setRoom(''); setPeople([]) } }, '重置'))))
}

function StylePicker() {
  const style = useCardStyle()
  return React.createElement('div', null,
    React.createElement('div', { className: 'mc-panel' },
      React.createElement('p', { className: 'mc-panel__h' }, '主题风格'),
      React.createElement('div', { className: 'mc-seg' },
        Object.keys(THEMES).map((key) => React.createElement('button', {
          key,
          className: 'mc-seg__item' + (style.theme === key ? ' mc-seg__item--on' : ''),
          onClick: () => setStyle({ theme: key })
        }, React.createElement('span', { className: 'mc-swatch', style: { background: THEMES[key].accent } }), THEMES[key].name)))),
    React.createElement('div', { className: 'mc-panel', style: { marginTop: 12 } },
      React.createElement('p', { className: 'mc-panel__h' }, '输入框布局'),
      React.createElement('div', { className: 'mc-seg' },
        React.createElement('button', { className: 'mc-seg__item' + (style.layout === 'single' ? ' mc-seg__item--on' : ''), onClick: () => setStyle({ layout: 'single' }) }, '单列 · 每行一个输入框'),
        React.createElement('button', { className: 'mc-seg__item' + (style.layout === 'double' ? ' mc-seg__item--on' : ''), onClick: () => setStyle({ layout: 'double' }) }, '双列 · 一行两个输入框'))))
}

function SettingsPage() {
  return React.createElement('div', { className: 'mc-settings' },
    React.createElement('p', { className: 'mc-settings__intro' }, '定制会议室预定卡片的外观。输入“预定会议室”即可在对话中触发。'),
    React.createElement(StylePicker),
    React.createElement(MeetingRoomCard, { data: { title: '实时预览' } }))
}

function parseEnvelope(node: any): { card: string; data: any } | null {
  if (!node || node.kind !== 'tool-call') return null
  const root = node.data && node.data.root
  if (!root || root.kind !== 'tool-result') return null
  const call = root.call
  if (!call || call.name !== 'show_message_card') return null
  for (const b of root.content || []) {
    if (b && b.type === 'text' && typeof b.text === 'string' && b.text.startsWith('MC::')) {
      try { return JSON.parse(b.text.slice(4)) } catch { return null }
    }
  }
  return null
}

function TurnCard(props: { useSession: any; startSeq?: number; endSeq?: number }) {
  const { useSession, startSeq, endSeq } = props
  const order = useSession((s: any) => s.chat.order)
  const nodeStore = useSession((s: any) => s.chat.nodes)
  let card: { card: string; data: any } | null = null
  for (let i = (order || []).length - 1; i >= 0; i--) {
    const node = nodeStore.get(order[i])
    if (!node || typeof node.anchorSeq !== 'number') continue
    if (typeof startSeq === 'number' && node.anchorSeq < startSeq) continue
    if (typeof endSeq === 'number' && node.anchorSeq > endSeq) continue
    const parsed = parseEnvelope(node)
    if (parsed) { card = parsed; break }
  }
  if (!card) return null
  if (card.card === 'meeting_room') return React.createElement(MeetingRoomCard, { data: card.data })
  return null
}

export const apply = (ctx: Context) => {
  const slots = ctx.get('slots') as any
  if (!slots) return

  // ctx.styles.insert cleanup is fiber-owned; mirror via a plain global style tag here.
  if (typeof document !== 'undefined' && !document.getElementById('dsh-message-card-css')) {
    const el = document.createElement('style')
    el.id = 'dsh-message-card-css'
    el.textContent = CSS
    document.head.appendChild(el)
    ctx.effect(() => () => el.remove())
  }

  slots.inject('settings.section', () =>
    slots.register(
      { name: 'settings.section', id: 'message-cards', order: 18, label: '消息卡片' },
      () => React.createElement(SettingsPage)
    )
  )

  slots.inject('conversation.chat.turnTail', () =>
    slots.register(
      {
        name: 'conversation.chat.turnTail',
        select(owner: any) {
          const t = owner && owner.turn
          if (!t) return null
          return { startSeq: t.start ? t.start.seq : undefined, endSeq: t.end ? t.end.seq : undefined }
        }
      },
      (props: any) =>
        React.createElement(TurnCard, {
          useSession: props.useSession,
          startSeq: props.matched ? props.matched.startSeq : undefined,
          endSeq: props.matched ? props.matched.endSeq : undefined
        })
    )
  )
}
