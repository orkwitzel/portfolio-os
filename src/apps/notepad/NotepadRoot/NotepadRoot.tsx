import { useCallback, useMemo, useRef } from 'react'
import type { AppProps } from '@/store/session/sessionTypes'
import { AppMenuBar } from '@/components/shell/AppMenuBar'
import { ShellFilePicker } from '@/components/shell/ShellFilePicker'
import { useNotepadRoot } from './NotepadRoot.logic'
import { AppBody, NotepadField } from './NotepadRoot.style'
import { NotepadAboutDialog, NotepadFindDialog, NotepadReplaceDialog } from './NotepadDialogs'

export default function NotepadRoot(props: AppProps) {
  const fieldElRef = useRef<HTMLTextAreaElement | null>(null)
  const fieldAccess = useMemo(
    (): import('./NotepadRoot.logic').NotepadFieldAccess => ({
      get: () => fieldElRef.current,
    }),
    [],
  )
  const setFieldEl = useCallback((el: HTMLTextAreaElement | null) => {
    fieldElRef.current = el
  }, [])
  const vm = useNotepadRoot({ ...props, fieldAccess })

  return (
    <AppBody>
      <AppMenuBar menus={vm.menus} />
      <NotepadField
        key={vm.documentKey}
        ref={setFieldEl}
        className={vm.fieldClassName}
        spellCheck={false}
        defaultValue={vm.initialText}
        $wordWrap={vm.wordWrap}
        onInput={vm.markDirty}
      />
      {vm.pickerMode ? (
        <ShellFilePicker
          key={`${vm.pickerMode}-${vm.pickerInitialDir}`}
          open
          mode={vm.pickerMode}
          initialDir={vm.pickerInitialDir}
          defaultFileName={vm.pickerDefaultName}
          onSelect={vm.onPickerSelect}
          onCancel={vm.onPickerCancel}
        />
      ) : null}
      {vm.findOpen ? (
        <NotepadFindDialog
          value={vm.findInput}
          onChange={vm.setFindInput}
          onFind={vm.submitFind}
          onCancel={vm.closeFind}
        />
      ) : null}
      {vm.replaceOpen ? (
        <NotepadReplaceDialog
          findValue={vm.replaceFind}
          replaceValue={vm.replaceWith}
          onFindChange={vm.setReplaceFind}
          onReplaceChange={vm.setReplaceWith}
          onReplace={vm.submitReplace}
          onCancel={vm.closeReplace}
        />
      ) : null}
      {vm.aboutOpen ? <NotepadAboutDialog onClose={vm.closeAbout} /> : null}
    </AppBody>
  )
}
