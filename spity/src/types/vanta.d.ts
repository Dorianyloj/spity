declare module 'vanta/dist/vanta.topology.min' {
  type TopologyOptions = {
    backgroundColor?: number
    color?: number
    el: HTMLElement
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    mouseControls?: boolean
    p5: unknown
    scale?: number
    scaleMobile?: number
    touchControls?: boolean
  }

  type TopologyEffect = {
    destroy: () => void
  }

  const createTopology: (options: TopologyOptions) => TopologyEffect

  export default createTopology
}
