import styled, { css } from 'styled-components'

const FONT = 'var(--font-ui)'
const TEXT = '13px'
const TEXT_SM = '12px'
const HEADING = 'bold 18px'
const SUBHEAD = 'bold 14px'

export type PanelAccent = 'teal' | 'blue' | 'purple' | 'green' | 'amber'

const panelThemes: Record<PanelAccent, { header: [string, string]; body: string }> = {
  teal: { header: ['#008080', '#40c0c0'], body: '#f0fffe' },
  blue: { header: ['#000080', '#1084d0'], body: '#f0f4ff' },
  purple: { header: ['#800080', '#c060c0'], body: '#faf0ff' },
  green: { header: ['#006000', '#40a040'], body: '#f0fff0' },
  amber: { header: ['#804000', '#c08040'], body: '#fff8f0' },
}

const panelHeader = (from: string, to: string) => css`
  background: linear-gradient(90deg, ${from}, ${to});
`

const retroEase = '0.15s ease'
const CONTENT_MAX = '1000px'
const dropSm = '1px 2px 5px rgba(0, 0, 0, 0.14)'
const dropMd = '2px 4px 10px rgba(0, 0, 0, 0.18)'
const dropLg = '3px 6px 14px rgba(0, 0, 0, 0.22)'
const dropLift = '3px 3px 0 rgba(0, 0, 0, 0.12)'

export const AppBody = styled.div`
  --pf-text: ${TEXT};
  --pf-text-sm: ${TEXT_SM};
  --pf-heading: ${HEADING};
  --pf-subhead: ${SUBHEAD};

  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  font: var(--pf-text) / 1.45 ${FONT};
  color: #000;
  background: linear-gradient(160deg, #b8d4e8 0%, #c0c0c0 35%, #d8c8e8 100%);
`

export const SiteBanner = styled.header`
  flex-shrink: 0;
  padding: 8px 12px;
  border-bottom: 2px solid #404080;
  background: linear-gradient(90deg, #000080 0%, #1084d0 45%, #008080 100%);
  color: #fff;
  text-align: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
`

export const BannerTitle = styled.h1`
  margin: 0;
  font: var(--pf-heading) ${FONT};
`

export const BannerSub = styled.p`
  margin: 2px 0 0;
  font: var(--pf-text) ${FONT};
  color: #d0f0ff;
`

export const HeroPanel = styled.div`
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: min(${CONTENT_MAX}, calc(100% - 20px));
  max-width: ${CONTENT_MAX};
  margin: 10px auto 0;
  padding: 14px 16px;
  border: 2px inset #c0c0c0;
  background: linear-gradient(135deg, #fff8e8 0%, #f0f8ff 50%, #f5f0ff 100%);
  box-shadow:
    inset 1px 1px 0 #fff,
    ${dropMd};
  transition: box-shadow ${retroEase};

  &:hover {
    box-shadow:
      inset 1px 1px 0 #fff,
      0 0 0 1px #1084d0,
      ${dropLg};
  }

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: center;
  }
`

export const PortraitFrame = styled.div`
  flex-shrink: 0;
  width: 128px;
  height: 128px;
  padding: 3px;
  border: 3px solid #000080;
  background: linear-gradient(135deg, #1084d0, #800080);
  overflow: hidden;
  box-shadow: ${dropMd};
  transition:
    transform ${retroEase},
    filter ${retroEase},
    box-shadow ${retroEase};

  ${HeroPanel}:hover & {
    box-shadow: ${dropLg};
  }

  ${HeroPanel}:hover & {
    transform: scale(1.02);
    filter: brightness(1.05);
  }
`

export const Portrait = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border: 1px solid #fff;
`

export const HeroMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 10px;

  @media (max-width: 560px) {
    align-items: stretch;
    width: 100%;
  }
`

export const Tagline = styled.p`
  margin: 0;
  font: var(--pf-subhead) ${FONT};
  color: #000080;
  line-height: 1.35;
  max-width: 52ch;
`

export const AwardNote = styled.p`
  margin: 0;
  padding: 4px 10px;
  border: 2px inset #c0a000;
  background: linear-gradient(180deg, #fffacd, #ffe680);
  font: var(--pf-text-sm) ${FONT};
  color: #804000;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: ${dropSm};
  transition:
    background ${retroEase},
    border-color ${retroEase},
    transform ${retroEase},
    box-shadow ${retroEase};

  &:hover {
    background: linear-gradient(180deg, #fff8dc, #ffd700);
    border-color: #ff8c00;
    transform: translateY(-1px);
    box-shadow: ${dropMd};
  }
`

export const InlineIcon = styled.span`
  font: 14px/1 ${FONT};
`

export const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
`

export const StatBox = styled.div`
  padding: 6px 10px 4px;
  border: 2px inset #c0c0c0;
  background: #fff;
  text-align: center;
  min-width: 72px;
  box-shadow: ${dropSm};
  transition:
    border-style ${retroEase},
    background ${retroEase},
    transform ${retroEase},
    box-shadow ${retroEase};
  cursor: default;

  &:nth-child(1) {
    border-color: #008080;
    background: #e8ffff;
  }

  &:nth-child(2) {
    border-color: #000080;
    background: #e8e8ff;
  }

  &:nth-child(3) {
    border-color: #800080;
    background: #ffe8ff;
  }

  &:hover {
    border-style: outset;
    transform: translateY(-2px);
    box-shadow:
      ${dropLift},
      ${dropMd};
  }
`

export const StatIcon = styled.div`
  font: 16px/1 ${FONT};
  margin-bottom: 2px;
  text-align: center;
  color: #000080;

  ${StatBox}:nth-child(1) & {
    color: #008080;
  }

  ${StatBox}:nth-child(3) & {
    color: #800080;
  }
`

export const StatValue = styled.div`
  font: bold 14px/1.1 ${FONT};
  color: #000080;

  ${StatBox}:nth-child(1) & {
    color: #008080;
  }

  ${StatBox}:nth-child(2) & {
    color: #000080;
  }

  ${StatBox}:nth-child(3) & {
    color: #800080;
  }
`

export const StatLabel = styled.div`
  font: var(--pf-text-sm) ${FONT};
  color: #404040;
  margin-top: 2px;
`

export const Toolbar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  padding-top: 8px;
  margin-top: 2px;
  border-top: 1px solid #808080;
`

export const ToolbarBtn = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px 4px 6px;
  border: 2px outset #c0c0c0;
  background: #c0c0c0;
  font: var(--pf-text) ${FONT};
  color: #000;
  cursor: pointer;
  box-shadow: ${dropSm};
  transition:
    background ${retroEase},
    border-color ${retroEase},
    color ${retroEase},
    transform ${retroEase},
    box-shadow ${retroEase};

  &:hover {
    background: #dfdfdf;
    border-color: #fff #404040 #404040 #fff;
    color: #000080;
    transform: translateY(-1px);
    box-shadow: ${dropMd};
  }

  &:active {
    border-style: inset;
    transform: translateY(0);
    box-shadow: none;
  }
`

export const ToolbarIconFrame = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  overflow: hidden;
  border: 1px solid #808080;
  background: #fff;
`

export const PixelIcon = styled.img`
  display: block;
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`

export const NerdGlyph = styled.span`
  display: block;
  font: 15px/18px ${FONT};
  text-align: center;
  width: 18px;
`

export const ContentGrid = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 10px;
  width: min(${CONTENT_MAX}, calc(100% - 20px));
  max-width: ${CONTENT_MAX};
  margin: 0 auto;
  padding: 10px;
  align-items: start;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`

export const SideColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`

export const Panel = styled.section`
  border: 2px groove #c0c0c0;
  background: #c0c0c0;
  box-shadow: ${dropMd};
`

export const PanelHeader = styled.h3<{ $accent?: PanelAccent }>`
  margin: 0;
  padding: 5px 10px;
  font: var(--pf-subhead) ${FONT};
  color: #fff;
  border-bottom: 1px solid #404040;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  gap: 6px;
  ${(p) => {
    const theme = panelThemes[p.$accent ?? 'blue']
    return panelHeader(theme.header[0], theme.header[1])
  }}
`

export const PanelHeaderIcon = styled.span`
  font: 15px/1 ${FONT};
  opacity: 0.95;
`

export const PanelBody = styled.div<{ $accent?: PanelAccent }>`
  padding: 10px 12px 12px;
  background: ${(p) => panelThemes[p.$accent ?? 'blue'].body};
`

export const Summary = styled.p`
  margin: 0;
  font: var(--pf-text) / 1.5 ${FONT};
`

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const JobCard = styled.article`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  padding: 8px;
  border: 2px inset #c0c0c0;
  background: #fff;
  box-shadow: ${dropSm};
  transition:
    background ${retroEase},
    border-color ${retroEase},
    box-shadow ${retroEase};

  &:hover {
    background: #fffffe;
    border-style: outset;
    box-shadow:
      ${dropLift},
      ${dropMd};
  }
`

export const JobBadge = styled.div<{ $badge: string }>`
  width: 44px;
  height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 2px outset #c0c0c0;
  color: #fff;
  font: bold 9px/1 ${FONT};
  text-align: center;
  padding: 4px 2px;
  background: ${(p) =>
    p.$badge === 'OSS'
      ? 'linear-gradient(180deg, #008000, #40c040)'
      : 'linear-gradient(180deg, #000080, #1084d0)'};
  transition: transform ${retroEase}, filter ${retroEase};

  ${JobCard}:hover & {
    transform: scale(1.06);
    filter: brightness(1.1);
  }
`

export const JobBadgeIcon = styled.span`
  font: 14px/1 ${FONT};
`

export const JobContent = styled.div`
  min-width: 0;
`

export const JobHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: baseline;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 6px;
`

export const JobTitle = styled.strong`
  font: var(--pf-subhead) ${FONT};
  color: #000080;
`

export const JobOrg = styled.span`
  font: var(--pf-text) ${FONT};
  color: #404040;
`

export const JobPeriod = styled.span`
  font: var(--pf-text-sm) ${FONT};
  color: #800000;
`

export const BulletList = styled.ul`
  margin: 0;
  padding-left: 18px;
  font: var(--pf-text) / 1.45 ${FONT};

  li {
    margin-bottom: 4px;
  }

  li:last-child {
    margin-bottom: 0;
  }

  li::marker {
    color: #1084d0;
  }
`

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`

export const ProjectCard = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 2px outset #c0c0c0;
  background: #fff;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  box-shadow: ${dropSm};
  transition:
    border-color ${retroEase},
    box-shadow ${retroEase},
    transform ${retroEase};

  &:hover {
    border-color: #000080 #404040 #404040 #000080;
    box-shadow:
      3px 3px 0 rgba(0, 0, 128, 0.2),
      ${dropLg};
    transform: translate(-1px, -1px);
  }

  &:hover img {
    filter: brightness(1.08) saturate(1.05);
    transform: scale(1.03);
  }

  &:hover strong {
    color: #1084d0;
    text-decoration: underline;
  }

  &:hover [data-repo-label] {
    color: #000080;
  }

  &:active {
    border-style: inset;
    transform: translate(0, 0);
    box-shadow: none;
  }
`

export const ProjectThumb = styled.div`
  height: 96px;
  overflow: hidden;
  background: linear-gradient(135deg, #404080, #804080);
  border-bottom: 2px inset #c0c0c0;
`

export const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter ${retroEase}, transform ${retroEase};
`

export const ProjectThumbFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #24292e, #000080);
  color: #80c0ff;
  font: bold 18px ${FONT};
`

export const ProjectBody = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  background: #fff;
`

export const ProjectName = styled.strong`
  font: var(--pf-subhead) ${FONT};
  color: #000080;
  transition: color ${retroEase};
`

export const ProjectDesc = styled.span`
  font: var(--pf-text-sm) / 1.35 ${FONT};
  color: #000;
`

export const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`

export const ProjectTag = styled.span`
  padding: 1px 6px;
  border: 1px solid #808080;
  font: var(--pf-text-sm) ${FONT};
  color: #000;

  &:nth-child(3n + 1) {
    background: #e0f0ff;
    border-color: #4080c0;
  }

  &:nth-child(3n + 2) {
    background: #e8ffe8;
    border-color: #408040;
  }

  &:nth-child(3n) {
    background: #ffe8f8;
    border-color: #c04080;
  }
`

export const ProjectFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 4px;
  border-top: 1px solid #c0c0c0;
  font: var(--pf-text-sm) ${FONT};
  color: #404040;
  transition: color ${retroEase};

  span {
    transition: color ${retroEase};
  }
`

export const ProjectOpenHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  opacity: 0;
  transition: opacity ${retroEase};

  button:hover & {
    opacity: 1;
  }
`

export const ProjectGithubIcon = styled.span`
  font: 16px/1 ${FONT};
  color: #000;
`

export const SkillGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px;
`

export const SkillChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px 3px 4px;
  border: 2px outset #c0c0c0;
  background: #fff;
  font: var(--pf-text-sm) ${FONT};
  cursor: default;
  box-shadow: ${dropSm};
  transition:
    background ${retroEase},
    border-style ${retroEase},
    transform ${retroEase},
    box-shadow ${retroEase};

  &:nth-child(4n + 1) {
    background: #fff8e8;
  }

  &:nth-child(4n + 2) {
    background: #e8f4ff;
  }

  &:nth-child(4n + 3) {
    background: #f0ffe8;
  }

  &:nth-child(4n) {
    background: #ffe8f4;
  }

  &:hover {
    border-style: outset;
    transform: translateY(-2px);
    box-shadow:
      ${dropLift},
      ${dropMd};
    background: #fff;
  }
`

export const SkillIcon = styled.img`
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`

export const SkillIconFallback = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #808080;
  background: #ece9d8;
  font: bold 9px ${FONT};
  color: #404040;
`

export const LanguageList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  font: var(--pf-text) / 1.45 ${FONT};

  li {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    margin-bottom: 6px;
    padding: 4px 6px;
    border: 1px solid transparent;
    text-align: left;
    transition:
      background ${retroEase},
      border-color ${retroEase};

    &:hover {
      background: rgba(255, 255, 255, 0.6);
      border-color: #c08040;
    }
  }

  li:last-child {
    margin-bottom: 0;
  }
`

export const LanguageIcon = styled.span`
  font: 14px/1 ${FONT};
  color: #c08040;
  flex-shrink: 0;
`

export const LanguageLevel = styled.span`
  color: #006060;
`
