import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Messaging from '../pages/Messaging'

test('renders initial conversation', () => {
  const { getByText } = render(<Messaging />)
  expect(getByText('Hello, is this still available?')).toBeInTheDocument()
})

test('switches conversation when a new message is selected', () => {
  const { getByText, getAllByText } = render(<Messaging />)
  fireEvent.click(getAllByText('Jane Doe')[0])
  expect(getByText('Hello, is this still available?')).toBeInTheDocument()
})

test('sends message when Enter key is pressed', () => {
  const { getByPlaceholderText } = render(<Messaging />)
  const input = getByPlaceholderText('Write a message')
  fireEvent.change(input, { target: { value: 'New message' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  expect(input).toHaveValue('')
  expect
})
