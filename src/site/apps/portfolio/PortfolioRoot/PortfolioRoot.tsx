import type { AppProps } from '@/store/session/sessionTypes'
import type { PanelAccent } from './PortfolioRoot.style'
import { GithubNerdIcon, NerdDecor, ProjectThumbnail, SkillIconImg, ToolbarIcon } from './PortfolioRoot.icons'
import { panelHeaderIcons, usePortfolioRoot } from './PortfolioRoot.logic'
import { nerd } from '@/utils/nerdIcons'
import {
  AppBody,
  AwardNote,
  BannerSub,
  BannerTitle,
  BulletList,
  ContentGrid,
  HeroMain,
  HeroPanel,
  InlineIcon,
  JobBadge,
  JobBadgeIcon,
  JobCard,
  JobContent,
  JobHeader,
  JobOrg,
  JobPeriod,
  JobTitle,
  LanguageIcon,
  LanguageLevel,
  LanguageList,
  MainColumn,
  Panel,
  PanelBody,
  PanelHeader,
  PanelHeaderIcon,
  Portrait,
  PortraitFrame,
  ProjectBody,
  ProjectCard,
  ProjectDesc,
  ProjectFooter,
  ProjectGrid,
  ProjectName,
  ProjectOpenHint,
  ProjectTag,
  ProjectTags,
  SideColumn,
  SiteBanner,
  SkillChip,
  SkillGrid,
  StatBox,
  StatIcon,
  StatLabel,
  StatsRow,
  StatValue,
  Summary,
  Tagline,
  Timeline,
  Toolbar,
  ToolbarBtn,
} from './PortfolioRoot.style'

const jobBadgeIcons: Record<string, string> = {
  Navy: nerd.ship,
  OSS: nerd.code,
}

function PanelTitle({ accent, children }: { accent: PanelAccent; children: string }) {
  return (
    <PanelHeader $accent={accent}>
      <PanelHeaderIcon>{panelHeaderIcons[accent]}</PanelHeaderIcon>
      {children}
    </PanelHeader>
  )
}

export default function PortfolioRoot(props: AppProps) {
  const vm = usePortfolioRoot(props)
  const { profile } = vm

  return (
    <AppBody>
      <SiteBanner>
        <BannerTitle>{profile.name}</BannerTitle>
        <BannerSub>{profile.title}</BannerSub>
      </SiteBanner>

      <HeroPanel>
        <PortraitFrame>
          <Portrait src={vm.portraitUrl} alt={profile.name} />
        </PortraitFrame>
        <HeroMain>
          <Tagline>{profile.tagline}</Tagline>
          <AwardNote>
            <InlineIcon>{nerd.trophy}</InlineIcon>
            {profile.award}
          </AwardNote>
          <StatsRow>
            {profile.stats.map((stat) => (
              <StatBox key={stat.label}>
                <StatIcon>{stat.icon}</StatIcon>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatBox>
            ))}
          </StatsRow>
          <Toolbar aria-label="Contact links">
            {vm.toolbarItems.map((item) => (
              <ToolbarBtn key={item.id} type="button" onClick={item.action}>
                <ToolbarIcon id={item.id} icon={item.icon} />
                {item.label}
              </ToolbarBtn>
            ))}
          </Toolbar>
        </HeroMain>
      </HeroPanel>

      <ContentGrid>
        <MainColumn>
          <Panel>
            <PanelTitle accent="teal">About</PanelTitle>
            <PanelBody $accent="teal">
              <Summary>{profile.summary}</Summary>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelTitle accent="blue">Experience</PanelTitle>
            <PanelBody $accent="blue">
              <Timeline>
                {profile.experience.map((role) => (
                  <JobCard key={`${role.organization}-${role.period}`}>
                    <JobBadge $badge={role.badge}>
                      <JobBadgeIcon>{jobBadgeIcons[role.badge] ?? nerd.briefcase}</JobBadgeIcon>
                      {role.badge}
                    </JobBadge>
                    <JobContent>
                      <JobHeader>
                        <JobTitle>{role.title}</JobTitle>
                        <JobOrg>— {role.organization}</JobOrg>
                        <JobPeriod>{role.period}</JobPeriod>
                      </JobHeader>
                      <BulletList>
                        {role.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </BulletList>
                    </JobContent>
                  </JobCard>
                ))}
              </Timeline>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelTitle accent="purple">Projects</PanelTitle>
            <PanelBody $accent="purple">
              <ProjectGrid>
                {profile.projects.map((project) => (
                  <ProjectCard
                    key={project.url}
                    type="button"
                    onClick={() => vm.openLink(project.url)}
                  >
                    <ProjectThumbnail imageUrl={project.imageUrl} />
                    <ProjectBody>
                      <ProjectName>{project.name}</ProjectName>
                      <ProjectDesc>{project.description}</ProjectDesc>
                      <ProjectTags>
                        {project.tags.map((tag) => (
                          <ProjectTag key={tag}>{tag}</ProjectTag>
                        ))}
                      </ProjectTags>
                      <ProjectFooter>
                        <span data-repo-label>{project.repo}</span>
                        <ProjectOpenHint>
                          <NerdDecor glyph={nerd.link} size={12} />
                          <GithubNerdIcon />
                        </ProjectOpenHint>
                      </ProjectFooter>
                    </ProjectBody>
                  </ProjectCard>
                ))}
              </ProjectGrid>
            </PanelBody>
          </Panel>
        </MainColumn>

        <SideColumn>
          <Panel>
            <PanelTitle accent="green">Tech stack</PanelTitle>
            <PanelBody $accent="green">
              <SkillGrid>
                {profile.skillTags.map((skill) => (
                  <SkillChip key={skill.name}>
                    <SkillIconImg name={skill.name} iconUrl={skill.iconUrl} />
                    {skill.name}
                  </SkillChip>
                ))}
              </SkillGrid>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelTitle accent="amber">Languages</PanelTitle>
            <PanelBody $accent="amber">
              <LanguageList>
                {profile.languages.map((lang) => (
                  <li key={lang.name}>
                    <LanguageIcon>{nerd.globe}</LanguageIcon>
                    <span>
                      <strong>{lang.name}</strong>
                      {' — '}
                      <LanguageLevel>{lang.level}</LanguageLevel>
                    </span>
                  </li>
                ))}
              </LanguageList>
            </PanelBody>
          </Panel>
        </SideColumn>
      </ContentGrid>
    </AppBody>
  )
}
