import React from 'react'
import { render } from '@testing-library/react'
import Registration from '../pages/Registration'

describe('Registration', () => {
  test('renders the Registration page', () => {
    const { getByText } = render(<Registration />)

    expect(getByText(/Register/i)).toBeInTheDocument()
  })

  test('contains the RegisterForm component', () => {
    const { getByTestId } = render(<Registration />)

    expect(getByTestId('register-form')).toBeInTheDocument()
  })
})
