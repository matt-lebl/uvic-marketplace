import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgList from '../../pages/Components/OrgList'; 
import { OrgEntity } from '../../interfaces'; 


const mockOrgData: OrgEntity[] = [
    {
        name: 'Organization A',
        logoUrl: 'https://example.com/logo-a.png',
        donated: 1000,
        received: false
    },
    {
        name: 'Organization B',
        logoUrl: 'https://example.com/logo-b.png',
        donated: 500,
        received: true
    },
];

describe('OrgList component', () => {
    it('renders correctly with provided orgData', () => {
        render(<OrgList orgData={mockOrgData} eventID="123" />);

        expect(screen.getByText('Organization A')).toBeInTheDocument();
        expect(screen.getByText('Organization B')).toBeInTheDocument();

        const imageElements = screen.getAllByRole('img'); 
        expect(imageElements.length).toBe(2); 

        const firstImage = imageElements[0];
        expect(firstImage).toHaveAttribute('src', 'https://example.com/logo-a.png');
    });

    it('renders with correct event ID in className', () => {
        const {container } = render(<OrgList orgData={[]} eventID="456" />);

        expect(container.firstChild).toHaveClass('OrgList#456')
    });

});
