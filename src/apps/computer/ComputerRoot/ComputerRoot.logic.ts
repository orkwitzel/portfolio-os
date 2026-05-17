import { useCallback, useState } from 'react'
import type { AppProps } from '@/store/session/sessionTypes'
import { useFsStore } from '@/store/fsStore'
import { basename, extension } from '@/utils/paths'
import { useWindowManager } from '@/hooks/useWindowManager'

const DEFAULT_PATH = '/README.md'

function initialPath(launch?: { path: string }): string {
  if (!launch?.path || launch.path === '/') return DEFAULT_PATH
  return launch.path
}

export function useComputerRoot({ launch }: AppProps) {
  const nodes = useFsStore((s) => s.nodes)
  const wm = useWindowManager()
  const [selectedPath, setSelectedPath] = useState(() => initialPath(launch))

  const onSelectFile = useCallback(
    (path: string) => {
      setSelectedPath(path)
      if (extension(path) === '.txt') {
        wm.openApp('notepad', {
          title: basename(path),
          launch: { path },
        })
      }
    },
    [wm],
  )

  return { nodes, selectedPath, onSelectFile }
}
