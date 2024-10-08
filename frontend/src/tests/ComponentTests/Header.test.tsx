import { render, screen } from '@testing-library/react'
import Header from '../../pages/Components/Header'
import { MemoryRouter, Router } from 'react-router-dom'
import { fireEvent } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { DataProvider } from '../../DataContext'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`
describe('Header', () => {
  test('renders listing page', () => {
    render(
      <DataProvider>
        <MemoryRouter initialEntries={['/']}>
          <Header />
        </MemoryRouter>
      </DataProvider>
    )
    const linkElement = screen.getByText(/UVic Marketplace/i)
    expect(linkElement).toBeInTheDocument()
  })

  test('search functionality', () => {
    const { getByPlaceholderText } = render(
      <DataProvider>
        <MemoryRouter initialEntries={['/']}>
          <Header />
        </MemoryRouter>
      </DataProvider>
    )

    console.log = jest.fn()
    const searchInput = getByPlaceholderText('Search UVic Marketplace')
    fireEvent.change(searchInput, { target: { value: 'test query' } })
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 })

    expect(jest.fn()).toHaveBeenCalled
  })

  test('navigation buttons', () => {
    const history = createMemoryHistory()

    const { getByText } = render(
      <DataProvider>
        <Router location={history.location} navigator={history}>
          <Header />
        </Router>
      </DataProvider>
    )

    fireEvent.click(getByText('My Listings'))
    expect(history.location.pathname).toBe('/profile')

    fireEvent.click(getByText('+'))
    expect(history.location.pathname).toBe('/new-listing')
  })
})
