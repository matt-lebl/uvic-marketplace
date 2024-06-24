import React from 'react'
import { render } from '@testing-library/react'
import MessageBubble from '../../pages/Components/MessageBubble'

test('renders message content', () => {
  const { getByText } = render(
    <MessageBubble content="Hello, world!" isSender={true} />
  )
  expect(getByText('Hello, world!')).toBeInTheDocument()
})

test('applies correct styles for sender', () => {
  const { getByText } = render(
    <MessageBubble content="Hello, world!" isSender={true} />
  )
  const messageBubbleElement = getByText('Hello, world!').parentElement
  expect(messageBubbleElement).toHaveStyle('background-color: #d1e7ff')
})

test('applies correct styles for receiver', () => {
  const { getByText } = render(
    <MessageBubble content="Hello, world!" isSender={false} />
  )
  const messageBubbleElement = getByText('Hello, world!').parentElement
  expect(messageBubbleElement).toHaveStyle('background-color: #f0f0f0')
})
