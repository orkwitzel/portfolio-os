import type { AppProps } from '@/store/session/sessionTypes'
import { AppBody, TreePane } from '@/apps/computer/computer.style'
import FsDetailPane from '@/apps/computer/FsDetailPane'
import FsTree from '@/apps/computer/FsTree'
import { useComputerRoot } from './ComputerRoot.logic'

export default function ComputerRoot(props: AppProps) {
  const vm = useComputerRoot(props)

  return (
    <AppBody>
      <TreePane>
        <FsTree
          nodes={vm.nodes}
          selectedPath={vm.selectedPath}
          onSelectFile={vm.onSelectFile}
        />
      </TreePane>
      <FsDetailPane selectedPath={vm.selectedPath} />
    </AppBody>
  )
}
