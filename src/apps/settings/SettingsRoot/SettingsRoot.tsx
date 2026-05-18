import type { AppProps } from '@/store/session/sessionTypes'
import type { ColorSchemeId } from '@/theme/tokens'
import { useSettingsRoot, type SettingsSection } from './SettingsRoot.logic'
import {
  AppBody,
  BrowseBtn,
  ColorRow,
  ContentPane,
  FieldGroup,
  HexInput,
  Hint,
  Legend,
  NavButton,
  NavItem,
  NavList,
  NavPane,
  OptionRow,
  SchemePreview,
  SectionTitle,
} from './SettingsRoot.style'

const SECTIONS: { id: SettingsSection; label: string }[] = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'display', label: 'Display' },
]

export default function SettingsRoot(props: AppProps) {
  const vm = useSettingsRoot(props)

  return (
    <AppBody>
      <NavPane>
        <NavList>
          {SECTIONS.map(({ id, label }) => (
            <NavItem key={id}>
              <NavButton
                type="button"
                $active={vm.section === id}
                onClick={() => vm.setSection(id)}
              >
                {label}
              </NavButton>
            </NavItem>
          ))}
        </NavList>
      </NavPane>

      <ContentPane>
        {vm.section === 'appearance' && (
          <>
            <SectionTitle>Appearance</SectionTitle>
            <FieldGroup>
              <Legend>Color scheme</Legend>
              {vm.colorSchemes.map(({ id, label }) => {
                const preview = vm.schemePreviews.find((p) => p.id === id)
                return (
                  <OptionRow key={id}>
                    <input
                      type="radio"
                      name="colorScheme"
                      checked={vm.settings.colorScheme === id}
                      onChange={() => vm.onColorScheme(id as ColorSchemeId)}
                    />
                    {preview && (
                      <SchemePreview $from={preview.from} $to={preview.to} />
                    )}
                    <span>{label}</span>
                  </OptionRow>
                )
              })}
            </FieldGroup>

            <FieldGroup>
              <Legend>Cursor</Legend>
              <OptionRow>
                <input
                  type="radio"
                  name="cursorMode"
                  checked={vm.settings.cursorMode === 'winxp'}
                  onChange={() => vm.onCursorMode('winxp')}
                />
                <span>Windows XP (in-app)</span>
              </OptionRow>
              <OptionRow>
                <input
                  type="radio"
                  name="cursorMode"
                  checked={vm.settings.cursorMode === 'system'}
                  onChange={() => vm.onCursorMode('system')}
                />
                <span>System default</span>
              </OptionRow>
            </FieldGroup>
          </>
        )}

        {vm.section === 'display' && (
          <>
            <SectionTitle>Display</SectionTitle>
            <FieldGroup>
              <Legend>Desktop wallpaper</Legend>
              <ColorRow>
                <input
                  type="color"
                  value={vm.wallpaperHex}
                  onChange={(e) => vm.onWallpaperColor(e.target.value)}
                  aria-label="Wallpaper color"
                />
                <HexInput
                  type="text"
                  value={vm.wallpaperHex}
                  onChange={(e) => vm.onWallpaperColor(e.target.value)}
                  spellCheck={false}
                />
                <BrowseBtn type="button" disabled title="Image wallpapers coming soon">
                  Browse…
                </BrowseBtn>
              </ColorRow>
              <Hint>Image wallpapers coming soon.</Hint>
            </FieldGroup>

            <FieldGroup>
              <Legend>Font size</Legend>
              {vm.fontSizes.map(({ id, label }) => (
                <OptionRow key={id}>
                  <input
                    type="radio"
                    name="fontSize"
                    checked={vm.settings.fontSize === id}
                    onChange={() => vm.onFontSize(id)}
                  />
                  <span>
                    {label} ({id === 'small' ? '10' : id === 'medium' ? '11' : '13'}px)
                  </span>
                </OptionRow>
              ))}
            </FieldGroup>
          </>
        )}
      </ContentPane>
    </AppBody>
  )
}
