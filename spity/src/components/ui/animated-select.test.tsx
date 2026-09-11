import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnimatedSelect from './animated-select'

describe('AnimatedSelect', () => {
  it('selects an option with an accessible animated popup', async () => {
    const user = userEvent.setup()
    const onValueChange = jest.fn()

    render(
      <AnimatedSelect
        label="Pratique"
        onValueChange={onValueChange}
        options={[
          { label: 'Toutes pratiques', value: 'all' },
          { label: 'Bloc', value: 'bloc' },
        ]}
        value="all"
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Pratique' })
    await user.click(trigger)

    await user.click(await screen.findByRole('option', { name: 'Bloc' }))
    expect(onValueChange).toHaveBeenCalledWith('bloc')
  })
})
