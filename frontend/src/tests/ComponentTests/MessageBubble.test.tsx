import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MessageBubble from '../../pages/Components/MessageBubble'

describe('MessageBubble', () => {
  it('renders the message content', () => {
    const content = 'Hello, this is a test message!'
    const { getByText } = render(
      <MessageBubble content={content} isSender={true} />
    )
    expect(getByText(content)).toBeInTheDocument()
  })

  it('applies the correct styles for the sender', () => {
    const content = 'Hello, this is a test message!'
    const { getByText } = render(
      <MessageBubble content={content} isSender={true} />
    )
    const bubble = getByText(content).parentElement
    expect(bubble).toHaveStyle('background-color: #d1e7ff')
    expect(bubble).toHaveStyle('color: #000')
  })

  it('applies the correct styles for the receiver', () => {
    const content = 'Hello, this is a test message!'
    const { getByText } = render(
      <MessageBubble content={content} isSender={false} />
    )
    const bubble = getByText(content).parentElement
    expect(bubble).toHaveStyle('background-color: #f0f0f0')
    expect(bubble).toHaveStyle('color: #000')
  })

  it('aligns the message bubble to the right for the sender', () => {
    const content = 'Hello, this is a test message!'
    const { getByText } = render(
      <MessageBubble content={content} isSender={true} />
    )
    const bubbleContainer = getByText(content).parentElement?.parentElement
    expect(bubbleContainer).toHaveStyle('justify-content: flex-end')
  })

  it('aligns the message bubble to the left for the receiver', () => {
    const content = 'Hello, this is a test message!'
    const { getByText } = render(
      <MessageBubble content={content} isSender={false} />
    )
    const bubbleContainer = getByText(content).parentElement?.parentElement
    expect(bubbleContainer).toHaveStyle('justify-content: flex-start')
  })
})
