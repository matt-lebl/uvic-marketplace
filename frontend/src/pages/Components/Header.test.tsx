import React from 'react';
import { render, fireEvent, RenderResult, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import BrowserRouter as Router
import Header from './Header'; // Assuming the component is renamed to Header

describe('Header component', () => {
  let component:RenderResult
  beforeEach(() => {
    const component = render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    )
  })

  test('Renders Header Component', () => {
    const linkElement = screen.getByText(/UVic Marketplace/i)
    expect(linkElement).toBeInTheDocument()
  })

  test('Browse button works', () => {
    const linkElement = screen.getByText(/Browse/i)
    fireEvent.click(linkElement)
    expect(linkElement).toBeInTheDocument()
  })

});

