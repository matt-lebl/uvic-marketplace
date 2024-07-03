import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '../../pages/Components/Header'
import { MemoryRouter, Router } from 'react-router-dom'
import { fireEvent } from '@testing-library/react'
import {createMemoryHistory} from 'history'


// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`
describe('Header', () => {

  test('renders listing page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>)
    const linkElement = screen.getByText(/UVic Marketplace/i)
    expect(linkElement).toBeInTheDocument()
  })

  test('search functionality', () => {
    const { getByPlaceholderText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>)

    console.log = jest.fn()
    const searchInput = getByPlaceholderText('Search UVic Marketplace')
    fireEvent.change(searchInput, { target: { value: 'test query' } })
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 })

    expect(jest.fn()).toHaveBeenCalled
  })

  test('navigation buttons', () => {
    const history = createMemoryHistory()

    const  {getByText}  = render(
      <Router location={history.location} navigator={history}>
        <Header />
      </Router>
    );

    fireEvent.click(getByText('Browse'));
    expect(history.location.pathname).toBe('/listing/1234');

    fireEvent.click(getByText('My Listings'));
    expect(history.location.pathname).toBe('/profile');

    fireEvent.click(getByText('+'));
    expect(history.location.pathname).toBe('/new-listing');
  })
})
