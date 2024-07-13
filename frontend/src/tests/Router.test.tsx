import React from 'react'
import { render } from '@testing-library/react'
import Router from '../pages/Router'
import { MemoryRouter } from 'react-router-dom'

describe('Testing basic routes', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  test('Homepage Navigation when logged in', () => {
    localStorage.setItem('userID', 'test-user')
    const t = render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Home">')
  })

  test('Login Navigation when not logged in', () => {
    const t = render(
      <MemoryRouter initialEntries={['/login']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Login">')
  })

  test('Register Navigation when not logged in', () => {
    const t = render(
      <MemoryRouter initialEntries={['/register']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Login">')
  })

  test('Home page when logged in', () => {
    localStorage.setItem('userID', 'test-user')
    const t = render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('Recommended Listings')
  })
})
