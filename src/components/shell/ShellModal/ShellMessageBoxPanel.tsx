import { useEffect, useRef, useState } from 'react'
import { ShellIcon } from '@/components/shell/ShellIcon'
import type { ShellModalRequest } from './ShellModal.types'
import {
  Body,
  ButtonRow,
  Dialog,
  DialogBtn,
  FieldGrid,
  FieldLabel,
  FieldValue,
  MessageIcon,
  MessageRow,
  MessageText,
  Overlay,
  PromptField,
  PropertiesHeader,
  PropertiesIcon,
  PropertiesName,
  Tab,
  TabPanel,
  TabRow,
  TitleBar,
  TitleClose,
  TitleText,
} from './ShellModal.style'

type ConfirmRequest = Extract<ShellModalRequest, { kind: 'confirm' }>
type PromptRequest = Extract<ShellModalRequest, { kind: 'prompt' }>
type PropertiesRequest = Extract<ShellModalRequest, { kind: 'properties' }>

export function ShellConfirmPanel({
  request,
  onClose,
}: {
  request: ConfirmRequest
  onClose: () => void
}) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    confirmRef.current?.focus()
  }, [])

  const finish = (value: boolean) => {
    request.resolve(value)
    onClose()
  }

  return (
    <Overlay
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) finish(false)
      }}
    >
      <Dialog role="alertdialog" aria-labelledby="shell-confirm-title" aria-describedby="shell-confirm-msg">
        <TitleBar>
          <TitleText id="shell-confirm-title">{request.title}</TitleText>
          <TitleClose type="button" aria-label="Close" onClick={() => finish(false)}>
            ×
          </TitleClose>
        </TitleBar>
        <Body>
          <MessageRow>
            <MessageIcon aria-hidden>?</MessageIcon>
            <MessageText id="shell-confirm-msg">{request.message}</MessageText>
          </MessageRow>
        </Body>
        <ButtonRow>
          <DialogBtn ref={confirmRef} type="button" $default onClick={() => finish(true)}>
            {request.confirmLabel}
          </DialogBtn>
          <DialogBtn type="button" onClick={() => finish(false)}>
            {request.cancelLabel}
          </DialogBtn>
        </ButtonRow>
      </Dialog>
    </Overlay>
  )
}

export function ShellPromptPanel({
  request,
  onClose,
}: {
  request: PromptRequest
  onClose: () => void
}) {
  const [value, setValue] = useState(request.defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const finish = (result: string | null) => {
    request.resolve(result)
    onClose()
  }

  return (
    <Overlay
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) finish(null)
      }}
    >
      <Dialog role="dialog" aria-labelledby="shell-prompt-title">
        <TitleBar>
          <TitleText id="shell-prompt-title">{request.title}</TitleText>
          <TitleClose type="button" aria-label="Close" onClick={() => finish(null)}>
            ×
          </TitleClose>
        </TitleBar>
        <Body>
          {request.message ? <MessageText>{request.message}</MessageText> : null}
          <PromptField
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finish(value)
              if (e.key === 'Escape') finish(null)
            }}
          />
        </Body>
        <ButtonRow>
          <DialogBtn type="button" $default onClick={() => finish(value)}>
            {request.confirmLabel}
          </DialogBtn>
          <DialogBtn type="button" onClick={() => finish(null)}>
            {request.cancelLabel}
          </DialogBtn>
        </ButtonRow>
      </Dialog>
    </Overlay>
  )
}

export function ShellPropertiesPanel({
  request,
  onClose,
}: {
  request: PropertiesRequest
  onClose: () => void
}) {
  const { props } = request
  const isShortcut = props.kind === 'shortcut'
  const typeLabel =
    props.kind === 'shortcut' ? 'Shortcut' : props.kind === 'folder' ? 'Folder' : 'File'

  return (
    <Overlay
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <Dialog role="dialog" aria-labelledby="shell-props-title">
        <TitleBar>
          <TitleText id="shell-props-title">{props.title}</TitleText>
          <TitleClose type="button" aria-label="Close" onClick={onClose}>
            ×
          </TitleClose>
        </TitleBar>
        <TabRow role="tablist">
          <Tab $active type="button" role="tab" aria-selected>
            General
          </Tab>
        </TabRow>
        <TabPanel>
          <PropertiesHeader>
            <PropertiesIcon>
              <ShellIcon source={props.icon} size="desktop" />
            </PropertiesIcon>
            <PropertiesName readOnly value={props.name} aria-readonly />
          </PropertiesHeader>
          <FieldGrid>
            <FieldLabel>Type:</FieldLabel>
            <FieldValue>{typeLabel}</FieldValue>
            <FieldLabel>Location:</FieldLabel>
            <FieldValue>{props.path}</FieldValue>
            {isShortcut && props.targetPath ? (
              <>
                <FieldLabel>Target:</FieldLabel>
                <FieldValue>{props.targetPath}</FieldValue>
              </>
            ) : null}
            {props.gridX != null && props.gridY != null ? (
              <>
                <FieldLabel>Position:</FieldLabel>
                <FieldValue>
                  ({props.gridX}, {props.gridY})
                </FieldValue>
              </>
            ) : null}
          </FieldGrid>
        </TabPanel>
        <ButtonRow>
          <DialogBtn type="button" $default onClick={onClose}>
            OK
          </DialogBtn>
          <DialogBtn type="button" onClick={onClose}>
            Cancel
          </DialogBtn>
        </ButtonRow>
      </Dialog>
    </Overlay>
  )
}
