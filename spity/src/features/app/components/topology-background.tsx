/** Static contour lines keep the climbing identity without a canvas animation loop. */
export default function TopologyBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[#173236] opacity-50"
      style={{ backgroundImage: 'url(/images/brand/topography.svg)', backgroundSize: '800px 600px' }}
    />
  )
}
