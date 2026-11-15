import { descriptionFiles } from '../../../../../../hooks/shared/records/domain/services/description_files'
import type { EngineApi } from '../../../../../shared/engine_api'
import { NoteAttachment } from '../../../../core/widgets/note_attachment'

// A preview for each file the description links, gone once its link is.
export const DescriptionFiles = ({ engine, realm, text }: { engine: EngineApi; realm: string; text: string | null }) => {
  const files = descriptionFiles(text)
  if (files.length === 0) return null

  return (
    <div class="d-files">
      {files.map((file, index) => (
        <NoteAttachment key={`${index}:${file.path}`} engine={engine} realm={realm} path={file.path} name={file.name} embedded={file.isImage} />
      ))}
    </div>
  )
}

// A link on a line of its own at the end, for a box with no caret to use.
export const withFileLink = (text: string, markdown: string): string => `${text}${text === '' || text.endsWith('\n') ? '' : '\n'}${markdown}\n`
