import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import PlaceReviewButton from './place-review-button'

const refresh = jest.fn()
const fetchMock = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))
expect.extend(toHaveNoViolations)

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = fetchMock
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})

it('requires a reason to reject and sends the decision', async () => {
  const user = userEvent.setup()
  const { container } = render(
    <PlaceReviewButton
      decision="reject"
      id="11111111-1111-4111-8111-111111111111"
      name="Roche Corbière"
    />
  )

  await user.click(screen.getByRole('button', { name: 'Refuser' }))
  expect(screen.getByRole('dialog')).toHaveAccessibleName('Refuser ce lieu ?')
  await user.type(screen.getByLabelText('Motif du refus'), 'court')
  await user.click(screen.getByRole('button', { name: 'Confirmer' }))
  expect(screen.getByRole('alert')).toHaveTextContent('8 caractères')

  await user.clear(screen.getByLabelText('Motif du refus'))
  await user.type(screen.getByLabelText('Motif du refus'), 'Informations incorrectes')
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) } as Response)
  await user.click(screen.getByRole('button', { name: 'Confirmer' }))

  await waitFor(() => expect(refresh).toHaveBeenCalled())
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('/api/admin/place-requests/'),
    expect.objectContaining({ method: 'PATCH' })
  )
  expect(await axe(container)).toHaveNoViolations()
})
