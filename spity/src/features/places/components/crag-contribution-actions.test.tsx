import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CragContributionActions from './crag-contribution-actions'

const refresh = jest.fn()
const fetchMock = jest.fn()

jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))

const renderActions = () => render(<CragContributionActions falaiseId="eb7c2638-3114-41b6-8917-a5dc4bc1d22e" falaiseName="Roche Corbière" />)

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = fetchMock
})

describe('CragContributionActions', () => {
  it('submits a current condition and refreshes the crag detail', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ report: { id: 'report-1' } }) } as Response)
    renderActions()

    await user.selectOptions(screen.getByLabelText('État actuel'), 'humide')
    await user.type(screen.getByLabelText('Précision facultative'), 'La dalle reste mouillée.')
    await user.click(screen.getByRole('button', { name: 'Mettre à jour l’état' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/places/reports', expect.objectContaining({ method: 'POST' })))
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toEqual({
      falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e',
      type: 'condition',
      conditionState: 'humide',
      message: 'La dalle reste mouillée.',
    })
    expect(await screen.findByText('État mis à jour. Merci pour l’info.')).toBeInTheDocument()
    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('collects the useful route fields', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ route: { id: 'route-1' } }) } as Response)
    renderActions()

    await user.click(screen.getByText('Ajouter une voie'))
    await user.type(screen.getByLabelText('Nom de la voie'), 'La sortie du loup')
    await user.type(screen.getByLabelText('Cotation'), '6a+')
    await user.selectOptions(screen.getByLabelText('Type de voie'), 'grande_voie')
    await user.type(screen.getByLabelText('Secteur'), 'Grand mur')
    await user.type(screen.getByLabelText('Hauteur (m)'), '24')
    await user.type(screen.getByLabelText('Dégaines'), '10')
    await user.selectOptions(screen.getByLabelText('Style'), 'vertical')
    await user.selectOptions(screen.getByLabelText('État de l’équipement'), 'spit_a_verifier')
    await user.click(screen.getByRole('button', { name: 'Ajouter la voie' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/places/routes', expect.objectContaining({ method: 'POST' })))
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toEqual({
      falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e',
      nom: 'La sortie du loup',
      discipline: 'grande_voie',
      cotation: '6a+',
      secteur: 'Grand mur',
      hauteur: 24,
      degaines: 10,
      style: 'vertical',
      status: 'spit_a_verifier',
    })
    expect(await screen.findByText('Voie ajoutée à la fiche.')).toBeInTheDocument()
  })

  it('handles a failed alert submission without losing the form', async () => {
    const user = userEvent.setup()
    fetchMock.mockRejectedValue(new Error('offline'))
    renderActions()

    await user.click(screen.getByText('Signaler une alerte'))
    await user.selectOptions(screen.getByLabelText('Nature de l’alerte'), 'access')
    await user.type(screen.getByLabelText('Ce qui se passe'), 'Le chemin est fermé après les pluies.')
    await user.click(screen.getByRole('button', { name: 'Envoyer l’alerte' }))

    expect(await screen.findByText('Connexion impossible. Réessaie dans un instant.')).toBeInTheDocument()
    expect(screen.getByLabelText('Ce qui se passe')).toHaveValue('Le chemin est fermé après les pluies.')
  })

  it('submits a web topo link', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ topo: { id: 'topo-1' } }) } as Response)
    renderActions()

    await user.click(screen.getByText('Ajouter un topo'))
    await user.type(screen.getByLabelText('Titre du topo'), 'Topo du grand mur')
    await user.type(screen.getByLabelText('Lien du topo'), 'https://topo.example/grand-mur')
    await user.click(screen.getByRole('button', { name: 'Ajouter le topo' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/places/topos', expect.objectContaining({ method: 'POST' })))
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toEqual({
      falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e',
      type: 'link',
      title: 'Topo du grand mur',
      url: 'https://topo.example/grand-mur',
    })
    expect(await screen.findByText('Topo ajouté à la fiche.')).toBeInTheDocument()
  })

  it('sends a PDF topo as multipart data', async () => {
    const user = userEvent.setup({ applyAccept: false })
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ topo: { id: 'topo-2' } }) } as Response)
    renderActions()

    await user.click(screen.getByText('Ajouter un topo'))
    const pdfChoice = screen.getByRole('radio', { name: /Fichier PDF/ })
    await user.click(pdfChoice)
    expect(pdfChoice).toBeChecked()
    await user.type(screen.getByLabelText('Titre du topo'), 'Topo du secteur est')
    const fileInput = screen.getByLabelText('Fichier PDF')
    const form = fileInput.closest('form')
    if (!form) throw new Error('Formulaire topo introuvable')
    fireEvent.submit(form)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/places/topos', expect.objectContaining({ method: 'POST' })))
    const body = fetchMock.mock.calls[0]?.[1]?.body as FormData
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('falaiseId')).toBe('eb7c2638-3114-41b6-8917-a5dc4bc1d22e')
    expect(body.get('type')).toBe('pdf')
    expect(body.get('title')).toBe('Topo du secteur est')
    expect(body.get('file')).toBeInstanceOf(File)
  })
})
