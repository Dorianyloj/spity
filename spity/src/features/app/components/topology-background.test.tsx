import { render, waitFor } from '@testing-library/react'
import TopologyBackground from './topology-background'

const mockDestroy = jest.fn()
const mockCreateTopology = jest.fn((options: unknown) => {
  void options
  return { destroy: mockDestroy }
})

jest.mock('p5', () => ({ __esModule: true, default: function MockP5() {} }))
jest.mock('vanta/dist/vanta.topology.min', () => ({
  __esModule: true,
  default: (options: unknown) => mockCreateTopology(options),
}))

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn(() => ({ matches })),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  mockMatchMedia(false)
})

it('starts and destroys the branded topology effect', async () => {
  const { container, unmount } = render(<TopologyBackground />)

  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  expect(container.firstChild).toHaveClass('bg-[#173236]', 'opacity-50')
  await waitFor(() => expect(mockCreateTopology).toHaveBeenCalledWith(expect.objectContaining({
    backgroundColor: 0x173236,
    color: 0x8bb957,
    mouseControls: false,
    touchControls: false,
  })))

  unmount()
  expect(mockDestroy).toHaveBeenCalledTimes(1)
})

it('keeps only the static fallback when reduced motion is requested', () => {
  mockMatchMedia(true)

  render(<TopologyBackground />)

  expect(mockCreateTopology).not.toHaveBeenCalled()
})
