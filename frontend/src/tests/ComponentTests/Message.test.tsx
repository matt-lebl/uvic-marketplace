import React from 'react'
import { render } from '@testing-library/react'
import Message from '../../pages/Components/Message'

test('renders message content', () => {
  const { getByText } = render(
    <Message content="Hello, world!" isSender={true} />
  )
  expect(getByText('Hello, world!')).toBeInTheDocument()
})

test('applies correct styles for sender', () => {
  const { getByText } = render(
    <Message content="Hello, world!" isSender={true} />
  )
  const messageElement = getByText('Hello, world!').parentElement
  expect(messageElement).toHaveStyle('background-color: #d1e7ff')
})

test('applies correct styles for receiver', () => {
  const { getByText } = render(
    <Message content="Hello, world!" isSender={false} />
  )
  const messageElement = getByText('Hello, world!').parentElement
  expect(messageElement).toHaveStyle('background-color: #f0f0f0')
})
