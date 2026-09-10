import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ownerFixture, publicFixture, imageId, userId } from '../../../../tests/fixtures/profile'
import ProfileWorkspace from './profile-workspace'
import ProfileEditor from './profile-editor'
import ProfileEquipment from './profile-equipment'
import MemberProfile from './member-profile'
import { ProfilePostComposer, ProfilePosts } from './profile-posts'
import { apiData, failureMessage, uploadProfileImage } from './profile-fields'

const push = jest.fn(), refresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh }) }))
const fetchMock = jest.fn()
const response = (data: unknown, status = 200) => ({ ok: status < 400, status, json: async () => data }) as Response
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.removeAttribute('open') } })
  URL.createObjectURL = jest.fn(() => 'blob:preview')
  URL.revokeObjectURL = jest.fn()
})
beforeEach(() => { jest.clearAllMocks(); fetchMock.mockReset(); global.fetch = fetchMock; fetchMock.mockResolvedValue(response({})) })
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))
const edit = (name: string, value: string) => fireEvent.change(screen.getByLabelText(name), { target: { value } })

it('renders the approved sections with actual counts and private account settings', async () => {
  const { container } = render(<ProfileWorkspace initialProfile={ownerFixture()} publicProfile={publicFixture()} />)
  expect(screen.getByRole('heading', { name: 'Mon profil' })).toBeInTheDocument()
  expect(screen.getByRole('progressbar', { name: 'Complétude du profil' })).toHaveAttribute('value', '5')
  expect(screen.getByRole('link', { name: 'Vue membre' })).toHaveAttribute('href', `/app/profiles/${userId}`)
  expect(screen.queryByText('Niveau déclaré')).not.toBeInTheDocument()
  expect(screen.getByText('Repères personnels, pas un classement.')).toBeVisible()
  expect((await axe(container)).violations).toEqual([])
  click('Publications'); expect(screen.getByLabelText('Filtrer les publications de cette page')).toBeVisible()
  click('Matériel'); expect(screen.getByText(/Notes privées : SECRET-INVENTORY/)).toBeVisible()
  click('Réglages'); expect(screen.getByText('private-owner@example.com')).toBeVisible()
  click('Modifier : Pratique et objectifs'); expect(screen.getByRole('dialog')).toBeVisible(); click('Annuler')
  click('Modifier : Disponibilités et partenaires'); expect(screen.getByLabelText('Style de session')).toBeVisible(); click('Annuler')
  click('Modifier : Identité et présentation'); edit('Nom affiché', 'Camille modifiée')
  const updated = ownerFixture(); updated.grimpeurProfile!.displayName = 'Camille modifiée'
  fetchMock.mockResolvedValueOnce(response(updated)); click('Enregistrer')
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(screen.getByText('Profil mis à jour.')).toBeVisible()
  expect(refresh).toHaveBeenCalled()
})

it('retains the identity draft after network failure and submits no other section', async () => {
  const saved = jest.fn(), closed = jest.fn()
  render(<ProfileEditor kind="identity" profile={ownerFixture()} onClose={closed} onSaved={saved} />)
  edit('Nom affiché', 'X'); click('Enregistrer')
  expect(screen.getByLabelText('Nom affiché')).toHaveAttribute('aria-invalid', 'true')
  expect(fetchMock).not.toHaveBeenCalled()
  edit('Nom affiché', 'Camille bis'); fetchMock.mockRejectedValueOnce(new TypeError('network')); click('Enregistrer')
  await screen.findByText(/Connexion interrompue/)
  expect(screen.getByLabelText('Nom affiché')).toHaveValue('Camille bis')
  expect(saved).not.toHaveBeenCalled()
  fetchMock.mockResolvedValueOnce(response(ownerFixture())); click('Utiliser mes initiales'); click('Enregistrer')
  await waitFor(() => expect(saved).toHaveBeenCalledTimes(1))
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ section: 'identity', displayName: 'Camille bis', bio: 'Bloc et voie', location: 'Lyon', avatarMediaId: null })
})

it('keeps six disciplines with visually hidden, accessible grade labels', async () => {
  const { container } = render(<ProfileEditor kind="practice" profile={ownerFixture()} onClose={jest.fn()} onSaved={jest.fn()} />)
  const disciplines = within(screen.getByRole('group', { name: 'Disciplines et niveaux déclarés' }))
  const names = ['Bloc', 'Voie', 'Trad', 'Via ferrata', 'Grandes voies', 'Speed']
  expect(disciplines.getAllByRole('checkbox').map((checkbox) => checkbox.closest('label')?.textContent)).toEqual(names)
  expect(disciplines.getAllByRole('combobox')).toHaveLength(6)
  expect(disciplines.queryByRole('checkbox', { name: 'Escalade' })).not.toBeInTheDocument()
  for (const name of names) {
    const select = disciplines.getByRole('combobox', { name: `Niveau ${name}` }) as HTMLSelectElement
    expect(select.labels?.[0]).toHaveClass('sr-only')
    expect(select.disabled).toBe(!['Bloc', 'Voie'].includes(name))
  }
  const environment = screen.getByRole('combobox', { name: 'Environnement préféré' }) as HTMLSelectElement
  expect(environment.labels?.[0]).not.toHaveClass('sr-only')
  expect((await axe(container)).violations).toEqual([])
})

it('only removes the legacy discipline when the owner saves practice', async () => {
  const profile = ownerFixture(), saved = jest.fn(), closed = jest.fn()
  profile.grimpeurProfile!.disciplines = ['bloc', 'escalade']
  profile.grimpeurProfile!.niveaux = { bloc: '6b', escalade: '5a' }
  const { unmount } = render(<ProfileEditor kind="practice" profile={profile} onClose={closed} onSaved={saved} />)
  click('Annuler')
  expect(closed).toHaveBeenCalledTimes(1)
  expect(fetchMock).not.toHaveBeenCalled()
  expect(profile.grimpeurProfile!.disciplines).toEqual(['bloc', 'escalade'])
  unmount()
  render(<ProfileEditor kind="practice" profile={profile} onClose={closed} onSaved={saved} />)
  fetchMock.mockResolvedValueOnce(response(ownerFixture())); click('Enregistrer')
  await waitFor(() => expect(saved).toHaveBeenCalledTimes(1))
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ section: 'practice', disciplines: ['bloc'], niveaux: { bloc: '6b' } })
})

it('requires a selectable discipline before saving a legacy-only practice', async () => {
  const profile = ownerFixture(), saved = jest.fn()
  profile.grimpeurProfile!.disciplines = ['escalade']
  profile.grimpeurProfile!.niveaux = { escalade: '5a' }
  render(<ProfileEditor kind="practice" profile={profile} onClose={jest.fn()} onSaved={saved} />)
  click('Enregistrer')
  expect(screen.getByText('Vérifie les champs indiqués.')).toBeVisible()
  expect(fetchMock).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('checkbox', { name: 'Trad' }))
  edit('Niveau Trad', '6a'); fetchMock.mockResolvedValueOnce(response(ownerFixture())); click('Enregistrer')
  await waitFor(() => expect(saved).toHaveBeenCalledTimes(1))
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ section: 'practice', disciplines: ['trad'], niveaux: { trad: '6a' } })
})

it('edits practice and opt-in partner preferences using independent payloads', async () => {
  const saved = jest.fn()
  const { unmount } = render(<ProfileEditor kind="practice" profile={ownerFixture()} onClose={jest.fn()} onSaved={saved} />)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Voie' }))
  edit('Niveau Bloc', '7a'); fetchMock.mockResolvedValueOnce(response(ownerFixture())); click('Enregistrer')
  await waitFor(() => expect(saved).toHaveBeenCalled())
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ section: 'practice', disciplines: ['bloc'], niveaux: { bloc: '7a' } })
  unmount()
  render(<ProfileEditor kind="partners" profile={ownerFixture()} onClose={jest.fn()} onSaved={saved} />)
  expect(screen.getByRole('checkbox', { name: /Afficher mon matériel partagé/ })).not.toBeChecked()
  fireEvent.click(screen.getByRole('checkbox', { name: /Afficher mon matériel partagé/ }))
  fireEvent.click(screen.getByRole('checkbox', { name: /Je recherche/ }))
  fetchMock.mockResolvedValueOnce(response(ownerFixture())); click('Enregistrer')
  await waitFor(() => expect(saved).toHaveBeenCalledTimes(2))
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ section: 'partners', partnerSearch: { enabled: false, shareEquipment: true } })
})

it('reuses a staged avatar on retry and cleans it up on cancellation', async () => {
  const { unmount } = render(<ProfileEditor kind="identity" profile={ownerFixture()} onClose={jest.fn()} onSaved={jest.fn()} />)
  fireEvent.change(screen.getByLabelText('Photo de profil'), { target: { files: [new File(['bytes'], 'image.png', { type: 'image/png' })] } })
  fetchMock.mockResolvedValueOnce(response({ media: { id: imageId, url: `/api/media/${imageId}` } })).mockResolvedValue(response({ error: 'Service indisponible' }, 503))
  click('Enregistrer'); await screen.findByText('Service indisponible')
  click('Enregistrer'); await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
  expect(fetchMock.mock.calls.filter(([url]) => url === '/api/media')).toHaveLength(1)
  unmount()
  expect(fetchMock).toHaveBeenLastCalledWith(`/api/media/${imageId}`, { method: 'DELETE', keepalive: true })
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
})

it('filters inventory, edits it, confirms deletion and reports actual outcomes', async () => {
  const owner = ownerFixture(), changed = jest.fn()
  render(<ProfileEquipment equipment={owner.equipment} onChange={changed} onSharing={jest.fn()} />)
  edit('Rechercher du matériel', 'introuvable'); expect(screen.getByText('Aucun matériel à afficher')).toBeVisible(); click('Effacer les filtres')
  edit('Disponibilité', 'private'); expect(screen.getByText('Aucun matériel à afficher')).toBeVisible(); click('Effacer les filtres')
  click('Modifier Joker'); edit('Modèle ou nom', 'Joker 2')
  fetchMock.mockResolvedValueOnce(response({ equipment: { ...owner.equipment[0], model: 'Joker 2' } })); click('Enregistrer le matériel')
  await waitFor(() => expect(changed).toHaveBeenCalledWith([expect.objectContaining({ model: 'Joker 2' })]))
  click('Retirer Joker'); expect(screen.getByRole('alertdialog')).toBeVisible(); expect(fetchMock).toHaveBeenCalledTimes(1); click('Annuler')
  click('Retirer Joker'); fetchMock.mockResolvedValueOnce(response({ error: 'Erreur temporaire' }, 503)); click('Retirer l’équipement')
  await screen.findByText('Erreur temporaire'); expect(changed).toHaveBeenCalledTimes(1)
  fetchMock.mockResolvedValueOnce(response({ success: true })); click('Retirer l’équipement')
  await waitFor(() => expect(changed).toHaveBeenLastCalledWith([]))
  click('Ajouter du matériel'); expect(screen.getByRole('checkbox', { name: /Disponible pendant/ })).not.toBeChecked()
  click('Enregistrer le matériel'); expect(screen.getByLabelText('Modèle ou nom')).toHaveAttribute('aria-invalid', 'true')
  edit('Modèle ou nom', 'Nouveau'); fetchMock.mockResolvedValueOnce(response({ equipment: { ...owner.equipment[0], id: imageId, model: 'Nouveau' } })); click('Enregistrer le matériel')
  await waitFor(() => expect(changed).toHaveBeenLastCalledWith([expect.objectContaining({ model: 'Nouveau' }), owner.equipment[0]]))
})

it('reads and filters paginated posts without fake reactions', () => {
  const profile = publicFixture(); profile.pageCount = 3; profile.page = 2
  render(<ProfilePosts profile={profile} basePath="/profile/me" />)
  expect(screen.getByRole('link', { name: 'Suivante' })).toHaveAttribute('href', '/profile/me?section=posts&page=3#profile-sections')
  expect(screen.getByRole('link', { name: 'Précédente' })).toHaveAttribute('href', '/profile/me?section=posts&page=1#profile-sections')
  edit('Filtrer les publications de cette page', 'photo'); expect(screen.queryByText('Une belle session')).not.toBeInTheDocument()
  click('Lire la publication'); expect(within(screen.getByRole('dialog')).getByText('Photo de falaise')).toBeVisible(); click('Fermer')
  edit('Filtrer les publications de cette page', 'text'); click('Lire la publication'); expect(screen.getByText(/Avec des amis/)).toBeVisible()
})

it('publishes only after acknowledgement and preserves text on failure', async () => {
  const published = jest.fn()
  render(<ProfilePostComposer onClose={jest.fn()} onPublished={published} />)
  click('Publier'); expect(fetchMock).not.toHaveBeenCalled()
  edit('Ton récit', 'Une vraie session'); fetchMock.mockResolvedValueOnce(response({ error: 'Non publié' }, 503)); click('Publier')
  await screen.findByText('Non publié'); expect(published).not.toHaveBeenCalled(); expect(screen.getByLabelText('Ton récit')).toHaveValue('Une vraie session')
  fetchMock.mockResolvedValueOnce(response({ id: imageId }, 201)); click('Publier')
  await waitFor(() => expect(published).toHaveBeenCalledTimes(1))
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ content: 'Une vraie session', cotation: null })
})

it('shows member-only controls and sends one real partnership request', async () => {
  const profile = publicFixture()
  const { container } = render(<MemberProfile profile={profile} isOwner={false} canRequest initialStatus={null} />)
  expect(container.textContent).not.toContain('SECRET-INVENTORY')
  expect(screen.queryByRole('button', { name: 'Réglages' })).not.toBeInTheDocument()
  fireEvent.click(screen.getAllByRole('button', { name: 'Grimper ensemble' })[0])
  expect(fetchMock).not.toHaveBeenCalled()
  fetchMock.mockResolvedValueOnce(response({ error: 'Réessaie' }, 503)); click('Envoyer la demande'); await screen.findByText('Réessaie')
  fetchMock.mockResolvedValueOnce(response({ request: { id: imageId, senderId: imageId, recipientId: userId, status: 'pending', createdAt: '2026-09-01T12:00:00Z', updatedAt: '2026-09-01T12:00:00Z', respondedAt: null, direction: 'sent', otherParticipant: { userId, displayName: profile.displayName, avatarUrl: null, location: 'Lyon', disciplines: ['bloc'], niveaux: { bloc: '6b' } } } }))
  click('Envoyer la demande'); await screen.findByText(/Demande envoyée/)
  expect(screen.queryByRole('button', { name: 'Grimper ensemble' })).not.toBeInTheDocument()
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ recipientId: userId })
  click('Matériel partagé'); expect(screen.getByText('Aucun matériel à afficher')).toBeVisible()
})

it('handles empty profiles and already accepted partnerships', () => {
  const profile = publicFixture(); profile.posts = []; profile.disciplines = []; profile.goals = []; profile.availability = []; profile.bio = null; profile.location = null
  const { unmount } = render(<MemberProfile profile={profile} isOwner canRequest={false} initialStatus={null} initialSection="settings" />)
  expect(screen.getByText('Mon profil, côté membres')).toBeVisible(); unmount()
  render(<MemberProfile profile={profile} isOwner={false} canRequest initialStatus="accepted" />)
  expect(screen.getAllByText('Vous êtes partenaires.')).toHaveLength(2)
  click('Publications'); expect(screen.getByText('La première page est encore blanche')).toBeVisible()
})

it('validates image uploads and supplies safe errors', async () => {
  await expect(uploadProfileImage(new File(['x'], 'x.svg', { type: 'image/svg+xml' }))).rejects.toThrow(/5 Mio/)
  await expect(apiData(response({}, 401))).rejects.toThrow(/session a expiré/)
  await expect(apiData(response({}, 503))).rejects.toThrow(/Impossible d’enregistrer/)
  expect(failureMessage(null)).toMatch(/Connexion interrompue/)
})
