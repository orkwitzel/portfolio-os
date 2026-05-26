import {
  Body,
  ButtonRow,
  Dialog,
  DialogBtn,
  Overlay,
  PromptField,
  TitleBar,
  TitleClose,
  TitleText,
} from '@/components/shell/ShellModal/ShellModal.style'
import styled from 'styled-components'

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  font: var(--font-size-ui) var(--font-ui);
`

const FieldLabel = styled.label`
  color: var(--text-primary);
`

type DialogShellProps = {
  title: string
  onCancel: () => void
  children: React.ReactNode
  actions: React.ReactNode
}

function DialogShell({ title, onCancel, children, actions }: DialogShellProps) {
  return (
    <Overlay
      role="presentation"
      data-shell-modal
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <Dialog role="dialog" onMouseDown={(e) => e.stopPropagation()}>
        <TitleBar>
          <TitleText>{title}</TitleText>
          <TitleClose type="button" aria-label="Close" onClick={onCancel}>
            ×
          </TitleClose>
        </TitleBar>
        <Body>{children}</Body>
        <ButtonRow>{actions}</ButtonRow>
      </Dialog>
    </Overlay>
  )
}

export function NotepadFindDialog({
  value,
  onChange,
  onFind,
  onCancel,
}: {
  value: string
  onChange: (v: string) => void
  onFind: () => void
  onCancel: () => void
}) {
  return (
    <DialogShell
      title="Find"
      onCancel={onCancel}
      actions={
        <>
          <DialogBtn type="button" $default onClick={onFind}>
            Find Next
          </DialogBtn>
          <DialogBtn type="button" onClick={onCancel}>
            Cancel
          </DialogBtn>
        </>
      }
    >
      <FieldRow>
        <FieldLabel htmlFor="notepad-find">Find what:</FieldLabel>
        <PromptField
          id="notepad-find"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onFind()
            }
          }}
          autoFocus
        />
      </FieldRow>
    </DialogShell>
  )
}

export function NotepadReplaceDialog({
  findValue,
  replaceValue,
  onFindChange,
  onReplaceChange,
  onReplace,
  onCancel,
}: {
  findValue: string
  replaceValue: string
  onFindChange: (v: string) => void
  onReplaceChange: (v: string) => void
  onReplace: () => void
  onCancel: () => void
}) {
  return (
    <DialogShell
      title="Replace"
      onCancel={onCancel}
      actions={
        <>
          <DialogBtn type="button" $default onClick={onReplace}>
            Replace
          </DialogBtn>
          <DialogBtn type="button" onClick={onCancel}>
            Cancel
          </DialogBtn>
        </>
      }
    >
      <FieldRow>
        <FieldLabel htmlFor="notepad-replace-find">Find what:</FieldLabel>
        <PromptField
          id="notepad-replace-find"
          value={findValue}
          onChange={(e) => onFindChange(e.target.value)}
          autoFocus
        />
        <FieldLabel htmlFor="notepad-replace-with">Replace with:</FieldLabel>
        <PromptField
          id="notepad-replace-with"
          value={replaceValue}
          onChange={(e) => onReplaceChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onReplace()
            }
          }}
        />
      </FieldRow>
    </DialogShell>
  )
}

export function NotepadAboutDialog({ onClose }: { onClose: () => void }) {
  return (
    <DialogShell
      title="About Notepad"
      onCancel={onClose}
      actions={
        <DialogBtn type="button" $default onClick={onClose}>
          OK
        </DialogBtn>
      }
    >
      <FieldRow>
        <p style={{ margin: 0 }}>Notepad</p>
        <p style={{ margin: 0 }}>OrkOS virtual text editor</p>
      </FieldRow>
    </DialogShell>
  )
}
