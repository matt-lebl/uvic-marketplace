import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Searchbox from './SearchBox'

describe('<Searchbox />', () => {
  it('renders without crashing', () => {
    render(<Searchbox id="searchbox" submit={() => {}} />)
  })

  it('displays placeholder text correctly', () => {
    const placeholderText = 'Enter your search query'
    const { getByPlaceholderText } = render(
      <Searchbox
        id="searchbox"
        placeholder={placeholderText}
        submit={() => {}}
      />
    )
    expect(getByPlaceholderText(placeholderText)).toBeInTheDocument()
  })

  it('calls submit function when form is submitted', () => {
    const mockSubmit = jest.fn()
    const { getByRole } = render(
      <Searchbox id="searchbox" submit={mockSubmit} />
    )
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test search' } })
    fireEvent.submit(input.closest('form') as HTMLElement)
    expect(mockSubmit).toHaveBeenCalledWith('test search')
  })

  it('calls submit function when search button is clicked', () => {
    const mockSubmit = jest.fn()
    const { getByLabelText } = render(
      <Searchbox id="searchbox" submit={mockSubmit} />
    )
    const searchButton = getByLabelText('search')
    fireEvent.click(searchButton)
    expect(mockSubmit).toHaveBeenCalledWith('')
  })
})
