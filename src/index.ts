import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'message-card'

/** The single model-facing tool. The model calls it when the user wants a supported card. */
export const apply = (ctx: Context) => {
  const tool = defineTool({
    name: 'show_message_card',
    description:
      'Render an interactive meeting-room booking card in the conversation when the user intends to book a meeting room. Call this tool instead of answering in plain text.',
    parameters: {
      type: 'object',
      additionalProperties: true,
      properties: {
        card: { type: 'string', const: 'meeting_room', description: 'Only meeting_room is supported.' },
        data: {
          type: 'object',
          additionalProperties: true,
          description:
            'Optional payload: { title, defaultDate, defaultStart, defaultEnd, defaultRoom, attendees }. attendees is a string[] of participant names.'
        }
      },
      required: ['card']
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          card: { type: 'string', required: true },
          data: { type: 'json', required: true }
        }
      },
      render: (_args, value) => {
        const data = value && value.data && typeof value.data === 'object' ? value.data : {}
        const envelope = JSON.stringify({ card: 'meeting_room', data })
        return [
          { type: 'text', text: '【预定会议室卡片】已生成，请在下方卡片中完成操作。' },
          { type: 'text', text: 'MC::' + envelope }
        ]
      }
    },
    async execute(args) {
      const data = args && args.data && typeof args.data === 'object' ? args.data : {}
      return { card: 'meeting_room', data }
    }
  })

  const disposer = ctx.tools.register(tool)
  ctx.effect(() => disposer)

  // Client -> Host: record a card submission as small owned data.
  ctx.handle('mc_submit', async (payload: unknown) => ({ ok: true, received: payload }))
}
