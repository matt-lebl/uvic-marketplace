import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react'
import ProfileIcon from './ProfileIcon';

describe('Button', () => {    
    
    test('renders Icon with correct id property and default settings (Initials for an icon)', () => {
        const id: string = 'button-id';
        const name: string = 'Test Name';
        render(<ProfileIcon id={id} name={name} />);
        const icon = screen.getByTestId(id);
        expect(icon).toHaveAttribute('id', id);
        expect(icon.querySelector('img')).toBeNull();
        expect(icon.textContent).toBe('TN');
    });

    test('renders Icon with correct image', () => {
        const id: string = 'button-id';
        const name: string = 'Test Name';
        const imageSrc: string = 'frontend/public/favicon.ico';
        render(<ProfileIcon id={id} name={name} imageSrc={imageSrc} />);
        const icon = screen.getByTestId(id);
        const avatarImg = icon.querySelector('img');
        expect(avatarImg).not.toBeNull();
        expect(avatarImg).toHaveAttribute('src', imageSrc);
    });

    test('renders Icon with no name if set to be icon only', () => {
        const id: string = 'button-id';
        const name: string = 'Test Name';
        render(<ProfileIcon id={id} name={name} />);
        const icon = screen.getByTestId(id);
        expect(icon).toHaveAttribute('id', id);
        expect(icon.querySelector('img')).toBeNull();
        expect(icon.textContent).toBe('TN');
    });

    test('renders Icon with working nav link to Profile Page of person.', () => {
        //Implementing when page exists.
    });   
});
