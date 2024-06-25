import { render, screen, fireEvent } from '@testing-library/react'
import TabMenu from '../../pages/Components/TabMenu'

describe('TabMenu', () => {
  const id = 'tabs-id'
  const options = [
    { label: 'Tab 1', value: 'tab1' },
    { label: 'Tab 2', value: 'tab2' },
  ]
  const value = 'tab1'
  const onChange = jest.fn()

  test('renders tabs with correct id', () => {
    render(
      <TabMenu id={id} options={options} value={value} onChange={onChange} />
    )
    const tabMenu = screen.getByTestId(id)
    expect(tabMenu).toBeInTheDocument()
  })

  test('renders tabs with correct labels', () => {
    render(
      <TabMenu id={id} options={options} value={value} onChange={onChange} />
    )
    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  test('calls onChange function when a tab is clicked', () => {
    render(
      <TabMenu id={id} options={options} value={value} onChange={onChange} />
    )
    const tab = screen.getByText('Tab 2')
    fireEvent.click(tab)
    expect(onChange).toHaveBeenCalled()
  })
})
