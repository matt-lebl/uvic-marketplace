import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react'
import ProfileIcon from '../../pages/Components/ProfileIcon';

describe('ProfileIcon', () => {    
    
    test('renders Icon with correct id property and default settings (First Initial for an icon)', () => {
        const id: string = 'icon-id';
        const name: string = 'Test Name';
        render(<ProfileIcon id={id} name={name} />);
        const icon = screen.getByTestId(id);
        console.log(icon.outerHTML);

        expect(icon).toHaveAttribute('id', id);
        expect(icon.querySelector('img')).toBeNull();
        expect(icon.textContent).toBe("TN");
    });

    test('renders Icon with correct image', () => {
        const id: string = 'icon-id';
        const name: string = 'Test Name';
        const imageSrc: string = './Test_Resources/TestProfileImage.jpg';
        render(<ProfileIcon id={id} name={name} imageSrc={imageSrc} />);
        const icon = screen.getByTestId(id);
        const avatar = icon.querySelector('img');
        expect(avatar).not.toBeNull();
        expect(avatar).toHaveAttribute('src', imageSrc);
    });

    test('renders Icon with working nav link to Profile Page of person.', () => {
        //Implementing when page exists.
    });   
});
