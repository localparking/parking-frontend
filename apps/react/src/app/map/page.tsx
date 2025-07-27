import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  return (
    <div>
      <div id="map" className="h-screen" />

      <div />
    </div>
  )
}
