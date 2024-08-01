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
import { DataProvider } from '../DataContext'

jest.mock('../APIlink', () => ({
  APIGet: jest.fn(),
}))
jest.mock('react-leaflet', () => jest.fn());
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))
jest.mock('../pages/Components/RecommendedListings', () => jest.fn())

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
    mockAPIGet.mockResolvedValue({ userID: 'A12334B345' })
    let container: HTMLElement
    await act(async () => {
      container = render(
        <DataProvider>
          <MemoryRouter initialEntries={['/']}>
            <Router />
          </MemoryRouter>
        </DataProvider>
      ).container
    })
    await waitFor(
      () => expect(container.innerHTML).toContain('<div class="Home">'),
      { timeout: 3000 }
    )
  })

  test('Homepage Navigation when not logged in', () => {
    const t = render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>
    )
    waitFor(() => expect(t.baseElement.innerHTML.includes('<div class="Login">')).toBeTruthy())
  })

  test('Login Navigation when not logged in', () => {
    const t = render(
      <MemoryRouter initialEntries={['/login']}>
        <Router />
      </MemoryRouter>
    )
    expect(t.baseElement.innerHTML).toContain('<div class="Login">')
  })

  test('Register Navigation when not logged in', async () => {
    const t = render(
      <MemoryRouter initialEntries={['/register']}>
        <Router />
      </MemoryRouter>
    )
    waitFor(() => expect(t.baseElement.innerHTML.includes('<div class="Login">')).toBeTruthy())
  })
})
