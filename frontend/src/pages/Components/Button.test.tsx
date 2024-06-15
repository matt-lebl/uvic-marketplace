import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  test('renders button with correct name property', () => {
    const id: string = 'button-id'
    render(<Button id={id} />)
    const button = screen.getByTestId(id)
    expect(button).toHaveAttribute('id', id)
  })

  test('renders button with correct label', () => {
    const label: string = 'Click me'
    const id: string = 'button-id'
    render(<Button id={id} label={label} />)
    const button = screen.getByText(label)
    expect(button).toBeInTheDocument()
  })

  /*
    test('renders button with correct css classes', () => {
        const id: string = 'button-id';
        const cssClass: string = "button-test";
        render(<Button id={id} className={cssClass}  />);
        const button = screen.getByTestId(id);
        expect(button).toHaveClass('button-test');
    });
    */

  test('renders button with working function', () => {
    const onClick = jest.fn()
    const id: string = 'button-id'
    render(<Button id={id} onClick={onClick} />)
    const button = screen.getByTestId(id)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalled()
  })
})
