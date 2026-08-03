import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CreateUserEquipmentBody, UserEquipment } from '../schemas'
import EquipmentInventorySection from './equipment-inventory-section'

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
}) as Response

const equipment: UserEquipment = {
  id: '11111111-1111-4111-8111-111111111111',
  userId: '22222222-2222-4222-8222-222222222222',
  category: 'corde',
  quantity: 1,
  brand: 'Beal',
  model: 'Joker',
  color: 'turquoise',
  size: null,
  lengthMeters: 70,
  diameterMm: '9.1',
  condition: 'bon',
  availableForPartner: true,
  notes: 'Corde falaise',
}

const parsedDraft: CreateUserEquipmentBody = {
  category: 'degaine',
  quantity: 10,
  brand: 'Petzl',
  model: 'Djinn Axess',
  color: 'bleu',
  size: null,
  lengthMeters: null,
  diameterMm: null,
  condition: 'bon',
  availableForPartner: true,
  notes: null,
}

describe('EquipmentInventorySection', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('validates then creates a manual equipment item', async () => {
    const user = userEvent.setup()
    const onEquipmentChange = jest.fn()
    fetchMock.mockResolvedValueOnce(jsonResponse({ equipment }))
    render(<EquipmentInventorySection equipment={[]} onEquipmentChange={onEquipmentChange} />)

    await user.click(screen.getByRole('button', { name: 'Ajouter' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Le modèle ou nom du matériel est requis')

    await user.type(screen.getByLabelText('Modèle'), 'Joker')
    await user.type(screen.getByLabelText('Marque'), 'Beal')
    await user.clear(screen.getByLabelText('Quantité'))
    await user.type(screen.getByLabelText('Quantité'), '1')
    await user.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(onEquipmentChange).toHaveBeenCalledWith([equipment])
    expect(await screen.findByRole('status')).toHaveTextContent('Matériel ajouté')
  })

  it('edits and deletes an existing item', async () => {
    const user = userEvent.setup()
    const onEquipmentChange = jest.fn()
    const updatedEquipment = { ...equipment, model: 'Joker Soft' }
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ equipment: updatedEquipment }))
      .mockResolvedValueOnce(jsonResponse(null, 204))
    render(<EquipmentInventorySection equipment={[equipment]} onEquipmentChange={onEquipmentChange} />)

    await user.click(screen.getByRole('button', { name: 'Modifier' }))
    const modelInput = screen.getByLabelText('Modèle')
    await user.clear(modelInput)
    await user.type(modelInput, 'Joker Soft')
    await user.click(screen.getByRole('button', { name: 'Mettre à jour' }))
    expect(onEquipmentChange).toHaveBeenCalledWith([updatedEquipment])

    await user.click(screen.getByRole('button', { name: 'Supprimer' }))
    expect(onEquipmentChange).toHaveBeenLastCalledWith([])
    expect(await screen.findByRole('status')).toHaveTextContent('Matériel supprimé')
  })

  it('parses, adjusts and saves a quick entry', async () => {
    const user = userEvent.setup()
    const onEquipmentChange = jest.fn()
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ items: [parsedDraft] }))
      .mockResolvedValueOnce(jsonResponse({ equipment: { ...equipment, ...parsedDraft } }))
    render(<EquipmentInventorySection equipment={[]} onEquipmentChange={onEquipmentChange} />)

    await user.type(screen.getByLabelText('Liste libre'), '10 dégaines Petzl Djinn Axess')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(await screen.findByText('Brouillons à valider')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 élément(s) préparé(s)')

    await user.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => expect(onEquipmentChange).toHaveBeenCalledTimes(1))
    expect(await screen.findByRole('status')).toHaveTextContent('Matériel ajouté')
  })

  it('reports API parsing errors', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Texte illisible' }, 400))
    render(<EquipmentInventorySection equipment={[]} onEquipmentChange={jest.fn()} />)

    await user.type(screen.getByLabelText('Liste libre'), '??')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Texte illisible')
  })
})
