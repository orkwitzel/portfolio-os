import { useCallback, useMemo } from 'react'
import type { AppProps } from '@/store/session/sessionTypes'
import { faviconUrl } from '@/components/shell/ShellIcon/favicon'
import { useOs } from '@/hooks/useOs'
import { nerd } from '@/utils/nerdIcons'
import { openExternalLink } from '@/utils/openExternalLink'
import portraitUrl from '@/site/content/portfolio/portrait.png?url'

export const panelHeaderIcons = {
  teal: nerd.user,
  blue: nerd.briefcase,
  purple: nerd.folder,
  green: nerd.code,
  amber: nerd.globe,
} as const

export type ToolbarIconSource =
  | { kind: 'favicon'; url: string }
  | { kind: 'nerd'; glyph: string }

export type ToolbarItem = {
  id: string
  label: string
  icon: ToolbarIconSource
  action: () => void
}

export type PortfolioProject = {
  name: string
  description: string
  url: string
  repo: string
  imageUrl: string
  tags: string[]
}

export type PortfolioRole = {
  title: string
  organization: string
  period: string
  badge: string
  highlights: string[]
}

export type SkillTag = {
  name: string
  iconUrl: string
}

export type LanguageEntry = {
  name: string
  level: string
}

export type PortfolioProfile = {
  name: string
  title: string
  tagline: string
  award: string
  summary: string
  email: string
  linkedIn: string
  github: string
  stats: { label: string; value: string; icon: string }[]
  experience: PortfolioRole[]
  projects: PortfolioProject[]
  skillTags: SkillTag[]
  languages: LanguageEntry[]
}

function githubOgImage(repo: string): string {
  return `https://opengraph.githubassets.com/1/${repo}`
}

function skillIcon(slug: string, color: string): string {
  return `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`
}

export const portfolioProfile: PortfolioProfile = {
  name: 'Or Kwitzel',
  title: 'Full-Stack Developer',
  tagline: 'Building resilient systems & polished web experiences',
  award: 'Israeli Presidential Military Award — 2025',
  summary:
    'Full-Stack Developer with 7+ years of experience, including 3+ years delivering mission-critical military software. I specialize in scalable backend systems, modern web apps, and shipping under pressure.',
  email: 'orkwitzel@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/or-kwitzel-83294b2b4/',
  github: 'https://github.com/orkwitzel',
  stats: [
    { label: 'Years coding', value: '7+', icon: nerd.code },
    { label: 'Military software', value: '3+ yrs', icon: nerd.terminal },
    { label: 'Open source', value: 'Active', icon: nerd.rocket },
  ],
  experience: [
    {
      title: 'Software Developer',
      organization: 'Israeli Navy — Submarine Unit',
      period: '2022 – 2025',
      badge: 'Navy',
      highlights: [
        'Presidential Military Award — only Navy programmer honored in 2025',
        'Mission-critical backend systems for complex operational workflows',
        'End-to-end ownership from architecture through production deployment',
        'International operations support including deployments in Germany',
      ],
    },
    {
      title: 'Full-Stack Developer',
      organization: 'Personal & Open Source',
      period: '2018 – Present',
      badge: 'OSS',
      highlights: [
        'Production apps with React, Svelte, Vue, Node, Go, Kotlin, and more',
        'Microservices, caching, message-driven architectures across stacks',
        'Maintained open-source projects on GitHub',
      ],
    },
  ],
  projects: [
    {
      name: 'portfolio-os',
      description: 'This site — a Win95-style desktop shell with window management and a virtual filesystem.',
      url: 'https://github.com/orkwitzel/portfolio-os',
      repo: 'orkwitzel/portfolio-os',
      imageUrl: githubOgImage('orkwitzel/portfolio-os'),
      tags: ['React', 'TypeScript', 'Vite'],
    },
    {
      name: 'dungeon-mcp',
      description: 'Procedurally generated text roguelike exposed as an MCP server for AI agents.',
      url: 'https://github.com/orkwitzel/dungeon-mcp',
      repo: 'orkwitzel/dungeon-mcp',
      imageUrl: githubOgImage('orkwitzel/dungeon-mcp'),
      tags: ['MCP', 'TypeScript', 'Roguelike'],
    },
    {
      name: 'anonchat',
      description: 'Anonymous, ephemeral chat rooms with a Go backend.',
      url: 'https://github.com/orkwitzel/anonchat',
      repo: 'orkwitzel/anonchat',
      imageUrl: githubOgImage('orkwitzel/anonchat'),
      tags: ['Go', 'WebSocket', 'Chat'],
    },
    {
      name: 'tracer',
      description: 'Terminal UI to browse, inspect, resume, and delete Claude/Codex/Gemini sessions.',
      url: 'https://github.com/orkwitzel/tracer',
      repo: 'orkwitzel/tracer',
      imageUrl: githubOgImage('orkwitzel/tracer'),
      tags: ['Go', 'TUI', 'Developer tools'],
    },
    {
      name: 'instruction-conflict-benchmark',
      description: 'Benchmark measuring how LLMs resolve prompts with conflicting instructions.',
      url: 'https://github.com/orkwitzel/instruction-conflict-benchmark',
      repo: 'orkwitzel/instruction-conflict-benchmark',
      imageUrl: githubOgImage('orkwitzel/instruction-conflict-benchmark'),
      tags: ['Python', 'LLM', 'Research'],
    },
    {
      name: 'apotheosis',
      description: 'Full-stack tabletop RPG session manager for game masters and players.',
      url: 'https://github.com/orkwitzel/apotheosis',
      repo: 'orkwitzel/apotheosis',
      imageUrl: githubOgImage('orkwitzel/apotheosis'),
      tags: ['TypeScript', 'Full-stack', 'Games'],
    },
    {
      name: 'cios',
      description: 'FOSS chat app to talk with people around the world — built with Svelte.',
      url: 'https://github.com/orkwitzel/cios',
      repo: 'orkwitzel/cios',
      imageUrl: githubOgImage('orkwitzel/cios'),
      tags: ['Svelte', 'Chat', 'Real-time'],
    },
    {
      name: 'YourTable',
      description: 'Desktop study timer and schedule planner (IB Computer Science IA).',
      url: 'https://github.com/orkwitzel/YourTable',
      repo: 'orkwitzel/YourTable',
      imageUrl: githubOgImage('orkwitzel/YourTable'),
      tags: ['C#', 'Desktop', 'Productivity'],
    },
    {
      name: 'HMI-Demo',
      description: 'Army HMI testing framework for hardware-in-the-loop validation.',
      url: 'https://github.com/Elor170/HMI-Demo',
      repo: 'Elor170/HMI-Demo',
      imageUrl: githubOgImage('Elor170/HMI-Demo'),
      tags: ['Testing', 'HMI', 'Defense'],
    },
  ],
  skillTags: [
    { name: 'TypeScript', iconUrl: skillIcon('typescript', '3178C6') },
    { name: 'React', iconUrl: skillIcon('react', '61DAFB') },
    { name: 'Svelte', iconUrl: skillIcon('svelte', 'FF3E00') },
    { name: 'Node.js', iconUrl: skillIcon('nodedotjs', '339933') },
    { name: 'Go', iconUrl: skillIcon('go', '00ADD8') },
    { name: 'Kotlin', iconUrl: skillIcon('kotlin', '7F52FF') },
    { name: 'PostgreSQL', iconUrl: skillIcon('postgresql', '4169E1') },
    { name: 'Docker', iconUrl: skillIcon('docker', '2496ED') },
    { name: 'Kubernetes', iconUrl: skillIcon('kubernetes', '326CE5') },
    { name: 'AWS', iconUrl: skillIcon('amazon', 'FF9900') },
    { name: 'Linux', iconUrl: skillIcon('linux', 'FCC624') },
    { name: 'Git', iconUrl: skillIcon('git', 'F05032') },
  ],
  languages: [
    { name: 'English', level: 'Fluent' },
    { name: 'Hebrew', level: 'Native' },
  ],
}

export function usePortfolioRoot(props: AppProps) {
  void props.windowId
  const os = useOs()

  const openLink = useCallback((url: string) => {
    openExternalLink(url)
  }, [])

  const openResume = useCallback(() => {
    os.win.openApp('resume')
  }, [os])

  const toolbarItems = useMemo((): ToolbarItem[] => {
    return [
      {
        id: 'email',
        label: 'Email',
        icon: { kind: 'favicon', url: faviconUrl('https://gmail.com') },
        action: () => openLink(`mailto:${portfolioProfile.email}`),
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        icon: { kind: 'favicon', url: faviconUrl(portfolioProfile.linkedIn) },
        action: () => openLink(portfolioProfile.linkedIn),
      },
      {
        id: 'github',
        label: 'GitHub',
        icon: { kind: 'favicon', url: faviconUrl(portfolioProfile.github) },
        action: () => openLink(portfolioProfile.github),
      },
      {
        id: 'resume',
        label: 'Resume',
        icon: { kind: 'nerd', glyph: nerd.pdf },
        action: openResume,
      },
    ]
  }, [openLink, openResume])

  return {
    profile: portfolioProfile,
    portraitUrl,
    openLink,
    openResume,
    toolbarItems,
  }
}
