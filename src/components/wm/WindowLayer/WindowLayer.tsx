import { WindowFrame } from '@/components/wm/WindowFrame'
import { useWindowLayer } from './WindowLayer.logic'
import { Layer } from './WindowLayer.style'

export function WindowLayer() {
  const { ordered } = useWindowLayer()

  return (
    <Layer>
      {ordered.map((w) => (
        <WindowFrame key={w.id} window={w} />
      ))}
    </Layer>
  )
}
