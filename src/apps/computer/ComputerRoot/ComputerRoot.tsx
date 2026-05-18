import type { AppProps } from '@/store/session/sessionTypes'
import {
  AppBody,
  ExplorerColumn,
  MainColumn,
  TreePane,
} from '@/apps/computer/computer.style'
import FsExplorerToolbar from '@/apps/computer/FsExplorerToolbar'
import FsFolderView from '@/apps/computer/FsFolderView'
import FsPlaces from '@/apps/computer/FsPlaces'
import FsPreviewPane from '@/apps/computer/FsPreviewPane'
import FsTree from '@/apps/computer/FsTree'
import { useComputerRoot } from './ComputerRoot.logic'

export default function ComputerRoot(props: AppProps) {
  const vm = useComputerRoot(props)

  const onFolderSelect = (path: string) => {
    vm.selectFile(path)
  }

  const onFolderOpen = (path: string) => {
    vm.onOpenItem(path)
  }

  return (
    <ExplorerColumn data-computer-explorer>
      <FsExplorerToolbar
        currentDir={vm.currentDir}
        canGoBack={vm.canGoBack}
        canGoForward={vm.canGoForward}
        canGoUp={vm.canGoUp}
        onBack={vm.goBack}
        onForward={vm.goForward}
        onUp={vm.goUp}
        onHome={vm.goHome}
        onNewFolder={vm.onNewFolder}
        onNewTextDocument={vm.onNewTextDocument}
        onNewShortcut={vm.onNewShortcut}
      />
      <AppBody>
        <TreePane>
          <FsPlaces currentDir={vm.currentDir} onNavigate={vm.goTo} />
          <FsTree
            nodes={vm.nodes}
            currentDir={vm.currentDir}
            selectedPath={vm.selectedPath}
            onNavigate={vm.onSelectFolder}
            onSelectFile={vm.onTreeSelectFile}
          />
        </TreePane>
        <MainColumn>
          <FsFolderView
            currentDir={vm.currentDir}
            children={vm.folderChildren}
            selectedPath={vm.selectedPath}
            onSelect={onFolderSelect}
            onOpen={onFolderOpen}
          />
          <FsPreviewPane selectedPath={vm.selectedPath} />
        </MainColumn>
      </AppBody>
    </ExplorerColumn>
  )
}
