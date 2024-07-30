import { render, screen, fireEvent } from '@testing-library/react'
import SelectInput from '../../pages/Components/SelectInput'

describe('SelectInput Component', () => {
  const setup = (
    defaultVal: string,
    onChange: jest.Mock,
    options: string[]
  ) => {
    render(
      <SelectInput
        label="Test Select"
        defaultVal={defaultVal}
        onChange={onChange}
        options={options}
      />
    )
  }

  test('renders with a valid label', () => {
    const handleChange = jest.fn()
    const options = ['Option_1', 'Option_2', 'Option_3']
    setup('Option_2', handleChange, options)
    const selectElement = screen.getByTestId('Test Select-select-label')
    expect(selectElement.textContent).toBe('Test Select')
    expect(handleChange).not.toHaveBeenCalled()
  })

  test('renders with a valid initial value', () => {
    const handleChange = jest.fn()
    const options = ['Option_1', 'Option_2', 'Option_3']
    setup('Option_2', handleChange, options)
    const selectElement = screen.getByTestId('Test Select-simple-select')
    expect(selectElement.firstElementChild?.textContent).toBe('Option 2')
    expect(handleChange).not.toHaveBeenCalled()
  })

  test('allows selecting a new valid input', () => {
    const handleChange = jest.fn()
    const options = ['Option_1', 'Option_2', 'Option_3']
    setup('Option_1', handleChange, options)

    const selectElement = screen.getByTestId('Test Select-simple-select')
    fireEvent.mouseDown(selectElement.firstElementChild!)

    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Option 2'))

    expect(selectElement.firstElementChild?.textContent).toBe('Option 2')
    expect(handleChange).toHaveBeenCalledWith('Option_2')
  })
})
