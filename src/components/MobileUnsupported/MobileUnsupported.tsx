import { Message, Panel, Screen, TitleBar } from './MobileUnsupported.style'

export function MobileUnsupported() {
  return (
    <Screen role="main">
      <Panel>
        <TitleBar>Portfolio OS</TitleBar>
        <Message>
          This app doesn&apos;t work on mobile. Please open it on a desktop or laptop
          browser.
        </Message>
      </Panel>
    </Screen>
  )
}
