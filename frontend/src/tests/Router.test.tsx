import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
import Router from '../pages/Router'
import { MemoryRouter } from 'react-router-dom'
import axios, { AxiosStatic, AxiosRequestConfig } from 'axios'
import APIError, {
  APIPost,
  APIGet,
  baseUrl,
  APIPatch,
  APIDelete,
  SetAxios,
} from '../APIlink'

jest.mock('../APIlink', () => ({
  APIGet: jest.fn(),
}))

const mockAPIGet = APIGet as jest.MockedFunction<typeof APIGet>

describe('Testing basic routes', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear mocks
    mockAPIGet.mockClear()
  })

  test('Homepage Navigation when logged in', async () => {
    localStorage.setItem('userID', 'A12334B345')
    mockAPIGet.mockResolvedValueOnce({userID: "A12334B345"})
    let container: HTMLElement
    await act(async () => {
      container = render(
        <MemoryRouter initialEntries={['/']}>
          <Router />
        </MemoryRouter>
      ).container
    })
    await waitFor(
      () => expect(container.innerHTML).toContain('<div class="Home">'),
      { timeout: 3000 })
  })

  test('Homepage Navigation when not logged in', () => {
    const t = render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Login">')
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
})
