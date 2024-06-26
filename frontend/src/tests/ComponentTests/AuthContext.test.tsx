import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../pages/Components/AuthContext'

const AuthStatus = () => {
  const { isAuthenticated, user, login, logout } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? `Logged in as ${user?.email}` : 'Logged out'}
      </div>
      <button
        onClick={() =>
          login({
            email: 'john@example.com',
            password: 'password',
            totp_code: '123456',
          })
        }
        data-testid="login-button"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  it('should show "Logged out" by default', () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged out')
  })

  it('should show user info after login', async () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('login-button'))

    await waitFor(() =>
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Logged in as johndoe'
      )
    )
  })

  it('should show "Logged out" after logout', async () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('login-button'))

    await waitFor(() =>
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Logged in as johndoe'
      )
    )

    fireEvent.click(screen.getByTestId('logout-button'))
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged out')
  })
})
