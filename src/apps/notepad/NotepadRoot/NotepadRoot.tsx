import type { AppProps } from '@/store/session/sessionTypes'
import { useNotepadRoot } from './NotepadRoot.logic'
import { AppBody, NotepadField, PathLabel, ToolBtn, Toolbar } from './NotepadRoot.style'

export default function NotepadRoot(props: AppProps) {
  const vm = useNotepadRoot(props)

  return (
    <AppBody>
      <Toolbar>
        <ToolBtn type="button" onClick={() => void vm.save()}>
          Save
        </ToolBtn>
        <PathLabel>
          {vm.label}
          {vm.dirty ? ' *' : ''}
        </PathLabel>
      </Toolbar>
      <NotepadField
        className={vm.fieldClassName}
        spellCheck={false}
        value={vm.value}
        onChange={(e) => {
          vm.setValue(e.target.value)
          vm.setDirty(true)
        }}
      />
    </AppBody>
  )
}
