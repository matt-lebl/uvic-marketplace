import { render, screen, fireEvent, within } from '@testing-library/react'
import DropdownMenu from './DropdownMenu'

describe('Dropdown', () => {
  const id = 'dropdown-id'
  const label = 'Select an option'
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]
  const value = 'option1'
  const onChange = jest.fn()

  test('renders dropdown with correct id', () => {
    render(
      <DropdownMenu
        id={id}
        options={options}
        value={value}
        onChange={onChange}
      />
    )
    const dropdownMenu = screen.getByTestId(id)
    expect(dropdownMenu).toBeInTheDocument()
  })

  test('renders dropdown with correct label', () => {
    render(
      <DropdownMenu
        id={id}
        label={label}
        options={options}
        value={value}
        onChange={onChange}
      />
    )
    const labelElement = screen.getByLabelText(label)
    expect(labelElement).toBeInTheDocument()
  })

  test('renders dropdown with correct options', () => {
    render(
      <DropdownMenu
        id={id}
        options={options}
        value={value}
        onChange={onChange}
      />
    )
    fireEvent.mouseDown(screen.getByRole('combobox'))
    const listbox = screen.getByRole('listbox')
    options.forEach((option) => {
      expect(within(listbox).getByText(option.label)).toBeInTheDocument()
    })
  })

  test('calls onChange function when an option is selected', () => {
    render(
      <DropdownMenu
        id={id}
        options={options}
        value={value}
        onChange={onChange}
      />
    )
    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Option 2'))
    expect(onChange).toHaveBeenCalled()
  })
})
