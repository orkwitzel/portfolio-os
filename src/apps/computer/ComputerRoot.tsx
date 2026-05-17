import { useCallback, useState } from 'react'
import type { AppProps } from '../../desktop/sessionTypes'
import { useFsStore } from '../../fs/fsStore'
import { basename, extension } from '../../fs/paths'
import { useWindowManager } from '../../desktop/windowManagerContext'
import { FsDetailPane } from './FsDetailPane'
import { FsTree } from './FsTree'
import styles from './computer.module.css'

const DEFAULT_PATH = '/README.md'

function initialPath(launch?: { path: string }): string {
  if (!launch?.path || launch.path === '/') return DEFAULT_PATH
  return launch.path
}

export function ComputerRoot({ launch }: AppProps) {
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

  return (
    <div className={styles.appBody}>
      <div className={styles.treePane}>
        <FsTree
          nodes={nodes}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
        />
      </div>
      <FsDetailPane selectedPath={selectedPath} />
    </div>
  )
}
