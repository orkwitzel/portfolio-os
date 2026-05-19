import {
  Body,
  ButtonRow,
  Dialog,
  DialogBtn,
  FileBtn,
  FileList,
  FileRow,
  NameField,
  NameRow,
  NavBtn,
  Overlay,
  PathRow,
  TitleBar,
  TitleClose,
  TitleText,
} from './ShellFilePicker.style'
import { useShellFilePicker, type ShellFilePickerProps } from './ShellFilePicker.logic'

export default function ShellFilePicker(props: ShellFilePickerProps) {
  if (!props.open) return null

  return <ShellFilePickerOpen {...props} />
}

function ShellFilePickerOpen(props: ShellFilePickerProps) {
  const vm = useShellFilePicker(props)

  return (
    <Overlay
      role="presentation"
      data-shell-modal
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) vm.onCancel()
      }}
    >
      <Dialog role="dialog" aria-labelledby="shell-filepicker-title" onMouseDown={(e) => e.stopPropagation()}>
        <TitleBar>
          <TitleText id="shell-filepicker-title">{vm.title}</TitleText>
          <TitleClose type="button" aria-label="Close" onClick={vm.onCancel}>
            ×
          </TitleClose>
        </TitleBar>
        <PathRow>
          <NavBtn type="button" disabled={!vm.canGoUp} onClick={vm.goUp} aria-label="Up">
            ↑
          </NavBtn>
          <span>{vm.currentDir}</span>
        </PathRow>
        <Body>
          <FileList>
            {vm.loading ? (
              <FileRow>
                <FileBtn type="button" disabled>
                  Loading…
                </FileBtn>
              </FileRow>
            ) : !vm.entries || vm.entries.length === 0 ? (
              <FileRow>
                <FileBtn type="button" disabled>
                  (empty)
                </FileBtn>
              </FileRow>
            ) : (
              vm.entries.map((node) => (
                <FileRow key={node.path}>
                  <FileBtn
                    type="button"
                    $selected={vm.selectedPath === node.path}
                    onClick={() => vm.openEntry(node)}
                    onDoubleClick={() => {
                      if (node.kind === 'directory') return
                      vm.openEntry(node)
                      if (props.mode === 'open') vm.confirm()
                    }}
                  >
                    {node.kind === 'directory' ? `📁 ${node.name}` : `📄 ${node.name}`}
                  </FileBtn>
                </FileRow>
              ))
            )}
          </FileList>
          {props.mode === 'saveAs' ? (
            <NameRow>
              <label htmlFor="shell-filepicker-name">File name:</label>
              <NameField
                id="shell-filepicker-name"
                value={vm.fileName}
                onChange={(e) => vm.setFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && vm.canConfirm) {
                    e.preventDefault()
                    vm.confirm()
                  }
                }}
              />
            </NameRow>
          ) : null}
        </Body>
        <ButtonRow>
          <DialogBtn type="button" $default disabled={!vm.canConfirm} onClick={vm.confirm}>
            {props.mode === 'open' ? 'Open' : 'Save'}
          </DialogBtn>
          <DialogBtn type="button" onClick={vm.onCancel}>
            Cancel
          </DialogBtn>
        </ButtonRow>
      </Dialog>
    </Overlay>
  )
}
