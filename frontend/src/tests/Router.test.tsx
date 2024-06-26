import React from 'react'
import { render } from '@testing-library/react'
import Router from '../pages/Router'
import { MemoryRouter } from 'react-router'

describe('Testing basic routes', () => {
  test('Homepage Navigation', () => {
    const t = render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Home">')
  })

  test('Login Navigation', () => {
    const t = render(
      <MemoryRouter initialEntries={['/login']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Login">')
  })

  test('Register Navigation', () => {
    const t = render(
      <MemoryRouter initialEntries={['/register']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Registration">')
  })

  test('Listing page Navigation', () => {
    const t = render(
      <MemoryRouter initialEntries={['/listing/1234']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Listing">')
  })

  test('Search page Navigation', () => {
    const t = render(
      <MemoryRouter initialEntries={['/Search']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Search">')
  })
})
