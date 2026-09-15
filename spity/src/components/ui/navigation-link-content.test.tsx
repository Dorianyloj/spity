import { render, screen } from '@testing-library/react'
import { useLinkStatus } from 'next/link'
import NavigationLinkContent from './navigation-link-content'

jest.mock('next/link', () => ({ useLinkStatus: jest.fn() }))
const linkStatus = jest.mocked(useLinkStatus)

it('announces a pending navigation and clears it after completion', () => {
  linkStatus.mockReturnValue({ pending: false })
  const { rerender } = render(<NavigationLinkContent label="Événements" icon={<span>Agenda</span>} />)
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
  expect(screen.getByText('Agenda')).toBeVisible()

  linkStatus.mockReturnValue({ pending: true })
  rerender(<NavigationLinkContent label="Événements" icon={<span>Agenda</span>} />)
  expect(screen.getByRole('status')).toHaveTextContent('Chargement de la page…')

  linkStatus.mockReturnValue({ pending: false })
  rerender(<NavigationLinkContent label="Événements" icon={<span>Agenda</span>} />)
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
  expect(screen.getByText('Agenda')).toBeVisible()
})
