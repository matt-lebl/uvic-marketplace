import React from 'react';
import { render, screen } from '@testing-library/react'
import Button from './Button';

describe('Button', () => {
    test('renders button with correct label', () => {
        const label: string = 'Click me';
        render(<Button label={label} />);
        const button = screen.getByText(label);
        expect(button).toBeInTheDocument();
    });
});