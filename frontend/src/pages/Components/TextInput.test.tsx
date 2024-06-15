import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import TextInput from './Button'

describe('TextInput', () => {
  test('renders textinput with correct name property', () => {
    const id: string = 'input-id'
    render(<TextInput id={id} />)
    const input = screen.getByTestId(id)
    expect(input).toHaveAttribute('id', id)
  })

  test('renders textinput with correct label', () => {
    const label: string = 'Search here'
    const id: string = 'input-id'
    render(<TextInput id={id} label={label} />)
    const input = screen.getByText(label)
    expect(input).toBeInTheDocument()
  })

  test('renders button with working function', () => {
    const onClick = jest.fn()
    const id: string = 'button-id'
    render(<TextInput id={id} onClick={onClick} />)
    const button = screen.getByTestId(id)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalled()
  })
})
