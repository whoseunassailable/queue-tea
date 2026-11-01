import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { brewNow } from '../state_management/errands_controller'

export async function drawBrew($: EngineInterface, c: MenuContext): Promise<RenderElement> {
  const { e, p, Box, Text, hints, top, bar } = c
  const field =
    e.surface === 'mobile' ? (
      <Text>Type /brew and your request at the prompt.</Text>
    ) : (
      (() => {
        const { Input } = $.ui.resolve(e as RenderInput<'Pane', 'terminal'>)

        return (
          <Input
            key="brew"
            label="Brew"
            placeholder="start the dev server and tell me its URL"
            submitLabel="Brew"
            autoFocus
            onSubmit={value => void brewNow(p, value)}
          />
        )
      })()
    )

  return (
    <Box flexDirection="column">
      {top}
      {bar('suggestion', '~ Brew now')}
      <Text dimColor>Claude does it right away, outside the queue: no task, the same branch and conversation.</Text>
      {field}
      {hints}
    </Box>
  )
}
