import { normalizePath } from '@/utils/paths'
import { PlacesButton, PlacesItem, PlacesList } from '@/apps/computer/computer.style'

const PLACES = [
  { path: '/', label: '/' },
  { path: '/desktop', label: 'desktop' },
  { path: '/docs', label: 'docs' },
  { path: '/apps', label: 'apps' },
  { path: '/www', label: 'www' },
] as const

export type FsPlacesProps = {
  currentDir: string
  onNavigate: (path: string) => void
}

export default function FsPlaces({ currentDir, onNavigate }: FsPlacesProps) {
  const dir = normalizePath(currentDir)

  return (
    <PlacesList aria-label="Places">
      {PLACES.map(({ path, label }) => (
        <PlacesItem key={path}>
          <PlacesButton
            type="button"
            $active={dir === path}
            onClick={() => onNavigate(path)}
          >
            {label}
          </PlacesButton>
        </PlacesItem>
      ))}
    </PlacesList>
  )
}
