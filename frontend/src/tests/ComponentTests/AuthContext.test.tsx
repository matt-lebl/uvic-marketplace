import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../pages/Components/AuthContext'

// Test component to display auth status and buttons to trigger login/logout
const AuthStatus = () => {
  const { isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Logged in' : 'Logged out'}
      </div>
      <button onClick={login} data-testid="login-button">
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

  it('should show "Logged in" after login', () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('login-button'))

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in')
  })

  it('should show "Logged out" after logout', () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('login-button'))
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in')

    fireEvent.click(screen.getByTestId('logout-button'))
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged out')
  })
})
