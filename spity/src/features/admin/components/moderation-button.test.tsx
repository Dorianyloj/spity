import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import ModerationButton from './moderation-button'

const refresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))
const fetchMock = jest.fn()
beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = fetchMock
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
const props = { kind: 'users' as const, id: '11111111-1111-4111-8111-111111111111', restricted: false, label: 'test@spity.test' }

it('announces the target, requires a reason, cancels and restores focus', async () => {
  const user = userEvent.setup()
  const { container } = render(<ModerationButton {...props} />)
  const trigger = screen.getByRole('button', { name: 'Suspendre : test@spity.test' })
  await user.click(trigger)
  expect(screen.getByRole('dialog')).toHaveAccessibleName('Suspendre ce compte ?')
  await user.type(screen.getByLabelText('Motif de modération'), 'court')
  await user.click(screen.getByRole('button', { name: 'Confirmer' }))
  expect(screen.getByRole('alert')).toHaveTextContent('8 à 500')
  expect(fetchMock).not.toHaveBeenCalled()
  expect((await axe(container)).violations).toEqual([])
  await user.click(screen.getByRole('button', { name: 'Annuler' }))
  expect(trigger).toHaveFocus()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('records the reason, blocks duplicate submissions and refreshes on success', async () => {
  const user = userEvent.setup()
  let resolve!: (result: unknown) => void
  fetchMock.mockImplementation(() => new Promise((done) => { resolve = done }))
  render(<ModerationButton {...props} />)
  await user.click(screen.getByRole('button', { name: /Suspendre :/ }))
  await user.type(screen.getByLabelText('Motif de modération'), 'Comportement inapproprié')
  await user.click(screen.getByRole('button', { name: 'Confirmer' }))
  expect(screen.getByRole('button', { name: 'Enregistrement…' })).toBeDisabled()
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  resolve({ ok: true, json: async () => ({ ok: true }) })
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
  expect(fetchMock).toHaveBeenCalledWith(`/api/admin/users/${props.id}`, expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ state: true, reason: 'Comportement inapproprié' }) }))
  expect(screen.getByRole('status')).toHaveTextContent('Action enregistrée')
})

it.each([{ kind: 'users', restricted: true, action: 'Réactiver' }, { kind: 'posts', restricted: false, action: 'Masquer' }, { kind: 'posts', restricted: true, action: 'Restaurer' }] as const)('handles $action and server failures accessibly', async ({ kind, restricted, action }) => {
  const user = userEvent.setup()
  fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: 'Accès expiré.' }) })
  render(<ModerationButton {...props} kind={kind} restricted={restricted} />)
  await user.click(screen.getByRole('button', { name: `${action} : test@spity.test` }))
  await user.type(screen.getByLabelText('Motif de modération'), 'Vérification manuelle')
  await user.click(screen.getByRole('button', { name: 'Confirmer' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Accès expiré.')
  expect(refresh).not.toHaveBeenCalled()
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
